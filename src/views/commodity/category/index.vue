<template>
  <div class="table-box">
    <ProTable ref="protableRef" title="商品分类" :columns="columns" :pagination="false" :border="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus">添加商品</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation>
        <el-button :icon="CirclePlus" type="primary" link>添加子目录</el-button>
        <el-button :icon="EditPen" type="primary" link>编辑</el-button>
        <el-button :icon="Delete" type="primary" link>删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { ref } from "vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
const protableRef = ref<ProTableInstance>();

const columns: ColumnProps[] = [
  { prop: "username", label: "名称", width: 180, search: { el: "input" } },
  { prop: "username", label: "类型" },
  {
    prop: "username",
    label: "分类图标",
    render: () => {
      return <img src="https://img.yzcdn.cn/vant/ipad.jpeg" alt="" style="width: 50px; height: 50px;" />;
    }
  },
  { prop: "username", label: "排序" },
  { prop: "username", label: "状态", search: { el: "tree-select", props: { filterable: true } } },
  { prop: "operation", label: "操作", fixed: "right" }
];
</script>

<style lang="scss" scoped></style>
