<template>
  <div class="editor-tabs-bar tiptap-scrollbar-bar">
    <div class="group">
      <div
        v-for="(name, index) in ['bold', 'italic', 'strike', 'highlight']"
        :key="index"
        class="icon-button"
        :class="{ actived: isActive(name) }"
        @click.stop="() => onSelect(name)"
      >
        <component :is="components[name]" :size="size" :color="color" />
      </div>
      <Dropdown placement="bottom">
        <div class="icon-button">
          <FontSizeIcon :size="size" :color="color" />
        </div>
        <DropdownMenu slot="dropdown">
          <DropdownItem style="padding: 0 5px" v-for="i in 6" :key="i">
            <div
              class="font-size-menu"
              @click="() => onSelect('heading', { level: i })"
            >
              <span>
                <DoneIcon
                  v-show="isActive('heading', { level: i })"
                  :size="14"
                />
              </span>
              <span> H {{ i }} </span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="divider" />
    <div class="group">
      <div
        class="icon-button"
        :class="{ actived: isActive('bulletList') }"
        @click.stop="() => onSelect('bulletList')"
      >
        <UnorderListIcon :size="size" :color="color" />
      </div>
      <div
        class="icon-button"
        :class="{ actived: isActive('orderedList') }"
        @click.stop="() => onSelect('orderedList')"
      >
        <OrderListIcon :size="size" :color="color" />
      </div>
      <div
        v-for="(name, index) in ['left', 'center', 'right']"
        :key="index"
        class="icon-button"
        @click.stop="() => onSelect(name)"
      >
        <component :is="components[name]" :size="size" :color="color" />
      </div>
    </div>
    <div class="divider" />

    <div class="group">
      <div
        class="icon-button"
        :class="{ actived: isActive('codeBlock') }"
        @click.stop="() => onSelect('codeBlock')"
      >
        <CodeIcon :size="size" :color="color" />
      </div>

      <div
        class="icon-button"
        :class="{ actived: isActive('blockquote') }"
        @click.stop="() => onSelect('blockquote')"
      >
        <QuoteIcon :size="size" :color="color" />
      </div>

      <div
        v-show="!isActive('link')"
        class="icon-button"
        :class="{ actived: isActive('link') }"
        @click.stop="() => onSelect('link')"
      >
        <AddLinkIcon :size="size" :color="color" />
      </div>

      <div
        v-show="isActive('link')"
        class="icon-button"
        :class="{ actived: isActive('link') }"
        @click.stop="() => onSelect('link')"
      >
        <LinkIcon :size="size" :color="color" />
      </div>

      <div
        v-show="isActive('link')"
        class="icon-button"
        @click.stop="() => onSelect('linkoff')"
      >
        <LinkOffIcon :size="size" :color="color" />
      </div>
    </div>

    <div class="divider" />

    <div class="group">
      <div class="icon-button">
        <ImageUpload @change="imageChange">
          <ImageIcon :size="size" :color="color" v-bind="imageProps" />
        </ImageUpload>
      </div>
    </div>
    <div class="divider" />

    <div class="group">
      <div
        v-for="(name, index) in ['brush', 'clear', 'undo', 'redo', 'delete']"
        :key="index"
        class="icon-button"
        :class="{ actived: isActive(name) }"
        @click.stop="() => onSelect(name)"
      >
        <component :is="components[name]" :size="size" :color="color" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropOptions } from "vue";
import { EditorOptions } from "../../../types/editor";
import Icons from "../../icons/index";
import ImageUpload from "../../../components/uploads/ImageUpload.vue";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
import "element-ui/lib/theme-chalk/dropdown.css";
import "element-ui/lib/theme-chalk/dropdown-item.css";
import "element-ui/lib/theme-chalk/dropdown-menu.css";
import "../../../assets/style/mian.scss";

export default {
  name: "EditorTabsBar",
  components: {
    ...Icons,
    ImageUpload,
    Dropdown,
    DropdownMenu,
    DropdownItem,
  },
  props: {
    size: {
      type: Number,
      default: 22,
    },
    color: {
      type: String,
      default: "#757575",
    },
    actived: {
      type: Function,
      default() {
        return false;
      },
    },
    options: {
      type: Object,
      default() {
        return undefined;
      },
    } as PropOptions<EditorOptions | undefined>,
  },
  data() {
    return {
      components: {
        bold: "FormatBoldIcon",
        italic: "FormatItalicIcon",
        strike: "StrikethroughIcon",
        highlight: "HighlightIcon",
        left: "AlignLeftIcon",
        right: "AlignRightIcon",
        center: "AlignCenterIcon",
        undo: "UndoIcon",
        redo: "RedoIcon",
        delete: "DeteleIcon",
        clear: "FormatClearIcon",
        preview: "PreviewIcon",
        brush: "FormatBrush",
      },
    };
  },
  computed: {
    imageProps() {
      return this.options?.image || undefined;
    },
  },
  methods: {
    onSelect(type: string, attributes?: {} | undefined) {
      this.$emit("select", type, attributes);
    },
    isActive(name: string, attributes?: any | undefined): boolean {
      return this.actived(name, attributes);
    },
    imageChange(file: File) {
      this.onSelect("image", { file });
    },
  },
};
</script>

<style lang="scss" scoped></style>
