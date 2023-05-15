<template>
  <div class="card content-box">
    <span class="text"> banner（待完善） 🍓🍇🍈🍉</span>
    <el-button @click="open">打开dialog</el-button>
  </div>
</template>

<script setup lang="ts" name="Banner">
import { addDialog } from "@/components/OpenDialog";
import Type from "./Type.vue";
const open = () => {
  addDialog({
    title: "我是dialog",
    width: "500px",
    props: {
      id: 0
    },
    component: Type,
    callBack: (data: any) => {
      //当弹窗任务结束后，调用父页面的回掉函数。（比如我新增完成了需要刷新列表页面）
      console.log("回调函数", data);
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
