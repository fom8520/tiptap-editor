<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
    <title>Align Center</title>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path
      d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "AlignCenterIcon",
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
