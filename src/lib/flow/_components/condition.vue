<script lang="tsx">
import { defineComponent, inject, getCurrentInstance, onMounted, type Component } from "vue";
import Confirm from "./confirm.vue";
import type { FLOWNODE } from "@src/type";

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
    parentItem: {
      type: Object,
      default: () => Object.create(null),
    },

    isBranch: {
      type: Boolean,
      default: false,
    },
    isBranchType: { type: Boolean, default: false },
    parent: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const flowConf: any = inject("flowConf");

    const handleDelCondition = (e: MouseEvent) => {
      Confirm.open({
        pageY: e.pageY,
        pageX: e.pageX,
      })
        .then(() => {
          const { item, data } = props;
          const idx = data.findIndex((i: any) => i.id === item.id);
          if (idx == void 0) return;
          if (data.length > 2) {
            data.splice(idx, 1);
          } else {
            data.length = 0;
            props.parent.data.forEach((item: FLOWNODE) => {
              const { children } = item;
              if (children && children.length) {
                const result = children.find((ite) => ite.id === (props.parentItem as FLOWNODE).id);
                result && (item.children = []);
              }
            });
          }
        })
        .catch(() => {});
    };
    return {
      flowConf,
      handleDelCondition,
    };
  },
  render() {
    const menuSlot = this.$slots.menu || (() => null);
    const defaultSlot: ((...args: any) => Component) | undefined = this.$slots.default;
    console.log(this.$slots, "this.$slots");

    return (
      <div class='condition-node'>
        <div class='line  line-top'></div>
        <div
          class='condition-content'
          onClick={() => {
            this.$emit("selected", this.$props.item);
          }}
        >
          <div class='del-node'>
            <div class='del-node-icon' onClick={this.handleDelCondition}>
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

          <div class='condition-title'>所有数据可以进入该分支</div>
          {defaultSlot ? <div class='condition-slot'>{defaultSlot(this.$props.item)}</div> : null}
        </div>
        <div class='line line-bottom'>
          <div class='node-menu'>{menuSlot()}</div>
        </div>
      </div>
    );
  },
});
</script>
<style lang="scss" scoped>
.condition {
  &-node {
    display: flex;
    flex-direction: column;
    padding: 0px 50px;
    flex: 1;
  }
  &-title {
    color: #000;
    font-size: 14px;
    padding: 10px 5px 10px 15px;
  }

  &-content {
    width: 180px;
    border-radius: 4px;
    background: #fff;
    position: relative;
    user-select: none;

    position: relative;
    z-index: 10;
    &:hover {
      .del-node {
        opacity: 1;
      }
    }
  }
}
.bottom-line {
  flex-grow: 1;
  height: 90px !important;
}
</style>
