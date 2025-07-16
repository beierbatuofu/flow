export declare type NODETYPE = "node" | "condition" | "branch" | "start" | "end";
export declare interface FLOWNODE {
  id: string;
  data: Record<string, any>;
  type: NODETYPE;
  title: string;
  children?: FLOWNODE[];
}
export declare interface BRANCHNODE extends FLOWNODE {
  children: BRANCHNODE[];
}
