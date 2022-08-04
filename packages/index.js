import TiptapEditor from "./components/editor/index.vue";
const components = [TiptapEditor];
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export { TiptapEditor };
export default {
  install,
};
//# sourceMappingURL=index.js.map
