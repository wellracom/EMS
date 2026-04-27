export default function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-bold">{title}</h2>

      <button
        onClick={onClose}
        className="text-red-500 text-sm"
      >
        ✕
      </button>
    </div>
  );
}