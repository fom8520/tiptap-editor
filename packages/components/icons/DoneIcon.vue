<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
    <title>Done</title>
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "DoneIcon",
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
