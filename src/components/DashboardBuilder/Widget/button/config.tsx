export type ButtonWidgetConfig = {
  ui: {
    label_on: string;
    label_off: string;

    color_on: string;
    color_off: string;

    bg_on: string;
    bg_off: string;

    icon_on: string;
    icon_off: string;

    bg_opacity: number;
  };

  data: {
    field?: string;
    type?: string;
  };

  state: boolean;
};