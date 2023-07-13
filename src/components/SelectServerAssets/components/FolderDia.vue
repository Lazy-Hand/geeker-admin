<template>
  <el-form :model="folderForm" ref="folderFormRef" label-width="80px">
    <el-form-item label="分类名称">
      <el-input v-model="folderForm.name"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="folderForm.remark"></el-input>
    </el-form-item>
  </el-form>
  <div style="width: 100%; text-align: right">
    <el-button @click="closeDialog(false)">关闭</el-button>
    <el-button type="primary" @click="submit" :loading="submitLoading">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { addFolder, editorFolder } from "@/api/modules/upload";
import { ElMessage } from "element-plus";
import { ref } from "vue";
const props = withDefaults(defineProps<{ id: number; name?: string; remark?: string }>(), {
  id: -1,
  name: "",
  remark: ""
});
const emit = defineEmits(["close"]);
console.log(props);
const submitLoading = ref(false);
const folderForm = ref({
  name: props.name,
  remark: props.remark
});

const submit = async () => {
  try {
    if (props.id === -1) {
      await addFolder(folderForm.value);
      ElMessage({
        message: "新增分类成功",
        type: "success"
      });
    } else {
      await editorFolder(folderForm.value, props.id);
      ElMessage({
        message: "编辑分类成功",
        type: "success"
      });
    }

    closeDialog(true);
  } catch (error) {
    Promise.reject(error);
  }
};
const closeDialog = (type: boolean) => {
  emit("close", {
    submit: type
  });
};
</script>

<style lang="scss" scoped></style>
