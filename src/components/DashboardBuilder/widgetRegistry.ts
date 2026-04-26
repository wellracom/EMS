import ChartWidget from "./Widget/chart/widget";
import ChartModal from "./Widget/chart/modal";

import StatusWidget from "./Widget/status/widget";
import StatusModal from "./Widget//status/modal";

export const widgetRegistry: Record<
  string,
  {
    view: any;
    modal: any;
  }
> = {
  chart: {
    view: ChartWidget,
    modal: ChartModal,
  },
  status: {
    view: StatusWidget,
    modal: StatusModal,
  },
};