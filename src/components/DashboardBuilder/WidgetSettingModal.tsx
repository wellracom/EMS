"use client";
export default function WidgetSettingModal({
  widget,
  onClose,
  onSave,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-4 w-96 rounded">
        <h2 className="font-bold mb-2">Setting {widget.type}</h2>

        <input
          className="border w-full p-1 mb-2"
          placeholder="Title"
          value={widget.config?.title || ""}
          onChange={(e) => onSave({ title: e.target.value })}
        />

        {widget.type === "chart" && (
          <select
            className="border w-full p-1"
            onChange={(e) => onSave({ type: e.target.value })}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        )}

        {widget.type === "status" && (
          <select
            className="border w-full p-1"
            onChange={(e) => onSave({ color: e.target.value })}
          >
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        )}

        <button
          onClick={onClose}
          className="mt-3 bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}