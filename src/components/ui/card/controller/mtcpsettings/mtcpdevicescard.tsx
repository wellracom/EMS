import React from "react";
import { FaNetworkWired } from "react-icons/fa";

export type MtcpList = {
  id: string;
  name: string;
  ip: string;
  port: number;
  unitId: number;
  timeout: number;
  isActive?: boolean;
    mtcpaddrs?: [];
  
};

type Props = {
  data: MtcpList;
};

export default function MtcpListCard({ data }: Props) {
  console.log(data)
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaNetworkWired className="text-xl text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {data.name}
          </h3>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            data.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {data.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">IP Address</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {data.ip}:{data.port}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Unit ID</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {data.unitId}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Timeout</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {data.timeout} ms
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Total Tag</p>
          <p className="font-medium text-gray-800 dark:text-white">
           {data.mtcpaddrs?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}