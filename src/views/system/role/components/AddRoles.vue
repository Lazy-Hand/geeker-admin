<script setup lang="ts" name="AddRoles">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Role } from "@/api/interface/role";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  roleCode: [{ required: true, message: "请输入角色标识", trigger: "change" }],
  roleName: [{ required: true, message: "请输入角色名称", trigger: "change" }],
  roleDesc: [{ required: true, message: "请输入角色描述", trigger: "change" }]
});
interface DialogProps {
  title: string;
  rowData?: Role.RoleAddParams;
  isView: boolean;
  api?: (params: Role.RoleAddParams) => Promise<any>;
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
// 暴露方法
defineExpose({
  acceptParams
});
</script>
<template>
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="500" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" label-width="80px" :rules="rules">
      <el-form-item label="角色标识" prop="roleCode">
        <el-input v-model="dialogProps.rowData!.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dialogProps.rowData!.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-radio-group v-model="dialogProps.rowData!.validFlag">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="roleDesc">
        <el-input v-model="dialogProps.rowData!.roleDesc"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model.number="dialogProps.rowData!.sequenceNo" controls-position="right"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
