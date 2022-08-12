<template>
  <div class="tiptap-editor-page">
    <template v-if="editable">
      <div v-show="preview" class="preview-block">
        <div class="btn" @click="() => onPreview(false)">
          <VisibilityOffIcon :size="30" color="#757575" />
        </div>
      </div>
    </template>
    <div v-if="editable" class="editor-action-bar" :class="options.bar.class">
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
    <div
      class="tiptap-editor-container"
      @drop="onDrop"
      @dragover="onDragover"
      @click="editorClick"
    >
      <EditorContent
        :editor="editor"
        class="editor-content"
        :style="contentStyle"
        :class="{
          preview,
          [contentClass]: !!contentClass,
          'tiptap-scrollbar-bar': editable && isScroll,
        }"
      />
    </div>
    <div v-if="editable && !preview" class="count">
      {{ `${count}/${limitCount}` }}
    </div>
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
import CharacterCount from "@tiptap/extension-character-count";
import Images from "./tiptap-node/image";
import imageCompression from "browser-image-compression";
import { EditorOptions, ImageUploadChangeType } from "../../types/editor";
import EditorTabsBar from "./tabs/Bar.vue";
import VisibilityOffIcon from "../icons/VisibilityOffIcon.vue";
import ImageList from "../ImageList.vue";
import "./../../assets/style/mian.scss";

export default {
  name: "TipTapEditor",
  components: { VisibilityOffIcon, EditorContent, EditorTabsBar, ImageList },
  props: {
    value: {
      type: String,
      default: "",
    },
    linkOnClick: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 500,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    isScroll: {
      type: Boolean,
      default: true,
    },
    onlyShowText: {
      type: Boolean,
      default: false,
    },
    limitCount: {
      type: Number,
      default: 99999,
    },
    contentClass: {
      type: String,
      default: undefined,
    },
    options: {
      type: Object,
      default() {
        return {
          image: {
            memoryLimit: 10,
            isCompression: true,
            resize: false,
          },
          bar: {
            class: "",
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
      count: 0,
      formatTypeList: [] as string[],
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
  computed: {
    contentStyle() {
      let initStyle: { [key: string]: string } = { height: "100%" };

      if (this.editable) {
        initStyle = {
          ...initStyle,
          height: `${this.height}px`,
        };

        if (!this.isScroll) {
          initStyle = {
            ...initStyle,
            height: "100%",
            minHeight: `${this.height}px`,
          };
        }
      }

      return initStyle;
    },
  },
  destroyed() {
    this.editor?.destroy();
  },
  methods: {
    initEditor() {
      const configs: any[] = [];

      if (!this.onlyShowText) {
        configs.push(
          Images.configure({
            inline: true,
            HTMLAttributes: {
              loading: "lazy",
            },
            style: this.options?.image?.resize
              ? "overflow: hidden; resize: both; padding: 5px"
              : "",
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
          CharacterCount.configure({
            limit: this.limitCount,
          }),
          Link.configure({
            autolink: true,
            openOnClick: !this.editable && this.linkOnClick,
            linkOnPaste: true,
          }),
          CodeBlock.configure({
            HTMLAttributes: {
              style: `background-color: #0D0D0D; color: #fff`,
              class: `editor-code-block ${this.onlyShowText && "code-hiddren"}`,
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
          this.count = editor.storage.characterCount.characters();
          this.$emit("input", editor.getHTML());
        },
        onBlur: () => {
          this.$emit("blur");
        },
        onFocus: () => {
          this.$emit("focus");
        },
      });
    },
    editorClick() {
      const isFocus = this.editor?.isFocused;
      if (!isFocus) {
        this.editor?.commands.focus("end");
      }
    },
    isActive(name: string, attributes?: {} | undefined): boolean {
      if (name === "brush") {
        return this.formatTypeList.length > 0;
      }

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
        case "brush":
          this.formatBrush();
          break;
      }
    },
    formatBrush() {
      const typeList = ["bold", "italic", "strike", "highlight"];

      if (this.formatTypeList.length > 0) {
        for (const name of this.formatTypeList) {
          if (!this.isActive(name)) {
            this.onSelected(name);
          }
        }
        this.formatTypeList = [];
      } else {
        const formatTypeList: string[] = [];

        for (const name of typeList) {
          if (this.isActive(name)) {
            formatTypeList.push(name);
          }
        }

        this.formatTypeList = formatTypeList;
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
          image.loading = false;
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
      if (!this.editable) return;
      e.preventDefault();

      const data = e.dataTransfer;
      const files = data?.files as FileList | undefined;

      const imageSrc = e.dataTransfer?.getData("imageSrc");
      if (imageSrc && from !== "imageList") {
        this.editor?.chain().setImage({ src: imageSrc }).run();
        (this.$refs.imageList as any)?.deleteImage?.(imageSrc);
        return;
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

<style lang="scss" scoped></style>
