<script setup lang="ts" name="SaveNote">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Note } from "@/api/interface/note";
import { noteValidate } from "@/utils/eleValidate";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  content: [{ validator: noteValidate, required: true, trigger: ["change", "blur"] }],
  phones: [{ required: true, message: "请输入接收短信手机号", trigger: ["change", "blur"] }]
});

interface DialogProps {
  title: string;
  rowData?: Note.SaveNote;
  isView: boolean;
  api?: ((params: Note.SaveNote) => Promise<any>) | null;
  getTableList?: () => Promise<any>;
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: "手动发送短信"
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
      Promise.reject(error);
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
      <el-form-item label="模板名称">
        <el-input v-model="dialogProps.rowData!.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input type="textarea" v-model="dialogProps.rowData!.content" :rows="2" autosize />
      </el-form-item>
      <el-form-item label="手机号码" prop="phones">
        <el-input type="textarea" v-model="dialogProps.rowData!.phones" :rows="2" autosize />
      </el-form-item>
      <el-alert type="info" show-icon :closable="false">
        <div style="display: flex">
          <p>模板内容：模板内容需在内容结尾增加【退订回T】</p>
          <el-button link type="primary" style="font-size: 12px" v-copy="'退订回T'">复制</el-button>
        </div>
      </el-alert>
      <el-alert type="info" show-icon :closable="false">
        <p>多个手机号码使用英文逗号拼接</p>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
