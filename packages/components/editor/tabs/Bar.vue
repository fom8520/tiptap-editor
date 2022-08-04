<template>
  <div class="editor-tabs-bar">
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
      <el-dropdown placement="bottom">
        <div class="icon-button">
          <FontSizeIcon :size="size" :color="color" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="padding: 0 5px" v-for="i in 6" :key="i">
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
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
        v-for="(name, index) in ['undo', 'redo', 'clear', 'preview', 'delete']"
        :key="index"
        class="icon-button"
        @click.stop="() => onSelect(name)"
      >
        <component :is="components[name]" :size="size" :color="color" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { EditorOptions } from "../../../types/editor";
import Icons from "../../icons/index";
import ImageUpload from "../../../components/uploads/ImageUpload.vue";

export default Vue.extend({
  name: "EditorTabsBar",
  components: {
    ...Icons,
    ImageUpload,
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
});
</script>

<style lang="scss" scoped>
.font-size-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;

  span {
    display: inherit;
    margin: 0 2px;
  }
}
.editor-tabs-bar {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
  /* margin-bottom: 10px; */

  .divider {
    height: 60%;
    width: 2px;
    margin: 0 5px;
    background-color: rgba(221, 219, 219, 0.82745);
  }
  .group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .icon-button {
      margin: 0 5px;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s linear;

      &:hover,
      &.actived {
        background-color: #b6b6b663;
        border-radius: 4px;
      }
    }
  }
}
</style>
