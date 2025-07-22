import simplestFlow from "./flow/index.vue";

let installed: boolean = false;

const install = function (Vue: any) {
  if (installed) return;
  installed = true;

  Vue.component("simplest-flow", simplestFlow);
};

if (typeof window !== "undefined" && (window as any).Vue) {
  install((window as any).Vue);
}
export { simplestFlow }; // 兼容按需引入
export default install; // 兼容全局引入
