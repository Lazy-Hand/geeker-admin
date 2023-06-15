<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="员工列表" :request-api="reqGetEmpList" :columns="columns">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增用户</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="success" link :icon="Refresh" @click="resetPwd(scope.row)"> 重置密码 </el-button>
        <el-button type="danger" link :icon="Delete" @click="delEmp(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <AddEmployee ref="addEmployeeRef" />
  </div>
</template>

<script setup lang="tsx" name="EmployeeManage">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetEmpList, reqResetPwd, reqDeleteEmp, reqAddEmp, reqEditEmp } from "@/api/modules/system/employee";
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { twoStatus } from "@/utils/serviceDict";
import AddEmployee from "./components/AddEmployee.vue";
import { Delete, EditPen, Refresh, CirclePlus } from "@element-plus/icons-vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useHandleData } from "@/hooks/useHandleData";
const { BUTTONS } = useAuthButtons();
const proTableRef = ref<ProTableInstance>();
const addEmployeeRef = ref();
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "用户昵称", width: 120, search: { el: "input", key: "keyWord", props: { placeholder: "关键词搜索" } } },
  { prop: "account", label: "用户账号", width: 120 },
  { prop: "realName", label: "真实姓名", width: 120 },
  { prop: "phone", label: "手机号码", width: 120, search: { el: "input", props: { placeholder: "手机号码" } } },
  {
    prop: "dept",
    label: "部门",
    minWidth: 140,
    render: scope => {
      return (
        <>
          {scope.row.dept
            ? scope.row.dept.map((item: any) => {
                return (
                  <el-tag key={item.id} type="success" class="tag">
                    {item.deptName}
                  </el-tag>
                );
              })
            : "--"}
        </>
      );
    }
  },
  {
    prop: "job",
    label: "岗位",
    minWidth: 140,
    render: scope => {
      return (
        <>
          {scope.row.job
            ? scope.row.job.map((item: any) => {
                return (
                  <el-tag key={item.id} type="success">
                    {item.jobName}
                  </el-tag>
                );
              })
            : "--"}
        </>
      );
    }
  },
  {
    prop: "role",
    label: "角色",
    minWidth: 140,
    render: scope => {
      return (
        <>
          {scope.row.role
            ? scope.row.role.map((item: any) => {
                return (
                  <el-tag key={item.id} type="success">
                    {item.roleName}
                  </el-tag>
                );
              })
            : "--"}
        </>
      );
    }
  },
  {
    prop: "status",
    label: "员工状态",
    enum: twoStatus,
    width: 120,
    search: { el: "select", props: { placeholder: "角色状态" } },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              inline-prompt
              active-text={"启用"}
              inactive-text={"禁用"}
              onClick={() => switchStatus(scope.row)}
              model-value={scope.row.status}
              active-value={1}
              inactive-value={0}
            />
          ) : (
            <el-tag type={scope.row.status === 1 ? "success" : "danger"}>{scope.row.status === 1 ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "lastTime",
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
  { prop: "operation", label: "操作", fixed: "right", width: 300 }
];

// 新增编辑查看弹窗
const openDialog = async (title: string, rowData: any = {}) => {
  let params = {
    title,
    rowData:
      title === "新增"
        ? {
            ...rowData,
            sex: 0,
            status: 1
          }
        : {
            ...rowData,
            dept: rowData.dept ? rowData.dept.map((item: any) => item.deptId) : [],
            job: rowData.job ? rowData.job.map((item: any) => item.jobId) : [],
            role: rowData.role ? rowData.role.map((item: any) => item.roleId) : []
          },
    isView: title === "查看",
    api: title === "新增" ? reqAddEmp : title === "编辑" ? reqEditEmp : null,
    getTableList: proTableRef.value?.getTableList
  };
  addEmployeeRef.value.acceptParams(params);
};

// 重置密码
const resetPwd = async (row: any) => {
  await useHandleData(reqResetPwd, row.id, `重置【${row.name}】密码`);
  proTableRef.value?.getTableList();
};

// 删除
const delEmp = async (row: any) => {
  await useHandleData(reqDeleteEmp, row.id, `删除【${row.name}员工】`);
  proTableRef.value?.getTableList();
};

// 切换状态
const switchStatus = async (row: any) => {
  await useHandleData(reqEditEmp, { id: row.id, status: row.status === 1 ? 0 : 1 }, `切换【${row.name}】用户状态`);
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
