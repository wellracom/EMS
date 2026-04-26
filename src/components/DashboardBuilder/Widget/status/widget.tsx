export default function StatusWidget({ widget }: any) {
  return (
    <div className="p-2">
      🟢 sss{widget.config?.label || "Status"}
    </div>
  );
}