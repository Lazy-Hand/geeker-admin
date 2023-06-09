<script lang="tsx" name="Dict" setup>
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { reqGetDict, reqPutDict, reqDelDict } from "@/api/modules/system/management";
import AddDict from "./components/AddDict.vue";
import { Delete, EditPen, CirclePlus, Download } from "@element-plus/icons-vue";
import { reqAddDict } from "@/api/modules/system/management";
import { useRouter } from "vue-router";
import { dictStatus } from "@/utils/serviceDict";
import { useHandleData } from "@/hooks/useHandleData";
import { Dict } from "@/api/interface/dict";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const router = useRouter();
const proTable = ref<ProTableInstance>();
const addDict = ref();
// 表格配置项
const columns: ColumnProps<Dict.DictList>[] = [
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
  {
    prop: "display",
    label: "状态",
    enum: dictStatus,
    width: "100",
    render: ({ row }) => {
      return (
        <>
          {BUTTONS.value.display || BUTTONS.value.ROLE_ADMIN ? (
            <el-switch
              model-value={row.display}
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              active-value={true}
              inactive-value={false}
            />
          ) : (
            <el-tag type={row.display ? "success" : "danger"}>{row.display ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "remark",
    label: "描述"
  },
  { prop: "operation", label: "操作", width: 220, fixed: "right" }
];
const openDialog = (title: string, rowData: Partial<Dict.DictList> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "查看",
    api: title === "新增" ? reqAddDict : title === "编辑" ? reqPutDict : null,
    getTableList: proTable.value?.getTableList
  };
  addDict.value.acceptParams(params);
};
const toDictData = (row: Dict.DictList) => {
  router.push(`/system/dict/DictData/${row.paramCode}?params=${row.paramName}`);
};
const deleteDict = async (ids: string[], row: Dict.DictList) => {
  await useHandleData(reqDelDict, ids, ids.length === 1 ? `删除【${row.paramName}】字典` : "删除选中字典");
  if (ids.length > 0) {
    proTable.value?.clearSelection();
  }
  proTable.value?.getTableList();
};
const { BUTTONS } = useAuthButtons();
</script>
<template>
  <div class="table-box">
    <ProTable ref="proTable" title="字典列表" :columns="columns" :requestApi="reqGetDict">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
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
