<script setup lang="ts" name="Upload">
import { onBeforeMount, ref } from "vue";
import type { UploadUserFile, UploadInstance, UploadRequestOptions } from "element-plus";
import { Plus, CircleCloseFilled } from "@element-plus/icons-vue";
import { getFolder, uploadImg } from "@/api/modules/upload";
import { Uploads } from "@/api/interface/upload";
interface UploadForm {
  type: number;
  groupId: number | null;
  img?: UploadUserFile[];
  network?: string;
  imgUrl?: string[];
}
interface Tree extends Partial<Uploads.FolderResult> {
  label: string;
  children?: Tree[];
}
const uploadRef = ref<UploadInstance>();

// tree-select数据
const folderData = ref<Tree[]>([]);

// tree-select选中数据
const moveFile = ref<number | null>(null);
const uploadForm = ref<UploadForm>({
  type: 0,
  groupId: null,
  img: [],
  network: "",
  imgUrl: []
});
const emit = defineEmits(["close"]);
const closeDialog = (type: boolean) => {
  emit("close", { submit: type });
};
// 上传图片 xhr
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  try {
    await uploadImg(formData, moveFile.value!);
    closeDialog(true);
  } catch (error) {
    options.onError(error as any);
  }
};

// 提取网络图片
const extractImg = () => {
  uploadForm.value.imgUrl?.push(uploadForm.value.network!);
  uploadForm.value.network = "";
};

const closeImg = (index: number) => {
  uploadForm.value.imgUrl?.splice(index, 1);
};
const submit = () => {
  switch (uploadForm.value.type) {
    case 0:
      uploadRef.value?.submit();

      break;
    case 1:
      console.log("网络上传");
      break;
    case 2:
      console.log("扫码上传");
  }
};
// 初始化tree数据
const init = async () => {
  const { data } = await getFolder();
  folderData.value = [
    { label: "全部图片", id: -1 },
    ...data.map(item => {
      return {
        ...item,
        label: item.name
      };
    })
  ];
};
onBeforeMount(() => {
  init();
});
</script>

<template>
  <div>
    <div class="main">
      <el-form ref="uploadFormRef" :model="uploadForm" label-position="right" label-width="100px">
        <el-form-item label="上传方式：">
          <el-radio-group v-model="uploadForm.type">
            <el-radio :label="0">本地上传</el-radio>
            <el-radio :label="1">网络上传</el-radio>
            <el-radio :label="2">扫码上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传至分组：">
          <el-tree-select
            :render-after-expand="false"
            v-model="moveFile"
            check-strictly
            placeholder="图片移动至"
            :data="folderData"
            value-key="id"
          />
        </el-form-item>
        <el-form-item label="上传图片：" v-show="uploadForm.type === 0">
          <div class="upload-box">
            <el-upload
              v-model:file-list="uploadForm.img"
              :auto-upload="false"
              list-type="picture-card"
              ref="uploadRef"
              :http-request="handleHttpUpload"
              class="upload"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
          <div style="width: 100%; font-size: 12px; color: #bbbbbb">
            建议上传图片最大宽度750px，不超过3MB；仅支持jpeg、png格式，可拖拽调整上传顺序
          </div>
        </el-form-item>
        <el-form-item label="网络图片：" v-show="uploadForm.type === 1">
          <el-input
            v-model="uploadForm.network"
            placeholder="请填写网络图片地址"
            style="width: auto; margin-right: 8px"
          ></el-input>
          <el-button type="primary" link @click="extractImg">提取图片</el-button>
        </el-form-item>
        <el-form-item label="二维码：" v-show="uploadForm.type === 2">
          <div>
            <el-image class="code" src="" fit="fill"></el-image>
            <div class="trip">扫描二维码，快速上传手机图片</div>
            <div class="trip-small">建议使用手机浏览器</div>
          </div>
          <div style="height: 100%; margin-left: 24px">
            <el-button style="margin-bottom: 8px">刷新图库</el-button>
            <div class="trip-small">刷新图库按钮，可显示移动端上传成功的图片</div>
          </div>
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 100%; padding-left: 100px">
        <div
          v-for="(item, index) in uploadForm.imgUrl"
          :key="item"
          style="position: relative; margin-right: 12px; border: 1px dotted rgb(0 0 0 / 10%)"
        >
          <el-image :src="item" style="width: 70px; height: 70px" fit="fill"></el-image>
          <span style="position: absolute; top: -5px; right: -5px" @click="closeImg(index)">
            <el-icon size="18">
              <CircleCloseFilled />
            </el-icon>
          </span>
        </div>
      </div>
    </div>
    <div style="width: 100%; text-align: right">
      <el-button @click="closeDialog(false)">关闭</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: 500px;
}
.code {
  width: 200px;
  height: 200px;
  border: 1px solid #dddddd;
}
.trip {
  line-height: 18px;
  color: #333333;
  text-align: center;
}
.trip-small {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #bbbbbb;
  text-align: center;
}
.upload-box {
  :deep(.upload) {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
}
</style>
