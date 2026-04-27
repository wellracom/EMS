"use client";

import { useEffect, useState } from "react";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export default function TagDataTab({ value, onChange }: Props) {
  const [devices, setDevices] = useState<any[]>([]);
  const [fields, setFields] = useState<string[]>([]);

  // =========================
  // LOAD DEVICE LIST
  // =========================
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api_local/devices");
      const json = await res.json();
      setDevices(json);
    };

    load();
  }, []);

  const LoadTags =async ()=>{

    const res= await fetch(
        `/api_local/admin/tag`
      );
      const json = await res.json();
      console.log(json)
      setFields(json);
  }

  // =========================
  // LOAD FIELD BASED DEVICE
  // =========================
  useEffect(() => {
    if (!value?.deviceId) return;
    if (value?.deviceId==='tag'){
        LoadTags()
    }
    

    //loadFields();
  }, [value?.deviceId]);

  return (
    <div className="space-y-3">

      {/* DEVICE */}
      <div>
        <label className="text-xs">Type</label>
      <select
  className="border p-1 w-full rounded"
  value={value?.type || ""}
  onChange={(e) =>
    onChange({
      ...value,
      type: e.target.value,
    })
  }
>
  <option value="">Select Type</option>

  <option value="devices">Devices</option>
  <option value="tag">Tag</option>
 

</select>
      </div>

      {/* FIELD */}
      <div>
        <label className="text-xs">Field</label>
        <select
          className="border p-1 w-full rounded"
          value={value?.field || ""}
          onChange={(e) =>
            onChange({
              ...value,
              field: e.target.value,
            })
          }
        >
          <option value="">Select Field</option>
          {fields.map((f:any) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

     

    </div>
  );
}