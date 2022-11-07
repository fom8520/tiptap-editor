import { default as Editor } from "./components/editor/index.vue";
import { VueConstructor } from "vue";
const components = [Editor];

const install = function (Vue: VueConstructor) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && (window as any).Vue) {
  install((window as any).Vue);
}

export default {
  install,
};
