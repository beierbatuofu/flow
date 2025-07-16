<script lang="tsx">
import { defineComponent, inject, getCurrentInstance, onMounted, ref } from "vue";
import Confirm from "../confirm/index.vue";
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

    onMounted(() => {
      console.log(getCurrentInstance());
    });
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

    return (
      <div class='condition-node'>
        <div class='line  line-top'></div>
        <div class='condition-box'>
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
          <div class='condition-content'>
            {!this.flowConf.preview && <h5>分支条件</h5>}
            <span class='el-icon-delete'></span>
          </div>
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
    padding: 0px 10px;
    flex: 1;
  }

  &-box {
    width: 180px;
    border-radius: 4px;
    background: #fff;

    position: relative;
    z-index: 10;
    &:hover {
      .del-node {
        opacity: 1;
      }
    }
  }
  &-content {
    position: relative;
    user-select: none;
    h5 {
      padding: 8px 0px;
      font-size: 14px;
      text-align: center;
      flex: 1;
    }

    & > span {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      &:last-child {
        color: #999;
        cursor: pointer;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
.bottom-line {
  flex-grow: 1;
  height: 90px !important;
}
</style>
