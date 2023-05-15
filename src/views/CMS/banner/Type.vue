<template>
  <div class="card content-box">
    <span class="text"> banner类型（待完善） 🍓🍇🍈🍉</span>
    父弹窗 {{ props.id }}
    <el-button type="primary" @click="closeDialog">关闭弹窗</el-button>
  </div>
</template>

<script setup lang="ts" name="cropper">
const props = defineProps({ id: Number });

const emit = defineEmits(["close"]);
const closeDialog = () => {
  emit("close", { id: 1 });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
