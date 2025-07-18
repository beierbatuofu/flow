<template>
  <Flow onSelectd="handleSelectNode" style="height: 1000px" ref="flowRef" :default-data="flowData">
    <template v-slot:menu="data">
      <el-dropdown @command="handleCommand($event, data)">
        <span class="el-dropdown-link">
          <el-icon><Plus /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="node">审批节点</el-dropdown-item>
            <el-dropdown-item command="branch">分支节点</el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <!-- <div @click="handleNode(data)">menu</div>
            </template> -->
      </el-dropdown>
    </template>
    <template v-slot:node="node">
      <div>{{ node.title }}</div>
    </template>
    <template v-slot:condition="condition">
      <div>1312321</div>
    </template>
  </Flow>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Flow from "./lib/flow/index.vue";
import "./styles/index.scss";
import { Plus } from "@element-plus/icons-vue";

type NODETYPE = "node" | "branch" | "start" | "end";

export default defineComponent({
  components: {
    Flow,
    Plus,
  },
  setup() {
    const flowRef = ref();
    const flowData = ref([]);

    const handleCommand = (_command: NODETYPE, args: any[]) => {
      //统一 条件节点和普通节点添加

      if (args.length == 0) return;
      const addItem = flowRef.value.createAddNode(...args);
      let newNodeData = Object.create(null);

      switch (_command) {
        case "node":
          newNodeData = flowRef.value.createNewNode();
          break;
        case "branch":
          newNodeData = flowRef.value.createBranchNode();
          break;

        default:
          break;
      }

      addItem(newNodeData);
    };

    const handleSelectNode = (node: any) => {
      console.log("select", node);
    };

    return {
      flowRef,
      flowData,
      handleCommand,
      handleSelectNode,
    };
  },
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  border: none;
}
.el-dropdown-link {
  font-size: 16px;
  background: #fff;
  border-radius: 999px;
  color: #fb9337;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > i {
    display: block;
  }
}
</style>
