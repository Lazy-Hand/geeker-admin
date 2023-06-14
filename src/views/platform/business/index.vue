<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="商户列表" :request-api="reqGetBusinessList" :columns="columns">
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增用户</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="delBusiness(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <AddBusiness ref="addBusinessRef" />
  </div>
</template>

<script setup lang="tsx" name="Business">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetBusinessList, reqAddBusiness, reqEditBusiness, reqDelBusiness } from "@/api/modules/platform/business";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { roleStatus } from "@/utils/serviceDict";
import { Plus } from "@element-plus/icons-vue";
import AddBusiness from "./components/AddBusiness.vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTableRef = ref<ProTableInstance>();
const addBusinessRef = ref();
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "商户名称", search: { el: "input", props: { placeholder: "商户名称" } } },
  { prop: "userName", label: "商户logo" },
  { prop: "trole", label: "商户权限" },
  {
    prop: "status",
    label: "商户状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "商户状态" } },
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
    format: "YYYY-MM-DD HH:mm:ss"
  },
  {
    prop: "gmtCreate",
    label: "创建人",
    format: "YYYY-MM-DD HH:mm:ss"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

// 新增编辑查看弹窗
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, status: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
    isView: title === "查看",
    api: title === "新增" ? reqAddBusiness : title === "编辑" ? reqEditBusiness : null,
    getTableList: proTableRef.value?.getTableList
  };
  addBusinessRef.value.acceptParams(params);
};

const delBusiness = async (row: any) => {
  await useHandleData(reqDelBusiness, { id: row.id }, `删除【${row.name}】商户`);
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss"></style>
