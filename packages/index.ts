import { VueConstructor } from "vue";
import { EditorPorps } from "./types/editor";
import TiptapEditor from "./components/editor/index.vue";

const components = [TiptapEditor];

const install = function (Vue: VueConstructor) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && (window as any).Vue) {
  install((window as any).Vue);
}

export { TiptapEditor, EditorPorps };
export default {
  install,
};
