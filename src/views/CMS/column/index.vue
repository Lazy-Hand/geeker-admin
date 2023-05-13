<template>
  <div class="card content-box">
    <span class="text"> 栏目管理（待完善） 🍓🍇🍈🍉</span>
    <div class="upload-list">
      <UploadImg v-model:imageUrl="avatar1" :fileSize="3" borderRadius="50%">
        <template #tip> 上传图片最大为 3M </template>
      </UploadImg>
      <UploadImgMultiple v-model:fileList="fileList" v-model:imgInfo="imgInfo" :drag="false" borderRadius="50%">
        <template #empty>
          <el-icon><Picture /></el-icon>
          <span>请上传照片</span>
        </template>
        <template #tip> 圆形组件，图片最大为 5M（禁止拖拽上传）</template>
      </UploadImgMultiple>
      <button @click="test">测试</button>
    </div>
  </div>
</template>

<script setup lang="ts" name="Column">
import { ref } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgMultiple from "@/components/Upload/Imgs.vue";
const fileList = ref([{ name: "img", url: "https://i.imgtg.com/2023/01/16/QRBHS.jpg" }]);
const avatar1 = ref({ httpUrl: "" });
const imgInfo = ref(fileList.value);
const test = () => {
  console.log(fileList.value);
  console.log(imgInfo.value);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
