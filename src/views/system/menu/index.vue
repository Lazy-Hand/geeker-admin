<script setup lang="tsx" name="Menus">
import { Delete, Download, Plus, Edit, EditPen } from "@element-plus/icons-vue";
import { getAuthMenuListApi } from "@/api/modules/login";
import { ref } from "vue";
import Add from "./components/AddMenus.vue";
import { reqAddMenu, reqPutMenu, reqDelMenu, reqBatchDelMenu } from "@/api/modules/management";
import dayjs from "dayjs";
import { isNo } from "@/utils/serviceDict";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { getSortData, getPresentMenu } from "@/utils";
const init = async () => {
  const { data } = await getAuthMenuListApi();
  const newMenu = getPresentMenu(data);
  tableData.value = await getSortData(newMenu);
};
init();
const tableData = ref<Menu.MenuOptions[]>();
const addRef = ref();
const openDialog = (title: string, rowData: any = {}) => {
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
    getTableList: proTable.value.getTableList,
    tableData: [{ id: 0, title: "顶级目录", children: tableData.value }]
  };
  addRef.value.acceptParams(params);
};
/**
 * @description 删除菜单
 * @param row
 */
const deleteMenu = async (row: any) => {
  await useHandleData(reqDelMenu, { id: row.id }, `删除【${row.title}】菜单`);
  proTable.value.getTableList();
};
const batchDel = async (ids: string[]) => {
  await useHandleData(reqBatchDelMenu, ids, `删除所选菜单`);
  proTable.value.getTableList();
};
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
/**
 * @description 表格配置项
 */
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 40 },
  { prop: "title", label: "菜单标题", width: 140, search: { el: "input" } },
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
    search: {
      el: "date-picker",
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    },
    render: scope => {
      return <span>{dayjs(scope.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss")}</span>;
    }
  },
  { prop: "operation", label: "操作", width: 180, fixed: "right" }
];
</script>
<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="用户列表"
        :tree="{ children: 'childMenu' }"
        :columns="columns"
        :requestApi="getAuthMenuListApi"
        highlight-current-row
        :pagination="false"
        :border="false"
      >
        <template #tableHeader="scope">
          <el-button class="btn" type="primary" :icon="Plus" @click="openDialog('新增')">新增</el-button>
          <el-button class="btn" type="primary" plain :icon="Edit" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
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
          <el-button :icon="EditPen" type="primary" @click="openDialog('编辑', scope.row)" link>编辑</el-button>
          <el-button :icon="Delete" type="danger" @click="deleteMenu(scope.row)" link>删除</el-button>
        </template>
      </ProTable>
    </div>
    <Add ref="addRef" />
  </div>
</template>
