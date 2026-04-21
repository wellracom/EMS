"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/apiclient/apiClient";
import { useAlert } from "@/components/ui/Provider/AlertProvider";
export default function ProfilePage() {
  const { user, mutate } = useAuth();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================= FETCH USER =================
  useEffect(() => {
    if (!user?.id) return;

    const loadUser = async () => {
      try {
        setLoadingUser(true);

        const data = await apiClient(
          `/api_local/accountsettings/users/${user.id}`,
          {
            toast: { error: "Failed to load user" },
          }
        );

        if (data) {
          setUserData(data);

          setForm({
            name: data.name || "",
            email: data.email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [user?.id]);

  // ================= VALIDATION =================
 const { showAlert } = useAlert();

const validate = () => {
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    return "Invalid email format";
  }

  if (form.newPassword || form.oldPassword || form.confirmPassword) {
    if (!form.oldPassword) return "Old password is required";

    if (form.newPassword.length < 6)
      return "Password must be at least 6 characters";

    if (form.newPassword !== form.confirmPassword)
      return "Confirm password does not match"; // 🔥 MATCH VALIDATION
  }

  return null;
};

  // ================= SUBMIT =================
const handleSubmit = async () => {
  const error = validate();

  if (error) {
    showAlert("error", error);
    return;
  }

  try {
    setLoading(true);

    const res = await apiClient(`/api_local/accountsettings/profile/${user?.id}`, {
      method: "PUT",
      body: {
        name: form.name,
        email: form.email,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      },
      toast: {
        success: "Profile updated successfully",
        error: "Failed to update profile",
      },
    });

    // 🔥 pastikan ada response
    if (!res) throw new Error("No response from server");

    showAlert("success", "Profile updated!");

    mutate(); // refresh auth data

    // reset password field
    setForm((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

  } catch (err: any) {
    console.error(err);
    showAlert("error", err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  showAlert("success", "TEST ALERT");
}, []);
  // ================= LOADING =================
  if (!user || loadingUser) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-5">

        {/* READ ONLY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Username</label>
            <input
              disabled
              value={userData?.username || ""}
              className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-700 opacity-70"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Role</label>
            <input
              disabled
              value={userData?.role || ""}
              className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-700 opacity-70"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Created At</label>
            <input
              disabled
              value={
                userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleString()
                  : ""
              }
              className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-700 opacity-70"
            />
          </div>
        </div>

        {/* EDIT */}
        <div className="border-t pt-4 space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="w-full p-2 mt-1 rounded bg-gray-100 dark:bg-gray-700"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              className="w-full p-2 mt-1 rounded bg-gray-100 dark:bg-gray-700"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="border-t pt-4 space-y-3">
          <h2 className="font-semibold">Change Password</h2>

          <input
            type="password"
            placeholder="Old Password"
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={form.oldPassword}
            onChange={(e) =>
              setForm({ ...form, oldPassword: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}