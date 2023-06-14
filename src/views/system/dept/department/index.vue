<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="部门列表"
      :request-api="reqGetDepartList"
      :columns="columns"
      :pagination="false"
      rowKey="id"
      :tree-props="{ children: 'childMenu' }"
      :border="false"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增部门</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="delDepart(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <Adddepartment ref="addDepartment" />
  </div>
</template>

<script setup lang="tsx" name="DepartmentManage">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetDepartList, reqDelDepart } from "@/api/modules/system/department";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { twoStatus } from "@/utils/serviceDict";
import { Plus } from "@element-plus/icons-vue";
import Adddepartment from "./components/Adddepartment.vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { reqAddDepart } from "@/api/modules/system/department";
import { reqEditDepart } from "@/api/modules/system/department";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const proTableRef = ref<ProTableInstance>();
const addDepartment = ref();
const { BUTTONS } = useAuthButtons();
const columns: ColumnProps[] = [
  { type: "index", label: "#" },
  { prop: "name", label: "部门名称", search: { el: "input", props: { placeholder: "部门名称" } } },
  { prop: "description", label: "描述" },
  { prop: "sort", label: "排序" },
  {
    prop: "status",
    label: "部门状态",
    enum: twoStatus,
    search: { el: "select", props: { placeholder: "部门状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status === 1 ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => handleStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status === 1 ? "success" : "danger"}>{scope.row.status === 1 ? "启用" : "禁用"}</el-tag>
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
    rowData: {
      ...rowData,
      pid: rowData.pid === 0 ? "" : rowData.pid,
      isTop: title === "新增" || rowData.pid === 0 ? 0 : 1,
      status: title === "新增" ? 1 : rowData.status
    },
    isView: title === "查看",
    api: title === "新增" ? reqAddDepart : title === "编辑" ? reqEditDepart : null,
    getTableList: proTableRef.value?.getTableList,
    treeList: proTableRef.value?.tableData
  };
  addDepartment.value.acceptParams(params);
};

const delDepart = async (row: any) => {
  await useHandleData(reqDelDepart, { id: row.id }, `删除【${row.name}】部门`);
  proTableRef.value?.getTableList();
};

const handleStatus = async (row: any) => {
  await useHandleData(reqEditDepart, { id: row.id, status: row.status === 1 ? 0 : 1 }, `切换【${row.name}】部门状态`);
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
