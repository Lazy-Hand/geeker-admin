<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="岗位列表" :request-api="getTableList" :columns="columns">
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增岗位</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="delPost(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <AddPost ref="addPost" />
  </div>
</template>

<script setup lang="tsx" name="PostManage">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetPostList, reqAddPost, reqEditPost, reqDelPost } from "@/api/modules/system/post";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { roleStatus } from "@/utils/serviceDict";
import { Plus } from "@element-plus/icons-vue";
import AddPost from "./components/AddPost.vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const proTableRef = ref<ProTableInstance>();
const addPost = ref();
const { BUTTONS } = useAuthButtons();
const columns: ColumnProps[] = [
  { type: "index", label: "#" },
  { prop: "name", label: "岗位名称", search: { el: "input", props: { placeholder: "岗位名称" } } },
  { prop: "description", label: "描述" },
  { prop: "sort", label: "排序" },
  {
    prop: "status",
    label: "岗位状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "岗位状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status || BUTTONS.value.ROLE_ADMIN ? (
            <el-switch
              model-value={scope.row.status}
              inline-prompt
              active-text={"启用"}
              inactive-text={"禁用"}
              active-value={true}
              inactive-value={false}
              onClick={() => handleStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "gmtCreate",
    label: "创建时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

// 新增编辑查看弹窗
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, status: title === "新增" ? true : rowData.status },
    isView: title === "查看",
    api: title === "新增" ? reqAddPost : title === "编辑" ? reqEditPost : null,
    getTableList: proTableRef.value?.getTableList
  };
  addPost.value.acceptParams(params);
};

const delPost = async (row: any) => {
  await useHandleData(reqDelPost, row.id, `删除【${row.name}】岗位`);
  proTableRef.value?.getTableList();
};

const handleStatus = async (row: any) => {
  await useHandleData(reqEditPost, { id: row.id, status: !row.status }, `切换【${row.name}】岗位状态`);
  proTableRef.value?.getTableList();
};
// 处理列表请求数据
const getTableList = (params: any) => {
  const newParams = { ...params };
  if (newParams.status !== undefined) {
    newParams.status = newParams.status ? 1 : 0;
  }
  return reqGetPostList(newParams);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
