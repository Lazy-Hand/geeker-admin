<template>
  <div class="card content-box">
    <TreeFilter label="title" title="租户" :requestApi="getAuthMenuListApi" @change="changeTreeFilter" :defaultValue="1" />
  </div>
</template>

<script setup lang="ts" name="cropper">
import { ref } from "vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getAuthMenuListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
/**
 * @description 选中id集合 请求参数
 */
const selectVal = ref<number[]>([]);
/**
 * @description 树形筛选切换
 * @param {Array} val 选中id集合
 */
const changeTreeFilter = (val: number[]) => {
  console.log("🚀 ~ file: index.vue:72 ~ changeTreeFilter ~ val", val);
  ElMessage.success("请注意查看请求参数变化 🤔");
  selectVal.value = val;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
