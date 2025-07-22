<script lang="tsx">
import { defineComponent, inject, watch, ref, type Component } from "vue";
import flowNode from "./node.vue";
import flowCondition from "./condition.vue";
import type { FLOWNODE } from "@src/type";
import { creaetConditionNode } from "@src/lib/flow/_core/index";

const Branch = defineComponent({
  name: "Branch",
  components: {
    flowNode,
    flowCondition,
  },
  props: {
    isBranchType: {
      type: Boolean,
      default: false,
    },
    isBranch: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },

    parentItem: {
      type: Object,
      default: () => ({}),
    },

    onSelected: {
      type: Function,
    },
    parent: {
      type: Object,
      default: null,
    },
  },
  setup(props, ctx) {
    const flowConf: any = inject("flowConf");
    const flowData: any = inject("flowData");
    const branchRef = ref();
    const emitSelect = (node: any) => {
      ctx.emit("selected", node);
    };

    watch(
      () => props.data,
      () => {
        ctx.emit("change", props.data);
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      flowConf,
      flowData,
      emitSelect,
      branchRef,
    };
  },

  render() {
    const menuSlot: (...args: any) => Component =
      this.$slots.menu ||
      function () {
        return <div></div>;
      };

    const nodeSlot: (d: FLOWNODE) => Component =
      this.$slots.node ||
      function (_: FLOWNODE) {
        return <div></div>;
      };

    const conditionSlot: (d: FLOWNODE) => Component =
      this.$slots.condition ||
      function (_: FLOWNODE) {
        return <div></div>;
      };

    return (
      <div>
        {this.$props.data.map((item: any, index) => {
          const { type, id, children } = item;
          const className = id !== "end" ? type : "";

          return (
            <div key={index} class={className}>
              {index === 0 && this.$props.isBranchType ? (
                <>
                  <div class='branch-line lt'></div>
                  <div class='branch-line lb'></div>
                </>
              ) : null}
              {index === this.$props.data.length - 1 && this.$props.isBranchType ? (
                <>
                  <div class='branch-line rt'></div>
                  <div class='branch-line rb'></div>
                </>
              ) : null}
              {index > 0 && index < this.$props.data.length - 1 && this.$props.isBranchType ? (
                <>
                  <div class='branch-line top'></div>
                  <div class='branch-line bottom'></div>
                </>
              ) : null}
              {type === "node" && id != "end" ? (
                <flowNode
                  onSelected={this.emitSelect}
                  data={this.$props.data}
                  item={item}
                  isBranch={this.$props.isBranch}
                  isBranchType={this.$props.isBranchType}
                  parentItem={this.$props.parentItem}
                  v-slots={{
                    menu: () => {
                      const parentItem: FLOWNODE | object = this.$props.parentItem;
                      const parent = Reflect.ownKeys(parentItem).length == 0 ? this.flowData : parentItem;
                      return menuSlot(item, parent, this.flowData, this.$props.isBranch);
                    },
                    node: (d: FLOWNODE) => {
                      return nodeSlot(d);
                    },
                  }}
                />
              ) : null}

              {type === "condition" ? (
                <flowCondition
                  data={this.$props.data}
                  item={item}
                  parent={this.$props.parent}
                  onSelected={this.emitSelect}
                  isBranch={this.$props.isBranch}
                  isBranchType={this.$props.isBranchType}
                  parentItem={this.$props.parentItem}
                  v-slots={{
                    condition: (d: FLOWNODE) => {
                      return conditionSlot(d);
                    },
                    menu: () => {
                      try {
                        const parentItem: FLOWNODE | object = this.$props.parentItem;
                        const parent = Reflect.ownKeys(parentItem).length == 0 ? this.flowData : parentItem;
                        return menuSlot(item, parent, this.flowData, this.$props.isBranch);
                      } catch (e) {
                        return null;
                      }
                    },
                  }}
                />
              ) : null}

              {id === "end" ? (
                <div class='flow-end' data-id={item.id}>
                  <div>结束</div>
                </div>
              ) : null}
              {type == "branch" && children.length && !this.flowConf.readonly ? (
                <div
                  class='branch-add'
                  onClick={() => {
                    console.log("branck");
                  }}
                >
                  <i
                    class='flow-icon'
                    onClick={() => {
                      const node = creaetConditionNode();

                      item.children.push(node);
                    }}
                  >
                    <svg data-v-7a7a37b1='' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'>
                      <path fill='currentColor' d='M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z'></path>
                    </svg>
                  </i>
                </div>
              ) : null}
              {children && children.length ? (
                <Branch
                  v-slots={{
                    menu: (...args: [FLOWNODE, FLOWNODE[], boolean, any]) => {
                      return menuSlot(...args);
                    },
                    node: (d: FLOWNODE) => {
                      return nodeSlot(d);
                    },
                    condition: (d: FLOWNODE) => {
                      return conditionSlot(d);
                    },
                  }}
                  onSelected={(node: FLOWNODE) => {
                    this.$emit("selected", node);
                  }}
                  parent={item.type == "branch" ? this.$props.parent : this}
                  parentItem={item}
                  data={children}
                  class={`${item.type}-group`}
                  isBranch={true}
                  isBranchType={item.type == "branch"}
                />
              ) : null}

              {type == "branch" && children.length ? (
                <div class='branch-bottom'>
                  <div class='line'>
                    <div class='node-menu'>{menuSlot && menuSlot(item, this.$props.parentItem, this.flowData, this.$props.isBranch)}</div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
});

export default Branch as any;
</script>
<style lang="scss" scoped>
.flow {
  &-end {
    --end-padding-top: 0px;
    display: block;
    font-size: 14px;
    user-select: none;
    text-align: center;
    padding-top: var(--end-padding-top);
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      width: 1px;
      transform: translateX(-1px);
      height: var(--end-padding-top);
      background: #ccd4e0;
    }
    & > div {
      --end-height: 45px;
      height: var(--end-height);
      width: var(--end-height);
      line-height: var(--end-height);
      background: #fff;
      border-radius: var(--end-height);
      text-align: center;
      display: inline-block;
    }
  }
}

.node {
  position: relative;

  // width: 100%;
  // display: inline-flex;
}
.condition {
  z-index: 2;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-group {
    min-height: auto !important;
    padding: 0 !important;
  }
}
.branch {
  z-index: 2;
  position: relative;

  align-items: center;

  &-bottom {
    position: relative;
    max-width: 100vw;
    height: 120px;
    .line {
      height: 120px;
      min-width: var(--min-width);
      position: relative;

      &::before {
        content: "";
        background: #ccd4e0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        transform: translateX(-1px);
        z-index: 1;
      }
    }
  }
  &-add {
    color: #fff;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #fb9337;
    //   box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 21;
    top: -8px;
    left: 50%;
    transform: translateX(-8px);
    text-align: center;
    line-height: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    & > i {
      display: block;
      transform: scale(0.5);
    }
  }
}

.branch-line {
  position: absolute;
  width: 50%;
  height: 1px;
  background: #ccd4e0;
}

.top {
  top: 0;
  width: 100%;
}
.bottom {
  bottom: 0;
  width: 100%;
}
.lt {
  top: 0px;
  right: 0px;
}
.rt {
  top: 0px;
  left: 0px;
}

.lb {
  bottom: 0px;
  right: 0;
}
.rb {
  bottom: 0px;
  left: 0;
}
.branch-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
