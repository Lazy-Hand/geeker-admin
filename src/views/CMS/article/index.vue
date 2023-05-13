<template>
  <div class="table-box">
    <ProTable
      :requestApi="getArticleList"
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :searchCol="{ xs: 1, sm: 1, md: 3, lg: 4, xl: 3 }"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
        <el-button type="primary" plain :icon="EditPen" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!scope.isSelected">删除</el-button>
        <el-button type="primary" plain :icon="Download">导出</el-button>
      </template>
      <template #operation>
        <el-button type="primary" :icon="EditPen" link>编辑</el-button>
        <el-button type="danger" :icon="Delete" link>删除</el-button>
      </template>
    </ProTable>
    <AddArticle ref="addRef" />
  </div>
</template>

<script setup lang="tsx" name="Article">
import { CirclePlus, Delete, Download, EditPen } from "@element-plus/icons-vue";
import { ref } from "vue";
import { getArticleList, getColumnList } from "@/api/modules/cms/article";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { articleStatus, articleType } from "@/utils/serviceDict";
import dayjs from "dayjs";
import AddArticle from "./components/AddArticle.vue";
const proTable = ref();
const articleColumn = ref<{ label: string; value: number }[]>([]);

const getColumns = async () => {
  const { data } = await getColumnList();
  articleColumn.value = data.list.map(item => {
    return {
      label: item.name,
      value: item.id
    };
  });
};
await getColumns();

const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "#", width: 80 },
  {
    prop: "title",
    label: "文章标题",
    search: { el: "input", key: "keyword" },
    render: scope => {
      return (
        <el-button link type="primary">
          {scope.row.title}
        </el-button>
      );
    }
  },
  {
    prop: "columnName",
    label: "所属栏目",
    search: {
      el: "select",
      key: "columnId"
    },
    isFilterEnum: false,
    enum: articleColumn.value
  },
  {
    prop: "tags",
    label: "标签",
    tag: true,
    search: { el: "input" }
  },
  {
    prop: "status",
    label: "发布状态",
    width: 100,
    enum: articleStatus,
    search: {
      el: "select"
    }
  },
  { prop: "type", label: "类型", width: 60, enum: articleType },
  { prop: "sequence", label: "排序", width: 60 },
  {
    prop: "gmtCreate",
    label: "创建时间",
    width: 180,
    search: {
      el: "date-picker",
      props: { type: "datetimerange" }
    },
    render: scope => {
      return <span>{dayjs(scope.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss")}</span>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right" }
];
const addRef = ref();
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, hot: true, type: 0, top: 0, content: "" },
    isView: title === "查看",
    api: title === "新增" ? null : title === "编辑" ? null : null,
    getTableList: proTable.value.getTableList,
    articleColumn: articleColumn.value
  };
  addRef.value.acceptParams(params);
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
