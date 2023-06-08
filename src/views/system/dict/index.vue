<script lang="tsx" name="Dict" setup>
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { reqGetDict, reqPutDict, reqDelDict } from "@/api/modules/system/management";
import AddDict from "./components/AddDict.vue";
import { Delete, EditPen, CirclePlus, Download } from "@element-plus/icons-vue";
import { reqAddDict } from "@/api/modules/system/management";
import { useRouter } from "vue-router";
import { dictStatus } from "@/utils/serviceDict";
import { useHandleData } from "@/hooks/useHandleData";
const router = useRouter();
const proTable = ref();
const addDict = ref();
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "paramName",
    label: "字典名称",
    width: 200,
    search: { el: "input" },
    render: scope => {
      return (
        <el-button link type="primary" onClick={() => toDictData(scope.row)}>
          {scope.row.paramName}
        </el-button>
      );
    }
  },
  { prop: "paramCode", label: "字典编号", width: 220, search: { el: "input" } },
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
    rowData: { ...rowData },
    isView: title === "查看",
    api: title === "新增" ? reqAddDict : title === "编辑" ? reqPutDict : null,
    getTableList: proTable.value.getTableList
  };
  addDict.value.acceptParams(params);
};
const toDictData = (row: any) => {
  router.push(`/system/dict/DictData/${row.paramCode}?params=${row.paramName}`);
};
const deleteDict = async (ids: string[], row?: any) => {
  await useHandleData(reqDelDict, ids, ids.length === 1 ? `删除【${row.paramName}】字典` : "删除选中字典");
  if (ids.length > 0) {
    proTable.value.clearSelection();
  }
  proTable.value.getTableList();
};
</script>
<template>
  <div class="table-box">
    <ProTable ref="proTable" title="字典列表" :columns="columns" :requestApi="reqGetDict">
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
        <el-button type="primary" plain :icon="EditPen" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!scope.isSelected" @click="deleteDict(scope.selectedListIds)"
          >删除</el-button
        >
        <el-button type="primary" plain :icon="Download">导出</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" :icon="EditPen" @click="openDialog('编辑', scope.row)" link>编辑</el-button>
        <el-button type="danger" :icon="Delete" link @click="deleteDict([scope.row.id], scope.row)">删除</el-button>
      </template>
    </ProTable>
    <AddDict ref="addDict" />
  </div>
</template>
