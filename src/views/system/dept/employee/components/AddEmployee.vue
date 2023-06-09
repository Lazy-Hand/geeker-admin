<script setup lang="ts" name="AddEmployee">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
export interface AddRole {
  id?: number;
  roleCode: string;
  roleName: string;
  validFlag: number;
  roleDesc: string;
  sequenceNo: number;
}
import type { FormInstance, FormRules } from "element-plus";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  roleCode: [{ required: true, message: "请输入角色标识", trigger: "change" }],
  roleName: [{ required: true, message: "请输入角色名称", trigger: "change" }],
  roleDesc: [{ required: true, message: "请输入角色描述", trigger: "change" }]
});
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
      await dialogProps.value.api!(dialogProps.value.rowData!);
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const options = ref([
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
]);

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
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group>
              <el-radio>男</el-radio>
              <el-radio>女</el-radio>
              <el-radio>保密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-select>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group>
              <el-radio>正常</el-radio>
              <el-radio>禁用</el-radio>
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
