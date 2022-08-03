import { VueConstructor } from "vue";
import { EditorPorps } from "./types/editor";
import TiptapEditor from "./components/editor/index.vue";
export { TiptapEditor, EditorPorps };
declare const _default: {
  install: (
    Vue: VueConstructor<
      TiptapEditor<
        Record<string, any>,
        Record<string, any>,
        never,
        never,
        (
          event: string,
          ...args: any[]
        ) => TiptapEditor<
          Record<string, any>,
          Record<string, any>,
          never,
          never,
          any
        >
      >
    >
  ) => void;
};
export default _default;
