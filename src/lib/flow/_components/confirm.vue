<script lang="tsx">
import { defineComponent, render, h, ref, computed } from "vue";

interface ConfirmProps {
  message: string;
  pageX: number;
  pageY: number;
}

let app: any = null;
const Confirm = defineComponent({
  props: {
    message: {
      type: String,
      default: "是否确定删除该节点",
    },
    pageX: {
      type: Number,
      default: 0,
    },
    pageY: {
      type: Number,
      default: 0,
    },
    offset: {
      type: Number,
      default: 7,
    },
  },
  setup(props, ctx) {
    const handleConfirm = () => {
      ctx.emit("confirm");
    };
    const handleCancel = () => {
      ctx.emit("cancel");
    };

    const page = computed(() => {
      if (!el.value) return [0, 0];
      const x = props.pageX - props.offset;
      const y = props.pageY - props.offset;
      console.log(el.value.offsetWidth, props.pageX);
      return [y, x];
    });

    const el = ref();

    return {
      handleConfirm,
      handleCancel,
      el,
      page,
    };
  },
  render() {
    return (
      <div class='message-box-layout'>
        {this.page}
        <div class='mask' onClick={this.handleCancel}></div>
        <div
          ref={(el) => (this.el = el)}
          class='message-box'
          style={{
            position: "fixed",
            top: this.page[0] + "px",
            left: this.page[1] + "px",
            zIndex: 9999,
            background: "#fff",
            boxShadow: "0 0 6px rgba(0,0,0,.3)",
            fontSize: "14px",
            borderRadius: "4px",
            overflow: "hidden",
            width: "220px",
          }}
        >
          <div>
            <div style={{ padding: "10px" }}>{this.$props.message}</div>
            <div style={{ padding: "6px 3px", display: "flex", textAlign: "center", justifyContent: "right" }}>
              <div style={{ background: "#f56c6c", color: "#fff", padding: "3px 10px" }} onClick={this.handleConfirm}>
                确定
              </div>
              <div style={{ padding: "3px 10px", marginLeft: "10px" }} onClick={this.handleCancel}>
                取消
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default {
  open(options: Partial<ConfirmProps> = {}) {
    if (app) return Promise.reject();
    const body = document.body;
    const div = document.createElement("div");

    const removeDiv = () => {
      body.removeChild(div);
      render(null, div);
      app = null;
    };

    let _resolve: any = () => {};
    let _reject: any = () => {};

    app = h(Confirm, {
      ...options,
      onConfirm() {
        _resolve("confirm");
        removeDiv();
      },
      onCancel() {
        _reject("cancel");
        removeDiv();
      },
    });
    render(app, div);
    body.appendChild(div);
    return new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
  },
};
</script>
