// src/components/builder/WidgetRenderer.tsx
export default function WidgetRenderer({ widget }: any) {
  switch (widget.type) {
    case "chart":
      return <div>📊 Chart Widget</div>;
    case "status":
      return <div>🟢 Status Widget</div>;
    case "gauge":
      return <div>⏱ Gauge Widget</div>;
    default:
      return <div>Unknown Widget</div>;
  }
}