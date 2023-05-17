<template>
  <div flex>
    <TreeFilter label="title" :defaultValue="1" :requestApi="getAuthMenuListApi" @change="changeTreeFilter" />
    <div ml-10>
      <div>
        <el-button type="primary" @click="closeDialog">使用选中图片</el-button>
        <el-button :icon="Upload" mr-3></el-button>
        <el-tree-select :render-after-expand="false" check-strictly placeholder="图片移动至" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getAuthMenuListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { Upload } from "@element-plus/icons-vue";
/**
 * @description 选中id集合 请求参数
 */
const selectVal = ref<number>();
/**
 * @description 树形筛选切换
 * @param {Array} val 选中id集合
 */
const changeTreeFilter = (val: number) => {
  console.log("🚀 ~ file: index.vue:72 ~ changeTreeFilter ~ val", val);
  ElMessage.success("请注意查看请求参数变化 🤔");
  selectVal.value = val;
};

const emit = defineEmits(["close"]);
const closeDialog = () => {
  emit("close", {
    submit: true,
    url: "https://gbw-resource.oss-cn-shanghai.aliyuncs.com/20230517/cdb0312d51de497e8472f5cfb8b7aece_login_left5.png"
  });
};
</script>

<style lang="scss" scoped></style>
