<script setup lang="ts" name="AddEmployee">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
export interface AddDepart {
  id?: number;
  name: string;
  description: string;
  sort: number;
  pid: number;
  status: number;
  isTop: number;
}
import type { FormInstance, FormRules } from "element-plus";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({});
interface DialogProps {
  title: string;
  rowData?: AddDepart;
  isView: boolean;
  api?: (params: AddDepart) => Promise<any>;
  getTableList?: () => Promise<any>;
  treeList?: any[];
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: "新增",
  treeList: []
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
        pid: dialogProps.value.rowData!.isTop === 0 ? 0 : dialogProps.value.rowData!.pid
      });
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
      <el-form-item label="部门名称">
        <el-input v-model="dialogProps.rowData!.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogProps.rowData!.description" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="dialogProps.rowData!.sort" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否顶级">
            <el-radio-group v-model="dialogProps.rowData!.isTop">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="dialogProps.rowData!.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上级部门">
        <el-tree-select
          :disabled="dialogProps.rowData?.isTop === 0"
          v-model="dialogProps.rowData!.pid"
          style="width: 100%"
          accordion
          check-strictly
          :data="dialogProps.treeList"
          :props="{
            value: 'id',
            label: 'name',
            children: 'childMenu'
          }"
        ></el-tree-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
