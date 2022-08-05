<template>
  <div
    v-show="imageList.length > 0"
    v-on="$listeners"
    class="image-card-list tiptap-scrollbar-bar"
  >
    <ElImage
      v-for="(image, index) in imageList"
      v-loading="image.loading"
      :key="index"
      class="image"
      :src="image.path"
      @dragstart="($ev) => onDrag($ev, image)"
    >
    </ElImage>
  </div>
</template>

<script lang="ts">
import { Image as ElImage } from "element-ui";
import "element-ui/lib/theme-chalk/image.css";

interface ImageType {
  src?: string;
  path: string;
  loading?: boolean;
}

export default {
  name: "ImageList",
  components: { ElImage },
  props: {},
  data() {
    return {
      imageList: [] as ImageType[],
    };
  },
  methods: {
    addImageUrl(img: ImageType) {
      const index = this.imageList.findIndex((item) => item.path === img.path);

      if (index !== -1) {
        this.imageList[index] = img;
      } else {
        this.imageList.push(img);
      }
    },
    deleteImage(src: string) {
      const index = this.imageList.findIndex(
        (item) => item.src === src || item.path === src
      );
      const imageList = [...this.imageList];

      if (index !== -1) {
        imageList.splice(index, 1);
        this.imageList = imageList;
      }
    },
    onDrag(e: DragEvent, image: ImageType) {
      e.dataTransfer?.clearData();
      e.dataTransfer?.setData("imageSrc", image.src || image.path);
    },
  },
};
</script>

<style lang="scss" scoped></style>
