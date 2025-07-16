import type { FLOWNODE, NODETYPE } from "@src/type";

export const DEFINE_VALUE = {
  MAX_SCALE: 200,
  MIN_SCALE: 10,
  STEP_COUNT: 10,
  MAX_TOP: 30,
  MAX_LEFT: 30,
  DEFINE_TOP: 100,
};

const NODE_CONFIG = Symbol("NODE_CONFIG");

class NodeTemplate<T extends FLOWNODE> {
  private [NODE_CONFIG] = {
    id: "",
    data: {},
    type: "",
    title: "",
  };

  public set(_config: Partial<T>) {
    this[NODE_CONFIG] = Object.assign(this[NODE_CONFIG], _config);
  }

  public get() {
    return this[NODE_CONFIG] as T;
  }

  private filters = ["start", "end"];

  constructor(t: NODETYPE) {
    const isNotStartOrEndNode = this.filters.includes(t);
    let type = isNotStartOrEndNode ? "node" : t;
    let id = isNotStartOrEndNode ? t : createUuid(t);
    this.set({
      id,
      type,
    } as T);
  }
}

/**
 * export function create new node  导出新节点
 * export function create new branch 导出新分支
 * export createUuid 导出唯一id
 * 修改classname
 * 创建 config 配置文件
 */

const randoms: Set<number> = new Set();
export function createUuid(type: NODETYPE): `${NODETYPE}_${string}` {
  let r: number = window.crypto.getRandomValues(new Uint32Array(1))[0];
  randoms.add(r);
  while (!randoms.has(r)) {
    r = window.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return `${type}_${String(Date.now() + r)}`;
}

export function createNewNode() {
  const nodeTplIns = new NodeTemplate<FLOWNODE>("node");
  nodeTplIns.set({
    title: undefined,
  });
  return nodeTplIns.get();
}

export function createDefFlowData() {
  const start = new NodeTemplate<FLOWNODE>("start");
  const end = new NodeTemplate<FLOWNODE>("end");
  start.set({
    title: "申请人",
  });
  end.set({
    title: "结束节点",
  });

  return [start.get(), end.get()];
}

export function creaetConditionNode() {
  const ins = new NodeTemplate<FLOWNODE>("condition");
  ins.set({
    children: [],
  });
  return ins.get();
}
export function createBranchNode() {
  const branch = new NodeTemplate<FLOWNODE>("branch");

  const branchChildren = new Array(2).fill(0).map(() => JSON.parse(JSON.stringify(creaetConditionNode())));
  branch.set({
    children: branchChildren,
    title: "未命名节点",
  });

  return branch.get();
}

export function createAddNode(item: FLOWNODE, parent: any, flow: FLOWNODE[], isBranch: boolean) {
  let pushItem: any[] = [];
  let idx = 0;

  if (isBranch) {
    if (item.type == "condition") {
      const i = parent.children.findIndex((i: any) => i.id === item.id);
      pushItem = parent.children[i].children;
      idx = -1;
    }
    if (item.type == "node" || item.type == "branch") {
      idx = parent.children.findIndex((i: any) => i.id === item.id);
      pushItem = parent.children;
    }
  } else {
    idx = (flow as FLOWNODE[]).findIndex((i: any) => i.id === item.id);
    pushItem = flow;
  }

  return function (node: FLOWNODE) {
    pushItem.splice(idx + 1, 0, node);

    return flow;
  };
}
