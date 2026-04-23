"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash ,FaWhmcs } from "react-icons/fa";
import MtcpModal from "@/components/ui/modal/controller/mtcpsettings/MtcpModal";
import { apiClient } from "@/lib/apiclient/apiClient";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import WSStatusIndicator from "@/components/ui/WSConnection/WSStatusIndicator";
import { useWSChannel } from "@/hooks/useWSChannel";
import Link from "next/link";
type Mtcplist = {
  id: string;
  name: string;
  ip: string;
  port: number;
  unitId: number;
  timeout: number;
};

const emptyForm = {
  name: "",
  ip: "",
  port: 502,
  unitId: 1,
  timeout: 1000,
};

export default function MtcpListPage() {
  const [data, setData] = useState<Mtcplist[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
 const WS =useWSChannel('mtcpsettings')
 

useEffect(() => {

  if (WS.data?.type === "reload") {
    fetchData();
  }
}, [WS.data]);
  // 🔹 GET ALL (pakai apiClient)
  const fetchData = async () => {
    const res = await apiClient<Mtcplist[]>("/api_local/admin/mtcp");
    if (res) setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 CREATE
  const handleCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setOpen(true);
  };

  // 🔹 EDIT
  const handleEdit = (item: Mtcplist) => {
    setForm(item);
    setEditId(item.id);
    setOpen(true);
  };

  // 🔹 DELETE (pakai confirm + toast dari apiClient)
  const handleDelete = async (id: string) => {
    await apiClient(`/api_local/admin/mtcp/${id}`, {
      method: "DELETE",
      confirm: {
        message: "Delete this MTCP device?",
      },
      toast: {
        loading: "Deleting...",
        success: "Deleted successfully",
        error: "Delete failed",
      },
    });

    fetchData();
  };

  return (
   <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold"><WSStatusIndicator status={WS.status}/>MTCP List</h1>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <FaPlus /> Add Device
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th>IP</th>
              <th>Port</th>
              <th>Unit</th>
              <th>Timeout</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b dark:border-gray-700">
                <td className="p-2">{item.name}</td>
                <td>{item.ip}</td>
                <td>{item.port}</td>
                <td>{item.unitId}</td>
                <td>{item.timeout}</td>

                <td className="flex gap-3 p-2">
                <div className="flex gap-3 items-center">
                    
  {/* EDIT */}
  <Tooltip label="Config Address Modbus">
  <Link href={`/controller/modbus-tcp/address/${item.id}`}>
  <button className="text-blue-400">
    <FaWhmcs />
  </button>
</Link>
  </Tooltip>

  {/* EDIT */}
  <Tooltip label="Edit Config">
    <button
      onClick={() => handleEdit(item)}
      className="text-yellow-400 hover:text-yellow-500 transition"
      type="button"
    >
      <FaEdit />
    </button>
  </Tooltip>

  {/* DELETE */}
  <Tooltip label="Delete">
    <button
      onClick={() => handleDelete(item.id)}
      className="text-red-500 hover:text-red-600 transition"
      type="button"
    >
      <FaTrash />
    </button>
  </Tooltip>

</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <MtcpModal
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