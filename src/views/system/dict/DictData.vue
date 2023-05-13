<script setup lang="tsx" name="DictDetail">
import { ref, reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { reqGetDictDetail, reqAddDictChild, reqDelDictChild } from "@/api/modules/management";
import { dictStatus } from "@/utils/serviceDict";
import AddSendDict from "./components/AddSendDict.vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTable = ref();
const route = useRoute();
const addSendDict = ref();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
  id: route.params.id
});
// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "paramName",
    label: "所属字典",
    width: 200,
    render: () => {
      return <span>{route.query.params}</span>;
    }
  },
  {
    prop: "paramName",
    label: "字典名称",
    width: 200
  },
  {
    prop: "paramValue",
    label: "字典键值",
    width: 200
  },
  { prop: "paramCode", label: "字典编号", width: 220 },
  { prop: "sequence", label: "字典排序", width: 220 },
  { prop: "display", label: "状态", width: "100", sortable: true, tag: true, enum: dictStatus },
  {
    prop: "remark",
    label: "描述"
  },
  { prop: "operation", label: "操作", width: 220, fixed: "right" }
];
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, parentCode: route.params.id },
    isView: title === "查看",
    api: title === "新增" ? reqAddDictChild : title === "编辑" ? null : null,
    getTableList: proTable.value.getTableList
  };
  addSendDict.value.acceptParams(params);
};
const deleteRole = async (row: any) => {
  await useHandleData(reqDelDictChild, { id: row.id }, `删除【${row.paramName}】字典子项`);
  proTable.value.getTableList();
};
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="字典列表"
      :columns="columns"
      :requestApi="reqGetDictDetail"
      :pagination="false"
      :initParam="initParam"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
        <el-button type="primary" plain :icon="EditPen" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!scope.isSelected">删除</el-button>
        <el-button type="primary" plain :icon="Download">导出</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" :icon="EditPen" link>编辑</el-button>
        <el-button type="danger" :icon="Delete" link @click="deleteRole(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <AddSendDict ref="addSendDict" />
  </div>
</template>
