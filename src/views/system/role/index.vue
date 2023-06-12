<script setup lang="tsx" name="Role">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import { getRoleList, getRoleMenuList, addRoleMenu, reqAddRole, reqPutRole, reqDelRole } from "@/api/modules/system/role";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Plus, Delete, EditPen } from "@element-plus/icons-vue";
// import { getRoleMenus } from '@/api/modules/user'
import { getAuthMenuListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
import { roleStatus } from "@/utils/serviceDict";
import { ResultEnum } from "@/enums/httpEnum";
import AddRoles from "./components/AddRoles.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { flattenTree } from "@/utils";
const addRoles = ref();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
const treeFilterRef = ref();
// 点击当前行
const handleCurrentChange = async (val: any) => {
  const { data } = await getRoleMenuList(val.id);
  treeFilterRef.value.handleSetCheckedKeys(flattenTree(data, "childMenu"));
  selectVal.value = flattenTree(data, "childMenu");

  roleId.value = val.id;
};

/**
 * @description 表格配置项
 */
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "roleName", label: "角色名称", width: 120, search: { el: "input", props: { placeholder: "角色名称" } } },
  {
    prop: "roleCode",
    label: "角色标识",
    width: 120
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
const openDialog = (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData: { ...rowData, validFlag: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
    isView: title === "查看",
    api: title === "新增" ? reqAddRole : title === "编辑" ? reqPutRole : null,
    getTableList: proTable.value?.getTableList
  };
  addRoles.value.acceptParams(params);
};

// 单条删除
const deleteRole = async (row: any) => {
  await useHandleData(reqDelRole, { id: row.id }, `删除【${row.roleName}】角色`);
  proTable.value?.getTableList();
};

// // 批量删除
// const batchDelRoles = async (id: string[]) => {
//   await useHandleData(reqBatchDelRoles, id, "删除所选角色");
//   proTable.value.clearSelection();
//   proTable.value.getTableList();
// };

// 改变角色状态
const changeStatus = async (e: any, row: any) => {
  e.stopPropagation();
  await useHandleData(reqPutRole, { validFlag: row.validFlag ? 0 : 1, id: row.id }, `切换【${row.roleName}】角色状态`);
  proTable.value?.getTableList();
};

// 处理列表请求数据
const getTableList = (params: any) => {
  const newParams = { ...params };
  newParams.startTime = params.gmtCreate?.[0];
  newParams.endTime = params.gmtCreate?.[1];
  delete newParams.gmtCreate;
  return getRoleList(newParams);
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
        :requestApi="getTableList"
        highlight-current-row
        :pagination="false"
        @current-change="handleCurrentChange"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="Plus" @click="openDialog('新增')">新增</el-button>
          <!-- <el-button type="primary" plain :icon="EditPen" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="!scope.isSelected"
            @click="batchDelRoles(scope.selectedListIds)"
            >删除</el-button
          >
          <el-button type="primary" plain :icon="Download">导出</el-button> -->
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" :icon="EditPen" @click="openDialog('编辑', scope.row)" link>编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteRole(scope.row)" link>删除</el-button>
        </template>
      </ProTable>
      <AddRoles ref="addRoles" />
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
