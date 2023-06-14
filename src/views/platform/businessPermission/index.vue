<script setup lang="tsx" name="BusinessPermission">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  reqGetBusinessPermissionList,
  reqGetPermissionTree,
  reqAssignPermission,
  reqAddBusinessPermission,
  reqEditBusinessPermission,
  reqDelBusinessPermission
} from "@/api/modules/platform/businessPermission";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Plus, Delete, EditPen } from "@element-plus/icons-vue";
// import { getRoleMenus } from '@/api/modules/user'
import { getAuthMenuListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
import { roleStatus } from "@/utils/serviceDict";
import { ResultEnum } from "@/enums/httpEnum";
import AddBusPermission from "./components/AddBusPermission.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { flattenTree } from "@/utils";
const addBusPermissionRef = ref();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
const treeFilterRef = ref();
// 点击当前行
const handleCurrentChange = async (val: any) => {
  const { data } = await reqGetPermissionTree(val.id);
  defaultValue.value = flattenTree(data, "childMenu");

  treeFilterRef.value.handleSetCheckedKeys(defaultValue.value);
  selectVal.value = defaultValue.value;
  roleId.value = val.id;
};

/**
 * @description 表格配置项
 */
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "权限名称", width: 120, search: { el: "input", props: { placeholder: "角色名称" } } },
  {
    prop: "description",
    label: "描述"
  },
  {
    prop: "sequenceNo",
    label: "排序",
    width: 120
  },
  {
    prop: "validFlag",
    label: "状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "角色状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.validFlag ? (
            <el-switch
              model-value={scope.row.validFlag}
              active-text={scope.row.validFlag ? "启用" : "禁用"}
              active-value={true}
              inactive-value={false}
              onClick={(event: Event) => changeStatus(event, scope.row)}
            />
          ) : (
            <el-tag type={scope.row.validFlag ? "success" : "danger"}>{scope.row.validFlag ? "启用" : "禁用"}</el-tag>
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
  },
  {
    prop: "createBy",
    label: "创建人",
    width: 180
  },
  { prop: "operation", label: "操作", width: 180, fixed: "right" }
];
/**
 *  @description 属性组件默认选中值<number[]>
 */
const defaultValue = ref<number[]>([]);
/**
 * @description 选中id集合 请求参数
 */
const selectVal = ref<number[]>([]);
const roleId = ref<number>();

/**
 * @description 权限保存按钮
 */
const submit = async () => {
  const res = await reqAssignPermission({ id: roleId.value as number, roleIds: selectVal.value });
  if (res.code === ResultEnum.SUCCESS) ElMessage.success("权限分配完成");
};

/**
 * @description 树形筛选切换
 * @param {Array} val 选中id集合
 */
const changeTreeFilter = (val: number[]) => {
  console.log("🚀 ~ file: index.vue:72 ~ changeTreeFilter ~ val", val);
  ElMessage.success("请注意查看请求参数变化 🤔");
  selectVal.value = val;
};

// 新增编辑查看弹窗
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, validFlag: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
    isView: title === "查看",
    api: title === "新增" ? reqAddBusinessPermission : title === "编辑" ? reqEditBusinessPermission : null,
    getTableList: proTable.value?.getTableList
  };
  addBusPermissionRef.value.acceptParams(params);
};

// 单条删除
const deleteRole = async (row: any) => {
  await useHandleData(reqDelBusinessPermission, { id: row.id }, `删除【${row.roleName}】角色`);
  proTable.value?.getTableList();
};

// 改变角色状态
const changeStatus = async (e: any, row: any) => {
  e.stopPropagation();
  await useHandleData(
    reqEditBusinessPermission,
    { validFlag: row.validFlag ? 0 : 1, id: row.id },
    `切换【${row.roleName}】角色状态`
  );
  proTable.value?.getTableList();
};

const { BUTTONS } = useAuthButtons();
</script>
<template>
  <div class="main-box">
    <div class="table-box" style="margin-right: 0.75rem">
      <ProTable
        ref="proTable"
        title="用户列表"
        :columns="columns"
        :requestApi="reqGetBusinessPermissionList"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" :icon="EditPen" @click="openDialog('编辑', scope.row)" link>编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteRole(scope.row)" link>删除</el-button>
        </template>
      </ProTable>
      <AddBusPermission ref="addBusPermissionRef" />
    </div>
    <TreeFilter
      ref="treeFilterRef"
      style="width: 320px"
      submit-btn="保存"
      :submit="submit"
      label="title"
      title="菜单权限"
      multiple
      :requestApi="getAuthMenuListApi"
      @change="changeTreeFilter"
      :defaultValue="defaultValue"
    />
  </div>
</template>
