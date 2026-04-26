export default function ChartWidget({ widget }: any) {
  return (
    <div className="p-2">
      📊 {widget.config?.title || "Chart"}
    </div>
  );
}