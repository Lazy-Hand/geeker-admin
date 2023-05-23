<script setup lang="ts" name="AddSendDict">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  paramName: [{ required: true, message: "请输入字典名称", trigger: "change" }],
  paramValue: [{ required: true, message: "请输入字典值", trigger: "change" }]
});
interface DialogProps {
  title: string;
  rowData?: any;
  isView: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: ""
});
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (!valid) return console.log("submit!");
    try {
      await dialogProps.value.api!(dialogProps.value.rowData);
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  dialogProps.value = params;
  dialogVisible.value = true;
};
// 暴露方法
defineExpose({
  acceptParams
});
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="dialogProps.title" width="400" draggable destroy-on-close>
    <el-form
      ref="ruleFormRef"
      :model="dialogProps.rowData"
      :rules="rules"
      :disabled="dialogProps.isView"
      :hide-required-asterisk="dialogProps.isView"
    >
      <el-form-item label="字典名称" prop="paramName">
        <el-input v-model="dialogProps.rowData.paramName"></el-input>
      </el-form-item>
      <el-form-item label="字典键值" prop="paramValue">
        <el-input v-model="dialogProps.rowData.paramValue"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="dialogProps.rowData.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
