"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import UserModal from "@/components/AccountSettings/AccountSettingsModal";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/apiclient/apiClient";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import WSStatusIndicator from "@/components/ui/WSConnection/WSStatusIndicator";
import { useWSChannel } from "@/hooks/useWSChannel";
// ================= TYPES =================
type Role = "admin" | "operator" | "supervisor" | "maintanace";

interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role?: Role;
}

interface UserForm {
  username: string;
  name: string;
  email?: string;
  role: Role;
  password?: string;
}

// ================= COMPONENT =================
export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { user } = useAuth();
  const WS =useWSChannel('accountsettings')
 

useEffect(() => {

  if (WS.data?.type === "reload") {
    fetchUsers();
  }
}, [WS.data]);


  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      //setLoading(true);

      const data = await apiClient<User[]>(
        "/api_local/accountsettings/users",
        {
          toast: {
            error: "Failed to load users",
          },
        }
      );

      if (data) setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= MODAL =================
  const openModal = (user?: User) => {
    setEditingUser(user || null);
    setIsOpen(true);
  };

  // ================= GET CHANGED FIELDS =================
  const getChangedFields = (
    form: UserForm,
    user: User | null
  ): Partial<UserForm> => {
    const result: Partial<UserForm> = {};

    if (!user) return result;

    (Object.keys(form) as (keyof UserForm)[]).forEach((key) => {
      if (key === "password") {
        if (form.password) result.password = form.password;
        return;
      }

      if (form[key] !== user[key as keyof User]) {
        (result as any)[key] = form[key];
      }
    });

    return result;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (form: UserForm) => {
    try {
      if (editingUser) {
        const payload = getChangedFields(form, editingUser);

        if (Object.keys(payload).length === 0) {
          setIsOpen(false);
          return;
        }

        await apiClient(`/api_local/accountsettings/users/${editingUser.id}`, {
          method: "PUT",
          body: payload,
          toast: {
            success: "User updated successfully",
            error: "Failed to update user",
          },
        });
      } else {
        await apiClient("/api_local/accountsettings/users", {
          method: "POST",
          body: form,
          toast: {
            success: "User created successfully",
            error: "Failed to create user",
          },
        });
      }

      await fetchUsers();
      setIsOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    await apiClient(`/api_local/accountsettings/users/${id}`, {
      method: "DELETE",
      confirm: {
        message: "Are you sure you want to delete this user?",
      },
      toast: {
        success: "User deleted successfully",
        error: "Failed to delete user",
      },
    });

    await fetchUsers();
  };

  // ================= UI =================
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          
          <h1 className="text-2xl font-bold"><WSStatusIndicator status={WS.status}/> Account Management</h1>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <FaPlus /> Add User
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email || "-"}</td>
                  <td className="p-3">{u.role}</td>

                  {u.username !== user?.username && (
                    <td className="p-3 flex justify-center gap-3">
                      <Tooltip label="Edit Account">
                      <button onClick={() => openModal(u)}>
                        <FaEdit className="text-green-500" />
                      </button>
                      </Tooltip>
  <Tooltip label="Delete Account">
                      <button onClick={() => handleDelete(u.id)}>
                        <FaTrash className="text-red-500" />
                      </button>
                      </Tooltip>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <UserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
      />
    </div>
  );
}