<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="员工列表" :request-api="reqGetEmpList" :columns="columns">
      <template #operation>
        <el-button type="primary" link :icon="EditPen"> 编辑 </el-button>
        <el-button type="primary" link :icon="Refresh"> 重置密码 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </ProTable>
    <AddEmployee ref="addEmployeeRef" />
  </div>
</template>

<script setup lang="tsx" name="BackgroundUser">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetEmpList } from "@/api/modules/system/employee";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { roleStatus } from "@/utils/serviceDict";
import { Delete, EditPen, Refresh } from "@element-plus/icons-vue";
const proTableRef = ref<ProTableInstance>();
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "nickName", label: "用户昵称", width: 120, search: { el: "input", props: { placeholder: "用户昵称" } } },
  { prop: "userName", label: "用户账号", width: 120 },
  { prop: "name", label: "真是姓名", width: 120 },
  { prop: "userPhone", label: "手机号码", width: 120, search: { el: "input", props: { placeholder: "手机号码" } } },
  { prop: "userName", label: "部门", width: 120 },
  { prop: "userName", label: "岗位", width: 120 },
  { prop: "userName", label: "角色", width: 120 },
  {
    prop: "status",
    label: "员工状态",
    enum: roleStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "角色状态" } },
    render: scope => {
      return (
        <>
          <el-switch
            model-value={scope.row.validFlag}
            active-text={scope.row.validFlag ? "启用" : "禁用"}
            active-value={true}
            inactive-value={false}
          />
        </>
      );
    }
  },
  {
    prop: "gmtCreate",
    label: "最后登录时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  },
  {
    prop: "gmtCreate",
    label: "创建时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];
</script>

<style scoped lang="scss"></style>
