<template>
  <div class="dialog-box">
    <div class="select-box">
      <el-tree
        :props="defaultProps"
        ref="treeRef"
        :data="folderData"
        highlight-current
        default-expand-all
        node-key="id"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div>
              <span class="custom-tree-node-label">
                <el-icon size="15" style="vertical-align: middle">
                  <FolderRemove />
                </el-icon>
                {{ node.label }}
              </span>
            </div>
            <span>
              <el-dropdown>
                <span>
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="addClassify(data)">添加分类</el-dropdown-item>
                    <el-dropdown-item v-if="node.label !== '全部图片'" @click="addClassify(data, '编辑分类')"
                      >编辑分类</el-dropdown-item
                    >
                    <el-dropdown-item v-if="node.label !== '全部图片'" @click="delClassify(data.id)">删除分类</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
    <el-divider direction="vertical" />
    <div class="content-box">
      <div style="margin-bottom: 20px">
        <el-button type="primary" @click="closeDialog" :disabled="checkedImg.length <= 0">使用选中图片</el-button>
        <el-button :icon="Upload" @click="open"></el-button>
        <el-button style="margin-right: 12px" @click="delImgs" :disabled="checkedImg.length <= 0">删除图片</el-button>
        <el-tree-select
          :render-after-expand="false"
          v-model="moveFile"
          check-strictly
          placeholder="图片移动至"
          :data="folderData"
          value-key="id"
          :disabled="checkedImg.length <= 0"
          @blur="loseBlur"
        />
      </div>
      <div class="image-box">
        <el-row :gutter="12">
          <el-col :span="4" v-for="item in pictrueList" :key="item.id">
            <div style="position: relative; margin-bottom: 12px; text-align: center" @click="changeImg(item)">
              <el-image style="width: 100px; height: 100px" :src="item.httpUrl"></el-image>
              <div class="select-border" v-if="item.checked">
                <el-badge :value="badge(item)">
                  <div style="width: 98px; height: 98px"></div>
                </el-badge>
              </div>
              <div>
                <div>1.png</div>
                <div class="clickHandle">
                  <i @click.stop="delImg(item)">删除</i>
                  <i>改名</i>
                  <i>查看</i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="state.total"
          background
          :default-page-size="18"
          v-model:current-page="state.pageNum"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="SelectServerAssets">
import { markRaw, nextTick, onBeforeMount, reactive, ref } from "vue";
import { Upload } from "@element-plus/icons-vue";
import { addDialog } from "@/components/OpenDialog";
import UploadCom from "./components/Upload.vue";
import { MoreFilled, FolderRemove } from "@element-plus/icons-vue";
import { delUploads, getFolder, getFolderAccessory, delUpload, delFolder } from "@/api/modules/upload";
import { Uploads } from "@/api/interface/upload";
import { ElMessage, ElTree, ElMessageBox } from "element-plus";
import FolderDia from "./components/FolderDia.vue";
const defaultProps = {
  children: "children",
  label: "label"
};
interface Tree extends Partial<Uploads.FolderResult> {
  label: string;
  children?: Tree[];
}

interface Accessory extends Uploads.AccessoryResult {
  checked: boolean;
}

// tree实例
const treeRef = ref<InstanceType<typeof ElTree>>();

// tree数据
const folderData = ref<Tree[]>([]);

// tree-select选中数据
const moveFile = ref<number | null>(null);

// 图片数据
const pictrueList = ref<Accessory[]>([]);

// 分页数据
const state = reactive({
  pageSize: 18,
  pageNum: 1,
  total: 90
});
// 存储选择图片
const checkedImg = ref<Accessory[]>([]);

// tree选中数据
const selectFolderId = ref<number>(-1);

// 点击图片
const changeImg = (item: Accessory) => {
  if (checkedImg.value.findIndex(img => item.id === img.id) === -1) {
    item.checked = true;
    checkedImg.value = [...checkedImg.value, item];
  } else {
    item.checked = false;
    checkedImg.value = checkedImg.value.filter(img => img.id !== item.id);
  }
};
// 计算角标值
const badge = (val: Accessory) => {
  return checkedImg.value.findIndex(item => item.id === val.id) + 1;
};

// 图片移动至
const loseBlur = () => {
  setTimeout(() => {
    moveFile.value = null;
  }, 300);
};

// 文件夹点击切换
const handleNodeClick = async (data: { [key: string]: any }) => {
  selectFolderId.value = data.id;
  resetCurrentPage();
  getAccessory(data.id === -1 ? null : data.id);
};

// 获取文件夹附件
const getAccessory = async (id: number | null) => {
  const { data } = await getFolderAccessory({ id, ...state });
  pictrueList.value = data.list.map(item => {
    return {
      ...item,
      checked: false
    };
  });
  state.pageNum = data.page.pageNum;
  state.pageSize = data.page.pageSize;
  state.total = data.page.total!;
};

// 分页切换
const handleCurrentChange = () => {
  getAccessory(selectFolderId.value);
};

// 添加分类/编辑分类 - 操作分类弹框控制
const addClassify = (data: Tree, title: string = "添加分类") => {
  let name: string | null = null;
  let remark: string | null = null;
  if (title === "编辑分类") {
    name = data.name!;
    remark = data.remark!;
  }
  addDialog({
    title,
    width: "30%",
    draggable: true,
    props: { id: data.id, name, remark },
    component: markRaw(FolderDia),
    callBack: (submit: boolean) => {
      if (submit) {
        init();
      }
    }
  });
};

// 删除分类
const delClassify = (id: number) => {
  ElMessageBox.confirm("确定删除当前分类吗？", "删除分类", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await delFolder(id);
      ElMessage({
        message: "删除分类成功",
        type: "success"
      });
      init();
      if (id === selectFolderId.value) {
        selectFolderId.value = -1;
        resetCurrentPage();
        getAccessory(null);
      }
    } catch (error) {
      Promise.reject(error);
    }
  });
};
// 批量删除图片
const delImgs = () => {
  ElMessageBox.confirm("确定要删除选中图片吗？", "删除选中图片", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await delUploads(checkedImg.value.map(item => item.id).join(","));
        checkedImg.value = [];
        ElMessage({
          message: "删除成功",
          type: "success"
        });
        getAccessory(selectFolderId.value);
      } catch (error) {
        Promise.reject(error);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消成功"
      });
    });
};
// 删除图片
const delImg = (item: Accessory) => {
  ElMessageBox.confirm("确定要删除选中图片吗？", "删除选中图片", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await delUpload(item.id);
        checkedImg.value = [];
        ElMessage({
          message: "删除成功",
          type: "success"
        });
        getAccessory(selectFolderId.value);
      } catch (error) {
        Promise.reject(error);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消成功"
      });
    });
};

// 使用选中图片
const emit = defineEmits(["close"]);
const closeDialog = () => {
  emit("close", {
    submit: true,
    pictrueList: checkedImg.value
  });
};

// 打开上传本地图片窗口
const open = () => {
  addDialog({
    title: "上传图片",
    width: "50%",
    draggable: true,
    component: markRaw(UploadCom),
    callBack: (submit: boolean) => {
      if (submit) {
        resetCurrentPage();
        getAccessory(selectFolderId.value);
      }
    }
  });
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
  // 选中第一项
  nextTick(() => {
    treeRef.value?.setCurrentKey(selectFolderId.value);
  });
};

const resetCurrentPage = () => {
  state.pageNum = 1;
  state.pageSize = 18;
  state.total = 0;
};
onBeforeMount(async () => {
  await init();
  await getAccessory(null);
});
</script>

<style lang="scss" scoped>
.dialog-box {
  display: flex;
  :deep(.el-divider--vertical) {
    height: auto;
  }
  .select-box {
    width: 22%;
    margin-right: 12px;
  }
  .content-box {
    width: 78%;
    margin-left: 8px;
    .image-box {
      width: 100%;
    }
  }
}
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 12px;
}
.custom-tree-node-label {
  width: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.el-tree--highlight-current) {
  .el-tree-node.is-current > .el-tree-node__content {
    color: var(--el-color-primary) !important;
    background-color: #f0f7ff;
  }
}
.select-border {
  position: absolute;
  top: 0;
  width: 98px;
  height: 98px;
  border: 2px solid #409eff;
}
.clickHandle {
  display: flex;
  display: false;
  justify-content: space-around;
  width: 100%;
  height: 12px;
  margin-top: 2px;
  font-size: 8px;
  line-height: 12px;
  color: #409eff;
  i {
    opacity: 0;
  }
  &:hover {
    i {
      opacity: 1;
    }
  }
}
</style>
