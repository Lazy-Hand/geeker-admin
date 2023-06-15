<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="商户列表" :request-api="reqGetBusinessList" :columns="columns">
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增商户</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="delBusiness(scope.row)"> 删除 </el-button>
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
import { twoStatus1 } from "@/utils/serviceDict";
import { Plus } from "@element-plus/icons-vue";
import AddBusiness from "./components/AddBusiness.vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const { BUTTONS } = useAuthButtons();
const proTableRef = ref<ProTableInstance>();
const addBusinessRef = ref();
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "商户名称", search: { el: "input", props: { placeholder: "商户名称" } } },
  {
    prop: "userName",
    label: "商户logo",
    render: scope => {
      return (
        <el-image
          preview-teleported
          src={scope.row.logo}
          fit={"cover"}
          style={{ width: "50px", height: "50px" }}
          previewSrcList={[scope.row.logo]}
        ></el-image>
      );
    }
  },
  {
    prop: "tenantRole",
    label: "商户权限",
    render: scope => {
      return (
        <>
          {scope.row.tenantRole
            ? scope.row.tenantRole.map((item: any) => {
                return <el-tag>{item.troleName}</el-tag>;
              })
            : "--"}
        </>
      );
    }
  },
  {
    prop: "status",
    label: "商户状态",
    enum: twoStatus1,
    width: 120,
    search: { el: "select", props: { placeholder: "商户状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              inline-prompt
              model-value={scope.row.status}
              active-text={"启用"}
              inactive-text={"禁用"}
              active-value={0}
              inactive-value={1}
              onClick={() => handleStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status === 0 ? "success" : "danger"}>{scope.row.status === 0 ? "启用" : "禁用"}</el-tag>
          )}
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
    prop: "createBy",
    label: "创建人"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

// 新增编辑查看弹窗
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData:
      title === "新增"
        ? { ...rowData, status: 0 }
        : {
            ...rowData,
            trole: rowData.tenantRole ? rowData.tenantRole.map((item: any) => item.troleId) : [],
            logo: { httpUrl: rowData.logo }
          },
    isView: title === "查看",
    api: title === "新增" ? reqAddBusiness : title === "编辑" ? reqEditBusiness : null,
    getTableList: proTableRef.value?.getTableList
  };
  addBusinessRef.value.acceptParams(params);
};

const delBusiness = async (row: any) => {
  await useHandleData(reqDelBusiness, row.id, `删除【${row.name}】商户`);
  proTableRef.value?.getTableList();
};

const handleStatus = async (row: any) => {
  await useHandleData(reqEditBusiness, { id: row.id, status: row.status === 0 ? 1 : 0 }, `切换【${row.name}】商户状态`);
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss"></style>
