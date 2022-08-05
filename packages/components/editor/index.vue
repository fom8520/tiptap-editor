<template>
  <div class="editor-page">
    <template v-if="editable">
      <div v-show="preview" class="preview-block">
        <div class="btn" @click="() => onPreview(false)">
          <VisibilityOffIcon :size="30" color="#757575" />
        </div>
      </div>
    </template>
    <div v-if="editable" class="editor-action-bar">
      <EditorTabsBar
        v-show="!preview"
        :actived="isActive"
        :options="options"
        @select="onSelected"
      />
      <span v-show="!preview">
        <ImageList
          ref="imageList"
          @drop="($ev) => onDrop($ev, 'imageList')"
          @dragover="onDragover"
        />
      </span>
    </div>
    <span @drop="onDrop" @dragover="onDragover">
      <EditorContent
        :editor="editor"
        class="editor-content"
        :class="{ preview }"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { PropOptions } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import Images from "./tiptap-node/image";
import imageCompression from "browser-image-compression";
import { EditorOptions, ImageUploadChangeType } from "../../types/editor";
import EditorTabsBar from "./tabs/Bar.vue";
import VisibilityOffIcon from "../icons/VisibilityOffIcon.vue";
import ImageList from "../ImageList.vue";
import "../../assets/style/mian.scss";

export default {
  name: "TipTapEditor",
  components: { VisibilityOffIcon, EditorContent, EditorTabsBar, ImageList },
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
    imageUploadChange: {
      type: Function,
      default: undefined,
    } as PropOptions<ImageUploadChangeType>,
  },
  data() {
    return {
      editor: null as null | Editor,
      preview: false,
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
  destroyed() {
    this.editor?.destroy();
  },
  methods: {
    initEditor() {
      const configs: any[] = [];

      if (this.showImage) {
        configs.push(
          Images.configure({
            inline: true,
            HTMLAttributes: {
              loading: "lazy",
            },
            style: "overflow: hidden; resize: both; padding: 5px",
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
          this.imageChange(attributes.file);
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
        case "preview":
          this.onPreview(true);
          break;
      }
    },
    onPreview(flag: boolean) {
      this.preview = flag;
      this.editor?.setEditable(!flag);
    },
    async imageChange(file: File) {
      const path = URL.createObjectURL(file);
      const image = {
        path,
        src: "",
        loading: !!this.imageUploadChange,
      };
      (this.$refs.imageList as any)?.addImageUrl?.(image);

      try {
        const src = await this.imageUploadChange?.(file);

        if (src) {
          image.src = src;
          (this.$refs.imageList as any)?.addImageUrl?.(image);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    },
    setImage(src: string) {
      this.editor
        ?.chain()
        .focus()
        .setImage({
          src,
        })
        .run();
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
    onDragover(e: DragEvent) {
      e.preventDefault();
    },
    onDrop(e: DragEvent, from: string) {
      e.preventDefault();
      const data = e.dataTransfer;
      const files = data?.files as FileList | undefined;

      const imageSrc = e.dataTransfer?.getData("imageSrc");
      if (imageSrc && from !== "imageList") {
        (this.$refs.imageList as any)?.deleteImage?.(imageSrc);
      }

      try {
        if (files && files?.length > 0) {
          for (let i = 0; i < files.length; i++) {
            this.compresseImage(files.item(i) as File);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    },
    async compresseImage(file: File) {
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
        // const url = URL.createObjectURL(file);
        this.onSelected("image", { file: file });
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

      // const url = URL.createObjectURL(compressed);
      this.onSelected("image", { file: compressed });
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-page {
  width: 100%;
  height: auto;

  .preview-block {
    height: 100%;
    position: fixed;
    top: 0;
    right: 5px;
    z-index: 99;

    .btn {
      width: 50px;
      height: 50px;
      position: sticky;
      top: 5px;
      background-color: rgba(207, 207, 207, 0.361);
      border-radius: 8px;
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .editor-action-bar {
    position: sticky;
    top: 0;
    backdrop-filter: blur(10px);
    z-index: 99;
  }

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

    &.preview {
      border: 0 !important;
      position: fixed;
      top: 0;
      left: 0;
      overflow-y: auto;

      :deep() .ProseMirror {
        .editor-image {
          overflow: inherit !important;
          resize: none !important;
          padding: 0 !important;
        }
      }
    }

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
          min-width: 100px;
          min-height: 100px;
          width: 100%;
          height: 100%;
          object-fit: inherit;
          border-radius: 4px;

          &.image-error {
            width: 100%;
            height: 100%;
            background-color: rgb(242 242 242 / 15%);
            padding: 30px;
            box-sizing: border-box;
          }
          /*
          &.image-success {
          } */

          &.image-loading {
            background: linear-gradient(
              90deg,
              hsl(0deg 2% 72% / 49%) 25%,
              hsl(0deg 4% 73% / 32%) 37%,
              hsl(0deg 7% 81% / 29%) 63%
            );
            background-size: 400% 100%;
            animation: el-skeleton-loading 1.4s ease infinite;
          }
        }
      }
    }
  }
}
</style>
