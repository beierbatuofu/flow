export declare type NODETYPE = "node" | "condition" | "branch" | "start" | "end";
export declare interface FLOWNODE {
  id: string;
  data: Record<string, any>;
  type: NODETYPE;
  title: string;
  status?: string;
  prarentId?: string;
  branchData?: FLOWNODE;
  children?: FLOWNODE[];
}
export declare interface BRANCHNODE extends FLOWNODE {
  children: BRANCHNODE[];
}

declare global {
  type GX = Record<string, any>;
}
