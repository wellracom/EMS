export default function ChartModal({ widget, onSave }: any) {
  return (
    <div>
      <input
        className="border p-1 w-full"
        value={widget.config?.title || ""}
        onChange={(e) =>
          onSave({ title: e.target.value })
        }
      />

      <select
        className="border w-full mt-2"
        onChange={(e) =>
          onSave({ type: e.target.value })
        }
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
      </select>
    </div>
  );
}