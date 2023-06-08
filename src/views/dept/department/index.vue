<template>
  <div class="main-box">
    <TreeFilter ref="treeFilterRef" :data="treeList" label="title" class="tree_filter" @change="changeTreeFilter" id="title" />
    <div class="table-box">
      <ProTable ref="proTableRef" :request-api="reqGetDepartList" :columns="columns" :init-param="initParam" row-key="id">
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus">新增</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation>
          <el-button type="primary" :icon="EditPen" link>编辑</el-button>
          <el-button type="danger" :icon="Delete" link>删除</el-button>
        </template>
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="ts" name="Department">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import { ref, reactive } from "vue";
import { reqGetDepartList } from "@/api/modules/system/department";
import { ColumnProps } from "@/components/ProTable/interface";
import { ElMessage } from "element-plus";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
const proTableRef = ref();
const treeFilterRef = ref();
const treeList = ref([
  {
    id: 0,
    title: "根租户",
    children: [
      {
        id: 1,
        title: "测试商户"
      },
      {
        id: 2,
        title: "钢百万"
      }
    ]
  }
]);
const columns: ColumnProps[] = [
  {
    prop: "name",
    label: "部门名称",
    width: 120,
    search: { el: "input", props: { placeholder: "部门名称" } }
  },
  { prop: "operation", label: "操作", width: 180, fixed: "right" }
];

const initParam = reactive({ tenantName: "根租户" });
const changeTreeFilter = (val: string) => {
  ElMessage.success(val);
  proTableRef.value!.pageable.pageNum = 1;
  initParam.tenantName = val;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
