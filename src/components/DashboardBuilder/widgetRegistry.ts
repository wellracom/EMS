import ChartWidget from "./Widget/chart/widget";
import ChartModal from "./Widget/chart/modal";

import StatusWidget from "./Widget/status/widget";
import StatusModal from "./Widget//status/modal";

import NumberWidget from "./Widget/number/widget"
import NumberModal from "./Widget/number/modal"
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
   number: {
    view: NumberWidget,
    modal: NumberModal,
  },
};