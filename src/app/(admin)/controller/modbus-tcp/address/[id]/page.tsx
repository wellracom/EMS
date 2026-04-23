"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { apiClient } from "@/lib/apiclient/apiClient";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import MtcpAddressModal from "@/components/ui/modal/controller/mtcpsettings/MtcpaddressModal";

type MtcpAddress = {
  id: string;
  address: number;
  functioncode: string;
  typedata: string;
  nickname: string;
};

export default function MtcpAddressPage() {
  const { id } = useParams(); // 🔥 ambil param dari URL

  const [data, setData] = useState<MtcpAddress[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  // 🔹 GET data berdasarkan device
  const fetchData = async () => {
    const res = await apiClient<MtcpAddress[]>(
      `/api_local/admin/mtcp/mtcpaddress?mtcpId=${id}`
    );
    if (res) setData(res);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleCreate = () => {
    setForm({ id }); // 🔥 inject id ke form
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (item: MtcpAddress) => {
    setForm(item);
    setEditId(item.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await apiClient(`/api/mtcpaddress/${id}`, {
      method: "DELETE",
      confirm: { message: "Delete this address?" },
      toast: {
        loading: "Deleting...",
        success: "Deleted",
        error: "Failed",
      },
    });

    fetchData();
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold mb-4">
        MTCP Address (Device ID: {id})
      </h1>

      <button
        onClick={handleCreate}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        <FaPlus /> Add Address
      </button>
      </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th>Nickname</th>
            <th>Address</th>
            <th>FC</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b dark:border-gray-700">
              <td className="p-2">{item.nickname}</td>
              <td>{item.address}</td>
              <td>{item.functioncode}</td>
              <td>{item.typedata}</td>

              <td className="flex gap-3 p-2">

                <Tooltip label="Edit">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-yellow-400"
                  >
                    <FaEdit />
                  </button>
                </Tooltip>

                <Tooltip label="Delete">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </Tooltip>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
   

      <MtcpAddressModal
        open={open}
        setOpen={setOpen}
        editId={editId}
        form={form}
        setForm={setForm}
        refresh={fetchData}
      />
    </div>
    </div>
  );
}