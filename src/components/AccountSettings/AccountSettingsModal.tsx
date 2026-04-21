"use client";

import { useEffect, useState } from "react";

type Role = "admin" | "operator" | "supervisor" | "maintanace";

interface FormType {
  username: string;
  name: string;
  email: string;
  role: Role;
  password: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: FormType) => void;
  editingUser: any;
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
}: Props) {
  const [form, setForm] = useState<FormType>({
    username: "",
    name: "",
    email: "",
    role: "operator",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormType>>({});

  useEffect(() => {
    if (editingUser) {
      setForm({
        username: editingUser.username,
        name: editingUser.name,
        email: editingUser.email || "",
        role: editingUser.role || "operator",
        password: "",
      });
    } else {
      setForm({
        username: "",
        name: "",
        email: "",
        role: "operator",
        password: "",
      });
    }

    setErrors({});
  }, [editingUser]);

  if (!isOpen) return null;

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors: Partial<FormType> = {};

    // username
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    // name
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    // email
    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // password logic
    if (!editingUser) {
      // CREATE → wajib
      if (!form.password) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      // EDIT → optional
      if (form.password && form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(form);
  };

  // ================= STYLE =================
  const inputClass = (field: keyof FormType) =>
    `w-full p-2 rounded bg-gray-100 dark:bg-gray-700 outline-none border ${
      errors[field]
        ? "border-red-500"
        : "border-transparent focus:border-blue-500"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-xl">

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {editingUser ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Username */}
          <div>
            <input
              className={inputClass("username")}
              placeholder="Username"
              value={form.username}
              disabled={!!editingUser}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <input
              className={inputClass("name")}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              className={inputClass("email")}
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <select
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 outline-none focus:border-blue-500"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as Role })
            }
          >
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="supervisor">Supervisor</option>
            <option value="maintanace">Maintenance</option>
          </select>

          {/* Password */}
          <div>
            <input
              type="password"
              className={inputClass("password")}
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter password (min 6 characters)"
              }
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {!editingUser && (
              <p className="text-xs text-gray-500 mt-1">
                Password is required
              </p>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:opacity-80"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}