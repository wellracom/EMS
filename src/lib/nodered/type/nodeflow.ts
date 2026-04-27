export type NodeRedFlow = {
  id: string;
  label: string;
  disabled?: boolean;
  info?: string;

  env: NodeRedEnv[];

  nodes: any[];
};

export type NodeRedEnv = {
  name: string;
  value: any;
  type: "str" | "num" | "bool" | "json" | "conf";
};

export type NodeRedNode = {
  id: string;
  type: string;

  z?: string; // flow id container (important di Node-RED)

  name?: string;

  url?: string;
  method?: string;

  upload?: boolean;
  skipBodyParsing?: boolean;

  x?: number;
  y?: number;

  wires?: string[][];

  subflow?: string;

  env?: NodeRedEnv[];

  [key: string]: any; // fleksibel untuk node custom (http, function, subflow)
};