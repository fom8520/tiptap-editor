<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
    <title>Align Right</title>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path
      d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "AlignRightIcon",
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
