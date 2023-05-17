<template>
  <div>
    自定义上传图片上传
    <el-button @click="closeDialog">确定</el-button>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(["close"]);
const closeDialog = () => {
  emit("close", {
    submit: true,
    url: "https://gbw-resource.oss-cn-shanghai.aliyuncs.com/20230517/cdb0312d51de497e8472f5cfb8b7aece_login_left5.png"
  });
};
</script>

<style lang="scss" scoped></style>
