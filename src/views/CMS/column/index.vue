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
      <el-button @click="test" type="primary">获取数据</el-button>
      <el-button @click="open" type="primary">打开文件选择</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="Column">
import { ref, markRaw } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgMultiple from "@/components/Upload/Imgs.vue";
import { addDialog } from "@/components/OpenDialog";
import SelectServerAssets from "@/components/SelectServerAssets/index.vue";
import { Uploads } from "@/api/interface/upload";
const fileList = ref([]);
const avatar1 = ref();
const imgInfo = ref(fileList.value);
const test = () => {
  console.log(imgInfo.value);
  console.log(avatar1);
};
const open = () => {
  addDialog({
    title: "选择图片",
    width: "50%",
    draggable: true,
    component: markRaw(SelectServerAssets),
    callBack: (data: { submit: boolean; pictrueList: Uploads.AccessoryResult }) => {
      data.submit && console.log(data.pictrueList);
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
