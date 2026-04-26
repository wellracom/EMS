export type WidgetConfig = Record<string, any>;

export type Widget = {
  id: string;

  // 🔥 plugin system (chart, status, table, dll)
  type: string;

  // grid position
  x: number;
  y: number;
  w: number;
  h: number;

  // 🔥 dynamic config per widget (modal system)
  config: WidgetConfig;

  // optional UX state (VERY USEFUL)
  locked?: boolean;     // lock movement
  hidden?: boolean;     // hide widget
};

export type Page = {
  id: string;
  name: string;
  widgets: Widget[];

  // optional future scaling
  layout?: "grid" | "freeform";
};