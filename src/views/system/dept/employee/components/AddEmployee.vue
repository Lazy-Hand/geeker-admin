<script setup lang="ts" name="AddEmployee">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
export interface AddRole {
  id?: number;
  account: string;
  phone: string;
  name: string;
  realName: string;
  email: string;
  sex: number;
  status: number;
  dept: any;
  job: any;
  role: any;
}
import type { FormInstance, FormRules } from "element-plus";
import { reqGetDeptSelect, reqGetPostSelect, reqGetRoleSelect } from "@/api/modules/system/employee";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({});
interface DialogProps {
  title: string;
  rowData?: AddRole;
  isView: boolean;
  api?: (params: AddRole) => Promise<any>;
  getTableList?: () => Promise<any>;
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: "新增"
});
// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  dialogProps.value = params;
  dialogVisible.value = true;
};
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (!valid) return console.log("submit!");
    try {
      console.log(dialogProps.value.rowData!);

      await dialogProps.value.api!({
        ...dialogProps.value.rowData!,
        dept: dialogProps.value.rowData!.dept!.join(","),
        job: dialogProps.value.rowData!.job!.join(","),
        role: dialogProps.value.rowData!.role!.join(",")
      });
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const selectDept = ref<any[]>([]);
const selectJob = ref<any[]>([]);
const selectRole = ref<any[]>([]);
const getSelectDept = async () => {
  const { data } = await reqGetDeptSelect();

  selectDept.value = data;
};
const getSelectJob = async () => {
  const { data } = await reqGetPostSelect();

  selectJob.value = data;
};
const getSelectRole = async () => {
  const { data } = await reqGetRoleSelect();
  selectRole.value = data;
};
onMounted(() => {
  getSelectDept();
  getSelectJob();
  getSelectRole();
});

// 暴露方法
defineExpose({
  acceptParams
});
</script>
<template>
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="35%" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名">
            <el-input v-model="dialogProps.rowData!.account"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input v-model="dialogProps.rowData!.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
            <el-input v-model="dialogProps.rowData!.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名">
            <el-input v-model="dialogProps.rowData!.realName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="dialogProps.rowData!.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="dialogProps.rowData!.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
              <el-radio :label="0">保密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-select v-model="dialogProps.rowData!.dept" multiple>
              <el-option v-for="item in selectDept" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="dialogProps.rowData!.job" multiple>
              <el-option v-for="item in selectJob" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="dialogProps.rowData!.role" multiple>
              <el-option v-for="item in selectRole" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="dialogProps.rowData!.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
