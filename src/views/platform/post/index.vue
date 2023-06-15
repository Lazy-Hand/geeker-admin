<template>
  <div class="main-box">
    <TreeFilter ref="treeFilterRef" :request-api="reqGetTenantList" label="name" class="tree_filter" @change="changeTreeFilter" />
    <div class="table-box">
      <ProTable ref="proTableRef" :request-api="getTableList" :columns="columns" :init-param="initParam" row-key="id">
        <!-- <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus">新增</el-button>
        </template> -->
        <!-- 表格操作 -->
        <!-- <template #operation>
          <el-button type="primary" :icon="EditPen" link>编辑</el-button>
          <el-button type="danger" :icon="Delete" link>删除</el-button>
        </template> -->
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="PostData">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { reqGetTenantList } from "@/api/modules/platform/tdepartment";
// import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { roleStatus } from "@/utils/serviceDict";
import { reqBusPostList } from "@/api/modules/platform/busPost";
const { BUTTONS } = useAuthButtons();
const proTableRef = ref();
const treeFilterRef = ref();
const columns: ColumnProps[] = [
  {
    prop: "name",
    label: "部门名称",
    width: 160,
    search: { el: "input", props: { placeholder: "岗位名称" } }
  },
  {
    prop: "sort",
    label: "排序"
  },
  {
    prop: "description",
    label: "描述"
  },
  {
    prop: "status",
    label: "状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "岗位状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={"启用"}
              inactive-text={"禁用"}
              active-value={true}
              inactive-value={false}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "gmtCreate",
    label: "创建时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  }
  // { prop: "operation", label: "操作", width: 180, fixed: "right" }
];

const initParam = reactive({ tenantId: "" });
const changeTreeFilter = (val: string) => {
  proTableRef.value!.pageable.pageNum = 1;
  proTableRef.value!.reset();
  initParam.tenantId = val;
};
const getTableList = (params: any) => {
  const newParams = { ...params };

  if (newParams.status !== undefined) {
    newParams.status = newParams.status ? 1 : 0;
  }

  return reqBusPostList(newParams);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
