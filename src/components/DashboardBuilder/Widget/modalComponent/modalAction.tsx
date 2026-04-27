export default function ModalActions({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={onCancel}
        className="px-3 py-1 text-sm border rounded"
      >
        Cancel
      </button>

      <button
        onClick={onSave}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}