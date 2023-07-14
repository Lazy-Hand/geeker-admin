<script setup lang="tsx" name="BusnessRole">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import { addRoleMenu, getRoleMenuList, reqPutRole } from "@/api/modules/system/role";
import { nextTick, ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
// import { Plus, Delete, EditPen } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { roleStatus } from "@/utils/serviceDict";
import { ResultEnum } from "@/enums/httpEnum";
import AddBusRole from "./components/AddBusRole.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { flattenTree } from "@/utils";
import { reqGetBusinessRoleList, reqGetTendPermissionTree } from "@/api/modules/platform/businessRole";
const addBusRoleRef = ref();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
const treeFilterRef = ref();
const treeList = ref([]);
// 点击当前行
const handleCurrentChange = async (val: any) => {
  if (!val) {
    treeFilterRef.value?.clearChecked();
    selectVal.value = [];
    roleId.value = undefined;
    treeList.value = [];
    return;
  }
  const { data: treeData } = await reqGetTendPermissionTree(val.tenantId);
  nextTick(() => {
    treeList.value = treeData;
  });
  const { data } = await getRoleMenuList(val.id);
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
  { prop: "roleName", label: "角色名称", width: 120, search: { el: "input", props: { placeholder: "角色名称" } } },
  {
    prop: "roleCode",
    label: "角色标识",
    width: 160
  },
  {
    prop: "roleDesc",
    label: "描述"
  },
  {
    prop: "sequenceNo",
    label: "排序",
    width: 120
  },
  {
    prop: "validFlag",
    label: "角色状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "角色状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.validFlag || BUTTONS.value.ROLE_ADMIN ? (
            <el-switch
              model-value={scope.row.validFlag}
              active-text={scope.row.validFlag ? "启用" : "禁用"}
              active-value={true}
              inline-prompt
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
  }
  // { prop: "operation", label: "操作", width: 180, fixed: "right" }
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
  const res = await addRoleMenu(selectVal.value, roleId.value as number);
  if (res.code === ResultEnum.SUCCESS) ElMessage.success("权限分配完成");
};

/**
 * @description 树形筛选切换
 * @param {Array} val 选中id集合
 */
const changeTreeFilter = (val: number[]) => {
  selectVal.value = val;
};

// 新增编辑查看弹窗
// const openDialog = (title: string, rowData: any = {}) => {
//   let params = {
//     title,
//     rowData: { ...rowData, validFlag: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
//     isView: title === "查看",
//     api: title === "新增" ? reqAddRole : title === "编辑" ? reqPutRole : null,
//     getTableList: proTable.value?.getTableList
//   };
//   addBusRoleRef.value.acceptParams(params);
// };

// 单条删除
// const deleteRole = async (row: any) => {
//   await useHandleData(reqDelRole, { id: row.id }, `删除【${row.roleName}】角色`);
//   proTable.value?.getTableList();
// };
// 改变角色状态
const changeStatus = async (e: any, row: any) => {
  e.stopPropagation();
  await useHandleData(reqPutRole, { validFlag: row.validFlag ? 0 : 1, id: row.id }, `切换【${row.roleName}】角色状态`);
  proTable.value?.getTableList();
};
const { BUTTONS } = useAuthButtons();
const getTableList = (params: any) => {
  const newParams = { ...params };

  if (newParams.validFlag !== undefined) {
    newParams.validFlag = newParams.validFlag ? 1 : 0;
  }

  return reqGetBusinessRoleList(newParams);
};
</script>
<template>
  <div class="main-box">
    <div class="table-box" style="margin-right: 0.75rem">
      <ProTable
        ref="proTable"
        title="用户列表"
        :columns="columns"
        :requestApi="getTableList"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <!-- <template #tableHeader>
          <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增</el-button>
        </template> -->
        <!-- 表格操作 -->
        <!-- <template #operation="scope">
          <el-button type="primary" :icon="EditPen" @click="openDialog('编辑', scope.row)" link>编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteRole(scope.row)" link>删除</el-button>
        </template> -->
      </ProTable>
      <AddBusRole ref="addBusRoleRef" />
    </div>
    <TreeFilter
      ref="treeFilterRef"
      style="width: 320px"
      submit-btn="保存"
      :data="treeList"
      :submit="submit"
      label="title"
      title="菜单权限"
      multiple
      @change="changeTreeFilter"
      :defaultValue="defaultValue"
      treeChildren="childMenu"
      :check-strictly="false"
    />
  </div>
</template>
