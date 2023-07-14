<script setup lang="tsx" name="Menus">
import { Delete, Download, CirclePlus, EditPen } from "@element-plus/icons-vue";
import { getAuthMenuListApi } from "@/api/modules/login";
import { ref } from "vue";
import Add from "./components/AddMenus.vue";
import { reqAddMenu, reqPutMenu, reqDelMenu, reqBatchDelMenu } from "@/api/modules/system/management";
import { isNo, menuType } from "@/utils/serviceDict";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { getSortData, getPresentMenu } from "@/utils";
import { PresentMenu } from "@/api/interface/menu";

const addRef = ref();
const openDialog = async (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData:
      title === "编辑"
        ? { ...rowData, isLink: !!rowData.link }
        : {
            ...rowData,
            isLink: false,
            affix: false,
            full: false,
            hidden: false,
            cache: true,
            menuSort: 999,
            menuType: "C",
            parentId: 0
          },
    isView: title === "查看",
    api: title === "新增" ? reqAddMenu : title === "编辑" ? reqPutMenu : null,
    getTableList: proTable.value?.getTableList,
    tableData: [
      { id: 0, title: "顶级目录", children: getSortData(getPresentMenu(proTable.value?.tableData as PresentMenu.Datum[])) }
    ]
  };
  addRef.value.acceptParams(params);
};
/**
 * @description 删除菜单
 * @param row
 */
const deleteMenu = async (row: any) => {
  await useHandleData(reqDelMenu, { id: row.id }, `删除【${row.title}】菜单`);
  proTable.value?.getTableList();
};

// 批量删除菜单
const batchDel = async (ids: string[]) => {
  await useHandleData(reqBatchDelMenu, ids, `删除所选菜单`);
  proTable.value?.getTableList();
};
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
/**
 * @description 表格配置项
 */
const columns: ColumnProps<PresentMenu.Datum>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { prop: "title", label: "菜单标题", width: 140, search: { el: "input" }, align: "left" },
  { prop: "name", label: "组件名称", width: 120 },
  {
    prop: "icon",
    label: "图标",
    width: 60
  },
  {
    prop: "menuSort",
    label: "排序",
    width: 80
  },
  {
    prop: "permission",
    label: "权限标识",
    width: 180
  },
  {
    prop: "component",
    label: "组件路径",
    width: 180
  },

  {
    prop: "path",
    label: "路由地址",
    width: 180
  },
  {
    prop: "link",
    label: "外链",
    width: 180
  },
  {
    prop: "menuType",
    label: "类型",
    tag: true,
    enum: menuType
  },
  {
    prop: "affix",
    label: "固定导航",
    width: 100,
    enum: isNo
  },
  {
    prop: "full",
    label: "全屏",
    width: 100,
    enum: isNo
  },
  {
    prop: "hidden",
    label: "隐藏菜单",
    width: 100,
    enum: isNo
  },
  {
    prop: "cache",
    label: "缓存",
    width: 100,
    enum: isNo
  },
  {
    prop: "gmtCreate",
    label: "创建时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  },
  { prop: "operation", label: "操作", width: 180, fixed: "right" }
];
// 请求之前处理时间条件

const getTableList = (params: any) => {
  const newParams = { ...params };
  newParams.startTime = params.gmtCreate?.[0];
  newParams.endTime = params.gmtCreate?.[1];
  delete newParams.gmtCreate;
  return getAuthMenuListApi(newParams);
};
</script>
<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="用户列表"
        :tree-props="{ children: 'childMenu' }"
        :columns="columns"
        row-key="id"
        :requestApi="getTableList"
        :pagination="false"
        :border="false"
      >
        <template #tableHeader="scope">
          <el-button class="btn" type="primary" v-auth="['add']" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
          <el-button
            class="btn"
            type="danger"
            plain
            :icon="Delete"
            :disabled="!scope.isSelected"
            @click="batchDel(scope.selectedListIds)"
            >删除</el-button
          >
          <el-button class="btn" type="primary" plain :icon="Download">导出</el-button>
        </template>
        <!-- 菜单图标 -->
        <template #icon="scope">
          <el-icon :size="18">
            <component :is="scope.row.icon"></component>
          </el-icon>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button :icon="EditPen" type="primary" @click.stop="openDialog('编辑', scope.row)" link>编辑</el-button>
          <el-button :icon="Delete" type="danger" @click.stop="deleteMenu(scope.row)" link>删除</el-button>
        </template>
      </ProTable>
    </div>
    <Add ref="addRef" />
  </div>
</template>
