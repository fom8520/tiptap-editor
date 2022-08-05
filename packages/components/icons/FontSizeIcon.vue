<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
    <title>Size</title>

    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
  </svg>
</template>

<script lang="ts">
export default {
  name: "FontSizeIcon",
  props: {
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: "#000000",
    },
  },
};
</script>
