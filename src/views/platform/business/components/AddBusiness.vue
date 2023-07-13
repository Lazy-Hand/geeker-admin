<script setup lang="ts" name="AddBusiness">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import { reqSelectBusinessAuthList } from "@/api/modules/platform/business";
export interface AddRole {
  id?: number;
  logo?: any;
  name?: string;
  adminPhone?: string;
  trole?: any;
  status?: number;
}
import type { FormInstance, FormRules } from "element-plus";
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
      await dialogProps.value.api!({
        ...dialogProps.value.rowData!,
        trole: dialogProps.value.rowData!.trole!.join(","),
        logo: dialogProps.value.rowData!.logo!.httpUrl
      });
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const selectBusAuth = ref<any[]>([]);
const getSelectBusAuth = async () => {
  const { data } = await reqSelectBusinessAuthList();
  selectBusAuth.value = data;
};
onMounted(() => {
  getSelectBusAuth();
});
// 暴露方法
defineExpose({
  acceptParams
});
</script>
<template>
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="30%" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" label-width="80px" :rules="rules">
      <el-form-item label="商户Logo">
        <UploadImg v-model:imageUrl="dialogProps.rowData!.logo"></UploadImg>
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="dialogProps.rowData!.name"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" v-if="dialogProps.title === '新增'">
        <el-input v-model="dialogProps.rowData!.adminPhone"></el-input>
      </el-form-item>
      <el-form-item label="商户权限">
        <el-select v-model="dialogProps.rowData!.trole" multiple>
          <el-option v-for="item in selectBusAuth" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dialogProps.rowData!.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
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
