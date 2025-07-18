<script lang="tsx">
import { defineComponent, inject, computed, type Ref, ref, onMounted, h, type Component } from "vue";
import Confirm from "../confirm/index.vue";
import type { FLOWNODE } from "@src/type";

function IconComponent(_component: any) {
  if (!_component) return null;
  return h(_component);
}

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => [],
    },

    isBranch: {
      type: Boolean,
      default: false,
    },
    isBranchType: { type: Boolean, default: false },
  },
  setup(props: any, ctx) {
    const inputRef = ref();
    const value = ref();
    const flowConf: any = inject("flowConf");

    const iserror = computed(() => {
      if (props.item.id === "start") return false;
      if (props.item.data?.dynamic && props.item.data?.dynamic.length > 0) return false;
      if (props.item.data?.assigneeList && props.item.data?.assigneeList.length > 0) return false;
      return true;
    });

    const labelbg = computed(() => {
      let className = props.item.id == "start" ? "node-start" : "node-label";
      if (props.item.id !== "start" && flowConf?.preview) {
        //  className += ` status_${props.item.status || "not"}`;
      }
      return className;
    });
    const hasTitleName = computed(() => {
      try {
        return props.item.title == void 0;
      } catch (e) {
        return true;
      }
    });
    onMounted(() => {
      const inputEl = inputRef.value;
      if (!hasTitleName || !inputEl) return;
      inputEl.focus();
      inputEl.setSelectionRange(0, 5);
    });

    const handleDelNode = (e: MouseEvent) => {
      const { item, data } = props;
      Confirm.open({
        pageY: e.pageY,
        pageX: e.pageX,
      })
        .then(() => {
          const idx = data.findIndex((i: any) => i.id === item.id);
          if (idx == void 0) return;
          data.splice(idx, 1);
        })
        .catch(() => {});
    };

    return {
      flowConf,
      iserror,
      labelbg,
      inputRef,
      value,
      hasTitleName,
      handleDelNode,
    };
  },
  methods: {
    handleSelect() {
      this.$emit("selected", this.$props.item);
    },

    handleCopy() {},
  },
  render() {
    const menuSlot: () => Component = this.$slots.menu || (() => <></>);
    const nodeSlot: ((...args: any) => Component) | undefined = this.$slots.node;
    const { className = "custom-node", icon = "" } = this.$props.item.data;

    return (
      <div class='node-group'>
        <div class={this.$props.isBranchType ? "node-wrap branch-wrap" : "node-wrap"}>
          <div class={`node-content flow-node ` + className} node-id={this.item.id} onClick={this.handleSelect}>
            {this.item.id !== "start" ? (
              <div class='del-node'>
                <div class='del-node-icon' onClick={this.handleDelNode}>
                  <i class='flow-icon'>
                    <svg data-v-9a20e128='' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'>
                      <path
                        fill='currentColor'
                        d='M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z'
                      ></path>
                    </svg>
                  </i>
                </div>
              </div>
            ) : null}
            <div class={this.labelbg}>
              {this.item.id == "start" ? (
                <i class='flow-icon'>
                  <svg data-v-9a20e128='' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'>
                    <path
                      fill='currentColor'
                      d='M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0'
                    ></path>
                  </svg>
                </i>
              ) : null}
              <div class='title'>
                {this.hasTitleName ? (
                  <input
                    onInput={(e: Event) => {
                      this.value = String((e.target as HTMLInputElement).value).trim();
                    }}
                    ref={(el) => (this.inputRef = el)}
                    class='node-title-input'
                    autofocus
                    placeholder='请输入节点名称'
                    value={this.item.title}
                  />
                ) : (
                  <div>{this.$props.item.title}</div>
                )}
              </div>
            </div>
            {nodeSlot ? <div class='node-slot'>{nodeSlot(this.$props.item)}</div> : <></>}

            {this.hasTitleName ? (
              <div class='new-node-buttons'>
                <div class='create' onClick={() => (this.$props.item.title = this.value || "未命名节点")}>
                  创建
                </div>
                <div class='separate'></div>
                <div class='cancel' onClick={() => (this.$props.item.title = "未命名节点")}>
                  取消
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div class='line status'>{!this.hasTitleName && <div class='node-menu'>{this.flowConf.readonly ? <div></div> : menuSlot()}</div>}</div>
        </div>
      </div>
    );
  },
});
</script>
<style lang="scss" scoped>
.node {
  &-group {
    display: flex;
    font-size: 14px;
    justify-content: center;
    width: 100%;

    .title {
      text-align: center;
    }
  }
  &-wrap {
    position: relative;
  }

  &-content {
    position: relative;
    z-index: 10;
    &:hover {
      .del-node {
        opacity: 1;
      }
    }
  }
  &-label {
    height: 40px;
    border-radius: 4px;
    color: #fff;
    padding: 0 14px;
    font-size: 16px;
    display: flex;
    align-items: center;
    position: relative;
    background: #fb9337;
    user-select: none;
    i {
      display: block;
    }
    .el-icon-user {
      font-size: 20px;
    }
    .el-icon-video-play {
      font-size: 24px;
    }
    div {
      // position: absolute;
      // top: 0;
      // left: 20px;
      // line-height: 40px;
      // right: 20px;

      // text-align: center;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
      // word-break: break-all;
    }
  }
}

.branch-wrap {
  .node-content {
    top: 20px;
  }
}
.node-remove {
  display: none;
  visibility: hidden;
  * {
    display: none;
    visibility: hidden;
  }
}
.node-wrap {
  &:hover {
    .node-remove {
      display: flex;
      visibility: initial;
      * {
        display: block;
        visibility: initial;
      }
    }
  }
}

.node-title-input {
  border: none;
  width: 100%;

  font-size: 14px;
  outline: none;
  padding: 0 5px;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 3px;
  &:focus {
    border: 2px solid #268bfb;
  }
  &::selection {
    background: #94c6ff;
  }
}
.new-node-buttons {
  display: flex;
  align-items: center;
  position: relative;
  background-color: #fff;
  border-radius: 0 0 2px 2px;
  .separate {
    height: 15px;
    width: 2px;
    background: #ededed;
  }
  & > div {
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }
  .create {
    color: #fb9337;
  }
}
.node-slot {
  border-radius: 0 0 4px 4px;
  background-color: #fff;
}
</style>
