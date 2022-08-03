<template>
  <div class="editor-page" @drop="onDrop">
    <EditorTabsBar
      :actived="isActive"
      :options="options"
      @select="onSelected"
    />
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import Images from "./image";
import imageCompression from "browser-image-compression";
import { EditorOptions } from "../../types/editor";
import EditorTabsBar from "./tabs/Bar.vue";

export default Vue.extend({
  name: "TipTapEditor",
  components: { EditorContent, EditorTabsBar },
  props: {
    value: {
      type: String,
      default: "",
    },
    editable: {
      type: Boolean,
      default: true,
    },
    showImage: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default() {
        return {
          image: {
            memoryLimit: 10,
            isCompression: true,
          },
        };
      },
    } as PropOptions<EditorOptions | undefined>,
  },
  data() {
    return {
      editor: null as null | Editor,
    };
  },
  mounted() {
    this.initEditor();
  },
  watch: {
    value(value) {
      const isSame = this.editor?.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor?.commands.setContent(value, false);
    },
  },
  methods: {
    initEditor() {
      const configs = [];

      if (this.showImage) {
        configs.push(
          Images.configure({
            inline: true,
            HTMLAttributes: {
              loading: "lazy",
            },
            style: "overflow: hidden; resize: both;padding: 5px",
          })
        );
      }

      this.editor = new Editor({
        content: this.value,
        editable: this.editable,
        injectCSS: false,
        extensions: [
          StarterKit,
          Text,
          Highlight,
          Link.configure({
            autolink: true,
            openOnClick: !this.editable,
            linkOnPaste: true,
          }),
          CodeBlock.configure({
            HTMLAttributes: {
              style: `background-color: #0D0D0D; color: #fff`,
              class: "editor-code-block",
            },
          }),
          Blockquote.configure({
            HTMLAttributes: {
              class: "editor-blockquote",
            },
          }),
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          ...configs,
        ],
        onUpdate: ({ editor }) => {
          this.$emit("input", editor.getHTML());
        },
      });
    },
    isActive(name: string, attributes?: {} | undefined): boolean {
      return this.editor?.isActive?.(name, attributes) || false;
    },
    onSelected(type: string, attributes?: any | undefined) {
      const editor = this.editor as Editor;

      if (["strike", "bold", "italic", "highlight"].includes(type)) {
        editor.chain().focus().toggleMark(type).run();
        return;
      }

      if (["right", "left", "center"].includes(type)) {
        editor.chain().focus().setTextAlign(type).run();
        return;
      }

      switch (type) {
        case "link":
          this.onLink();
          break;
        case "linkoff":
          editor.chain().focus().unsetLink().run();
          break;
        case "heading":
          editor.chain().focus().toggleHeading(attributes).run();
          break;
        case "orderedList":
          editor.chain().focus().toggleOrderedList().run();
          break;
        case "bulletList":
          editor.chain().focus().toggleBulletList().run();
          break;
        case "codeBlock":
          editor.chain().focus().toggleCodeBlock().run();
          break;
        case "blockquote":
          editor.chain().focus().toggleBlockquote().run();
          break;
        case "image":
          this.setImage(attributes.url);
          break;
        case "undo":
          editor.chain().focus().undo().run();
          break;
        case "redo":
          editor.chain().focus().redo().run();
          break;
        case "clear":
          editor.chain().focus().selectAll().run();
          editor.chain().focus().unsetAllMarks().run();
          editor.chain().focus().unsetTextAlign().run();
          editor.chain().focus().unsetHighlight().run();
          editor.chain().focus().unsetCode().run();
          break;
        case "delete":
          editor.chain().focus().clearContent().run();
          this.$emit("input", editor.getHTML());
          break;
      }
    },
    setImage(url: string) {
      console.log(url);
      this.editor?.chain().focus().setImage({ src: url }).run();
    },
    onLink() {
      const editor = this.editor as Editor;

      const previousUrl = editor.getAttributes("link").href ?? "http://";
      const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    },
    onDrop(e: DragEvent) {
      e.preventDefault();
      const data = e.dataTransfer;
      const files = data?.files;

      try {
        if (files && files?.length > 0) {
          this.compresseImage(files);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    },
    async compresseImage(files: FileList) {
      const file = files.item(0) as File;
      const isImage = (file as File)?.type?.split("/")[0] === "image";
      const isValidSize =
        (file as File)?.size / 1024 / 1024 <
        (this.options?.image?.memoryLimit || 10);

      if (!isImage) {
        throw new Error("type error");
      }

      if (!isValidSize) {
        throw new Error("size error");
      }

      if (!this.options?.image?.isCompression || file.type === "image/gif") {
        const url = URL.createObjectURL(file);
        this.onSelected("image", { url });
        return;
      }

      // 压缩图片
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        alwaysKeepResolution: true,
      };
      const compressed: File = await imageCompression(file, options);

      const url = URL.createObjectURL(compressed);
      this.onSelected("image", { url });
    },
  },
});
</script>

<style lang="scss" scoped>
.editor-page {
  width: 100%;
  height: auto;

  .editor-content {
    width: 100%;
    height: 100%;
    max-width: 100%;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid #ebebeb78;
    border-radius: 4px;
    /* resize: both;
    overflow-y: auto; */

    :deep() .ProseMirror {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      min-height: 300px;

      p {
        margin: 0;
      }

      .editor-code-block {
        font-family: JetBrainsMono, monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        white-space: pre-line;
      }

      .editor-blockquote {
        padding-left: 1rem;
        border-left: 3px solid rgba(#0d0d0d, 0.1);
      }

      .editor-image {
        border-radius: 4px;
        max-width: 100%;
        max-height: 100%;
        box-sizing: border-box;
        display: inline-block;
        &::-webkit-scrollbar {
          background-color: #cacaca;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: inherit;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>