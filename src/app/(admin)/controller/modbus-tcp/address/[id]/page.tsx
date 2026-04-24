"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { apiClient } from "@/lib/apiclient/apiClient";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import MtcpAddressModal from "@/components/ui/modal/controller/mtcpsettings/MtcpaddressModal";
import MtcpListCard from "@/components/ui/card/controller/mtcpsettings/mtcpdevicescard";
import WSStatusIndicator from "@/components/ui/WSConnection/WSStatusIndicator";
import { useWSChannel } from "@/hooks/useWSChannel";
/* =========================
   TYPE
========================= */

type Tag = {
  id: string;
  name: string;
  offset?: number;
  gain?: number;
  unit?: string;
  lowlow?: number;
  low?: number;
  high?: number;
  highhigh?: number;
};

type MtcpAddress = {
  id: string;
  address: number;
  functioncode: string;
  typedata: string;
  canread: boolean;
  canwrite: boolean;
  tags?: Tag[];
};

type MtcpDevice = {
  id: string;
  name: string;
  ip: string;
  port: number;
  unitId: number;
  timeout: number;
  isActive?: boolean;
  _count?: {
    mtcpaddrs: number;
  };
};

/* =========================
   COMPONENT
========================= */

export default function MtcpAddressPage() {
  const { id } = useParams();

  const [data, setData] = useState<MtcpAddress[]>([]);
  const [mtcpDevices, setMtcpDevices] = useState<MtcpDevice | null>(null);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const [loading, setLoading] = useState(true);
  const WS =useWSChannel(`mtcpaddresssettings-${id?.toString()}`)
  /* =========================
     FETCH ADDRESS
  ========================= */
  const fetchData = async () => {
    try {
      const res = await apiClient<MtcpAddress[]>(
        `/api_local/admin/mtcp/mtcpaddress?mtcpId=${id}`
      );

      if (res) setData(res);
     
    } catch (err) {
      console.error("Fetch address error:", err);
    }
  };

  useEffect(() => {
  
    if (WS.data?.type === "reload") {
      fetchData();
    }
  }, [WS.data]);
  /* =========================
     FETCH DEVICE
  ========================= */
  const fetchDataDevices = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiClient(
        `/api_local/admin/mtcp?id=${id}`
      );

      if (!res) return;
      console.log(res)
      setMtcpDevices(res);
    } catch (err) {
      console.error("Fetch device error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (!id) return;

    fetchData();
    fetchDataDevices(id.toString());
  }, [id]);

  /* =========================
     ACTIONS
  ========================= */
  const handleCreate = () => {
    setForm({ mtcpId: id });
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (item: MtcpAddress) => {
    const tag = item.tags?.[0];

    setForm({
      ...item,
      tagname: tag?.name,
      offset: tag?.offset,
      gain: tag?.gain,
      unit: tag?.unit,
      lowlow: tag?.lowlow,
      low: tag?.low,
      high: tag?.high,
      highhigh: tag?.highhigh,
    });

    setEditId(item.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await apiClient(`/api_local/admin/mtcp/mtcpaddress/${id}`, {
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

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="w-full mx-auto p-4">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 mb-6">

          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
             <WSStatusIndicator status={WS.status} showLabel={false}/> MTCP Address : {mtcpDevices?.name ?? ""}
            </h1>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus /> Add Address
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading device...</div>
          ) : (
            mtcpDevices && <MtcpListCard data={mtcpDevices} />
          )}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2">Tag</th>
                <th>Addr</th>
                <th>FC</th>
                <th>Type</th>
                <th>RW</th>
                <th>Scaling</th>
                <th>Unit</th>
                <th>Alarm</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const tag = item.tags?.[0];

                const isAlarm =
                  tag?.lowlow != null ||
                  tag?.low != null ||
                  tag?.high != null ||
                  tag?.highhigh != null;

                return (
                  <tr
                    key={item.id}
                    className={`border-b dark:border-gray-700 ${
                      isAlarm ? "bg-red-50 dark:bg-red-900/20" : ""
                    }`}
                  >
                    {/* TAG */}
                    <td className="p-2 font-medium">
                      {tag?.name ?? "-"}
                    </td>

                    {/* ADDRESS */}
                    <td>{item.address}</td>

                    {/* FC */}
                    <td>{item.functioncode}</td>

                    {/* TYPE */}
                    <td>{item.typedata}</td>

                    {/* READ WRITE */}
                    <td>
                      <div className="flex gap-1">
                        <span className={item.canread ? "text-green-500" : "text-gray-400"}>
                          R
                        </span>
                        /
                        <span className={item.canwrite ? "text-blue-500" : "text-gray-400"}>
                          W
                        </span>
                      </div>
                    </td>

                    {/* SCALING */}
                    <td>
                      <div className="text-xs">
                        <div>G: {tag?.gain ?? "-"}</div>
                        <div>O: {tag?.offset ?? "-"}</div>
                      </div>
                    </td>

                    {/* UNIT */}
                    <td>{tag?.unit ?? "-"}</td>

                    {/* ALARM */}
                    <td>
                      <div className="text-xs leading-4">
                        <div className="text-red-500">
                          LL: {tag?.lowlow ?? "-"}
                        </div>
                        <div className="text-yellow-500">
                          L: {tag?.low ?? "-"}
                        </div>
                        <div className="text-yellow-500">
                          H: {tag?.high ?? "-"}
                        </div>
                        <div className="text-red-500">
                          HH: {tag?.highhigh ?? "-"}
                        </div>
                      </div>
                    </td>

                    {/* ACTION */}
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
                );
              })}

              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-gray-400">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MODAL ================= */}
        <MtcpAddressModal
          mtcpid={id?.toString()}
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