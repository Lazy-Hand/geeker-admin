<script setup lang="ts" name="AddPost">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
export interface AddPost {
  id?: number;
  name: string;
  sort: number;
  description: string;
  status: number;
}
import type { FormInstance, FormRules } from "element-plus";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({});
interface DialogProps {
  title: string;
  rowData?: AddPost;
  isView: boolean;
  api?: (params: AddPost) => Promise<any>;
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
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="30%" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" label-width="80px" :rules="rules">
      <el-form-item label="岗位名称">
        <el-input v-model="dialogProps.rowData!.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogProps.rowData!.description" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="dialogProps.rowData!.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dialogProps.rowData!.status">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
