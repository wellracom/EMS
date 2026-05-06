// src/lib/widgetTools.ts
import { FiBarChart2, FiActivity, FiHash } from "react-icons/fi";
import { Bs123 } from "react-icons/bs";
import { LuGauge } from "react-icons/lu";
import { IoIosRadioButtonOn } from "react-icons/io";
export const widgetTools = [
  { type: "chart", label: "Chart", icon: FiBarChart2 },
  { type: "status", label: "Status", icon: FiActivity },
  { type: "number", label: "Number", icon: Bs123 },
  { type: "gauge", label: "Gauge", icon: LuGauge },
  { type: "button", label: "Button", icon: IoIosRadioButtonOn },
];