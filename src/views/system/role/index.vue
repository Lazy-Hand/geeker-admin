<script setup lang="tsx" name="Role">
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  getRoleList,
  getRoleMenuList,
  addRoleMenu,
  reqAddRole,
  reqPutRole,
  reqDelRole,
  reqBatchDelRoles
} from "@/api/modules/role";
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download } from "@element-plus/icons-vue";
// import { getRoleMenus } from '@/api/modules/user'
import { getAuthMenuListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { isNo } from "@/utils/serviceDict";
import { ResultEnum } from "@/enums/httpEnum";
import AddRoles from "./components/AddRoles.vue";
import { useHandleData } from "@/hooks/useHandleData";
const addRoles = ref();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
// 点击当前行
const handleCurrentChange = async (val: any) => {
  const { data } = await getRoleMenuList(val.id);
  defaultValue.value = data.map(item => {
    return item.id;
  });
  selectVal.value = defaultValue.value;
  roleId.value = val.id;
};
/**
 * @description 表格配置项
 */
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "roleName", label: "角色名称", width: 120, search: { el: "input" } },
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
    label: "是否有效",
    enum: isNo,
    width: 120
  },
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
  console.log("🚀 ~ file: index.vue:72 ~ changeTreeFilter ~ val", val);
  ElMessage.success("请注意查看请求参数变化 🤔");
  selectVal.value = val;
};
const openDialog = (title: string, rowData: any = {}) => {
  console.log(rowData);

  let params = {
    title,
    rowData: { ...rowData, validFlag: title === "新增" ? 1 : title === "编辑" && rowData.validFlag ? 1 : 0 },
    isView: title === "查看",
    api: title === "新增" ? reqAddRole : title === "编辑" ? reqPutRole : null,
    getTableList: proTable.value.getTableList
  };
  addRoles.value.acceptParams(params);
};
const deleteRole = async (row: any) => {
  await useHandleData(reqDelRole, { id: row.id }, `删除【${row.roleName}】角色`);
  proTable.value.getTableList();
};
const batchDelRoles = async (id: string[]) => {
  await useHandleData(reqBatchDelRoles, id, "删除所选角色");
  proTable.value.clearSelection();
  proTable.value.getTableList();
};
</script>
<template>
  <div class="main-box">
    <TreeFilter
      label="title"
      title="租户"
      :requestApi="getAuthMenuListApi"
      @change="changeTreeFilter"
      :defaultValue="1"
      v-if="1 !== 1"
    />

    <div class="table-box mr-3">
      <ProTable
        ref="proTable"
        title="用户列表"
        :columns="columns"
        :requestApi="getRoleList"
        highlight-current-row
        :pagination="false"
        :searchCol="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
        @current-change="handleCurrentChange"
      >
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
          <el-button type="primary" plain :icon="EditPen" :disabled="scope.selectedListIds.length !== 1">修改</el-button>
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="!scope.isSelected"
            @click="batchDelRoles(scope.selectedListIds)"
            >删除</el-button
          >
          <el-button type="primary" plain :icon="Download">导出</el-button>
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