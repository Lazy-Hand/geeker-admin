<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="岗位列表" :request-api="reqGetEmpList" :columns="columns">
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增岗位</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </ProTable>
    <AddPost ref="addPost" />
  </div>
</template>

<script setup lang="tsx" name="PostManage">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetEmpList } from "@/api/modules/system/employee";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { roleStatus } from "@/utils/serviceDict";
import { Plus } from "@element-plus/icons-vue";
import AddPost from "./components/AddPost.vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
const proTableRef = ref<ProTableInstance>();
const addPost = ref();
const columns: ColumnProps[] = [
  { type: "index", label: "#" },
  { prop: "nickName", label: "岗位名称", search: { el: "input", props: { placeholder: "岗位名称" } } },
  { prop: "userName", label: "描述" },
  { prop: "name", label: "排序" },
  {
    prop: "status",
    label: "岗位状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "岗位状态" } },
    render: scope => {
      return (
        <>
          <el-switch
            model-value={scope.row.validFlag}
            active-text={scope.row.validFlag ? "启用" : "禁用"}
            active-value={true}
            inactive-value={false}
          />
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
    rowData: { ...rowData, validFlag: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
    isView: title === "查看",
    api: title === "新增" ? null : title === "编辑" ? null : null,
    getTableList: proTableRef.value?.getTableList
  };
  addPost.value.acceptParams(params);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
