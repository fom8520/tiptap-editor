<template>
  <Upload
    action=""
    class="image-uploader"
    accept="image/*"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    name="file"
  >
    <slot>
      <image-icon :size="18" color="#757575" />
    </slot>
  </Upload>
</template>

<script lang="ts">
import ImageIcon from "../../components/icons/ImageIcon.vue";
import { ElUploadInternalRawFile } from "element-ui/types/upload";
import imageCompression from "browser-image-compression";
import { Upload } from "element-ui";
import "element-ui/lib/theme-chalk/upload.css";

export default {
  name: "ImageUpload",
  components: { ImageIcon, Upload },
  props: {
    memoryLimit: {
      type: Number,
      default: 10,
    },
    isCompression: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      token: "",
      imageUrl: "",
      loading: false,
    };
  },
  methods: {
    async beforeAvatarUpload(file: ElUploadInternalRawFile) {
      const isImage = file.type.split("/")[0] === "image";
      const isValidSize = file.size / 1024 / 1024 < this.memoryLimit;
      if (!isImage) {
        throw new Error("type error");
      }

      if (!isValidSize) {
        throw new Error("size error");
      }

      if (!this.isCompression || file.type === "image/gif") {
        this.$emit("change", file);

        return;
      }

      // 压缩图片
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        alwaysKeepResolution: true,
      };
      try {
        const compressed: File = await imageCompression(file, options);
        this.$emit("change", compressed);
      } catch (error) {
        return false;
      }

      throw new Error(" ");
    },
  },
};
</script>

<style lang="scss">
.image-uploader {
  .el-upload {
    display: flex !important;
  }
}
</style>
