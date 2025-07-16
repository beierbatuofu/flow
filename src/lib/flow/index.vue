<script lang="tsx">
import { defineComponent, ref, type Ref, provide, reactive, onMounted, onUnmounted, watch } from "vue";
import Flow from "./_components/index";
import { Plus, Minus, Download } from "@element-plus/icons-vue";
import html2canvas from "html2canvas";
import { createDefFlowData, DEFINE_VALUE, createNewNode, createBranchNode, createAddNode } from "@src/lib/flow/_core/index";
import type { FLOWNODE } from "@src/type";
const { DEFINE_TOP, MAX_SCALE, MIN_SCALE, STEP_COUNT, MAX_LEFT, MAX_TOP } = DEFINE_VALUE;

export default defineComponent({
  name: "Flow",
  components: {
    "flow-branch": Flow.Branch,
  },
  props: {
    defaultData: {
      type: Array,
      default: () => createDefFlowData(),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    //TODO  clone props.data
    const count: Ref<number> = ref(1);
    const flowRef: Ref<unknown> = ref();
    const flowWrapRef: Ref<unknown> = ref();
    const nodeIdx = ref(-1);
    const page = reactive({
      x: 0,
      y: DEFINE_TOP,
    });
    const diff = reactive({
      x: 0,
      y: 0,
      type: "up",
    });

    const flowData = ref(createDefFlowData());
    const scaleValue = ref(100);
    const flowConf = reactive({
      copyNode: Object.create(null),
      readonly: false,
      preview: props.preview,
    });

    function findNewIndex(newData: any[], oldData: any) {
      if (oldData.length == 0) {
        return 1;
      }
      let curr = -1;
      newData.some((item, _idx) => {
        if (oldData.some((oldItem: any) => oldItem.id == item.id)) {
          curr = _idx;
          return false;
        }
        return true;
      });

      return curr + 1;
    }

    watch(
      () => props.defaultData,
      (newVal, oldVal) => {
        if (props.defaultData.length == 0) return;

        nodeIdx.value = findNewIndex(newVal, oldVal);
        flowData.value = newVal as any;
        count.value++;
      },
      {
        deep: true,
        immediate: true,
      }
    );

    function setTransformStyle<T extends number>(x: T, y: T, s: T) {
      (flowRef.value as HTMLBaseElement).setAttribute("style", `transform:translate(${x}px, ${y}px) scale(${s / 100})`);
    }

    const handleMouse = (e: MouseEvent) => {
      //    console.log(e);
      e.stopPropagation();
      if (diff.type !== "down") return;
      let pagex = e.pageX;
      let pagey = e.pageY;
      const flowWrapHeight = (flowWrapRef.value as HTMLBaseElement).offsetHeight;
      const flowWrapWidth = (flowWrapRef.value as HTMLBaseElement).offsetWidth;
      //  console.log(flowWrapHeight, flowWrapWidth, "flowWrapHeight", "flowWrapWidth");
      if (e.pageX > flowWrapWidth - MAX_LEFT) pagex = flowWrapWidth - MAX_LEFT;
      if (e.pageY > flowWrapHeight - MAX_TOP) pagey = flowWrapHeight - MAX_TOP;
      if (e.pageX <= MAX_LEFT) pagex = MAX_LEFT;
      if (e.pageY <= MAX_TOP) pagey = MAX_TOP;

      page.x = pagex - diff.x;
      page.y = pagey - diff.y;
      //  console.log(page.y);

      setTransformStyle(page.x, page.y, scaleValue.value);
    };

    const handleMouseUp = () => {
      diff.type = "up";
      diff.x = 0;
      diff.y = 0;
    };

    provide("flowConf", flowConf);
    provide("nodeIdx", nodeIdx);
    provide("readonly", props.readonly);
    provide("flowData", flowData);
    onMounted(() => {
      document.addEventListener("mousemove", handleMouse);
      document.addEventListener("mouseup", handleMouseUp);
      setTransformStyle(0, DEFINE_TOP, 100);
      //document.addEventListener("mouseout", handleMouseUp);
    });
    onUnmounted(() => {
      document.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseup", handleMouseUp);
      // document.removeEventListener("mouseout", handleMouseUp);
    });

    ctx.expose({
      createNewNode,
      createBranchNode,
      createAddNode,
    });

    return { flowData, count, flowWrapRef, handleMouseUp, diff, scaleValue, flowRef, page, setTransformStyle };
  },
  methods: {
    handlePlus() {
      this.scaleValue += STEP_COUNT;
      if (this.scaleValue >= MAX_SCALE) this.scaleValue = MAX_SCALE;

      this.setTransformStyle(this.page.x, this.page.y, this.scaleValue);
    },
    handleMinus() {
      this.scaleValue -= STEP_COUNT;
      if (this.scaleValue <= MIN_SCALE) this.scaleValue = MIN_SCALE;

      this.setTransformStyle(this.page.x, this.page.y, this.scaleValue);
    },
    handleNewNode(node: any) {
      this.$emit("addNode", node);
    },
    handleSelect(node: any) {
      this.$emit("select", node);
    },
    handleDownLoad() {
      html2canvas((this.flowRef as HTMLBaseElement).parentNode as HTMLElement).then((canvas) => {
        const base64 = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = base64;
        a.download = `流程图_${new Date().getTime()}.png`;
        a.click();
      });
    },
    handleMouseDown(e: MouseEvent) {
      const el = this.flowRef as HTMLBaseElement;
      const result: any = (el.getAttribute("style") as string).match(/translate\(([^\)]*)\)/);
      if (!result) return;
      const [x, y] = result[1].replace(/px/g, "").split(",");
      this.diff.x = e.pageX - el.offsetLeft - Number(x);
      this.diff.y = e.pageY - el.offsetTop - Number(y);
      this.diff.type = "down";

      e.stopPropagation();
    },
  },
  render() {
    const menuSlot: any = this.$slots.menu || new Function();

    return (
      <div class='flow-wrap' ref={(el) => (this.flowWrapRef = el)}>
        <div class='flow-top'>
          <div class='menus'>
            <div class='download' onClick={this.handleDownLoad}>
              <el-button link size='small' class='button' icon={Download} />
            </div>
            <div class='scale'>
              <div class='plus' onClick={this.handlePlus}>
                <el-button link size='small' class='button' icon={Plus} />
              </div>
              <div class='scale-value'>{String(this.scaleValue) + "%"}</div>
              <div class='minus' onClick={this.handleMinus}>
                <el-button link size='small' class='button' icon={Minus} />
              </div>
            </div>
          </div>
        </div>

        <div class='flow-body'>
          <div class='container'>
            <div ref={(el) => (this.flowRef = el)} onMousedown={this.handleMouseDown} onMouseup={this.handleMouseUp}>
              <flow-branch
                onSelected={(_node: any) => {
                  console.log(_node, "node");
                }}
                onChange={(d: any) => {
                  this.$emit("change", d);
                }}
                key={this.count}
                data={this.flowData}
                v-slots={{
                  cond: () => {
                    return <div>1</div>;
                  },
                  node: () => {
                    return <div>1</div>;
                  },
                  menu: (...args: any) => {
                    return menuSlot(args);
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
</script>
<style lang="scss" scoped>
.container {
  overflow: auto;
  min-height: 100%;
}
.flow {
  &-top {
    position: relative;
    z-index: 99;
    // top: 0px;
    // right: 20px;
    display: flex;
    font-size: 12px;
    color: #333;
    user-select: none;

    .menus {
      position: fixed;
      top: 20px;
      right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        font-size: 17px;
      }
    }
    .scale {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &::before {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        background: #ccd4e0;
        margin: 0 10px;
      }
      &-value {
        font-size: 12px;
        color: #999;
        padding: 0 10px;
        width: 50px;
        text-align: center;
        box-sizing: border-box;
      }
    }

    .num {
      font-size: 16px;
      width: 62px;
      text-align: center;
    }
  }
  &-body {
    flex: 1;
  }
  &-wrap {
    position: relative;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
  }
  &-box {
    width: 100%;
    transition: transform 0.3s;
    position: relative;
    display: flex;
    align-items: center;
    min-width: min-content;
    font-size: 14px;
    flex-direction: column;
    min-height: 100%;
    padding: 80px 10px 20px;
    transform-origin: top left;
  }
}
</style>
