<template>
  <div class="index-page">
    <Editor v-model="content" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Editor from "../packages/components/editor/index.vue";

export default Vue.extend({
  name: "IndexPage",
  components: { Editor },
  data() {
    return {
      content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
    };
  },
});
</script>

<style lang="scss" scoped>
.index-page {
  max-width: 800px;
  height: auto;
  margin: 0 auto;
}
</style>