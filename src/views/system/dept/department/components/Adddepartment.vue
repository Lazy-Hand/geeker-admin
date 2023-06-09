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
      await dialogProps.value.api!(dialogProps.value.rowData!);
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const treeList = ref([{ id: 0, title: "顶级目录", children: [{ id: 1, title: "上海分公司" }] }]);
// 暴露方法
defineExpose({
  acceptParams
});
</script>
<template>
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="30%" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" label-width="80px" :rules="rules">
      <el-form-item label="部门名称">
        <el-input />
      </el-form-item>
      <el-form-item label="描述">
        <el-input />
      </el-form-item>
      <el-form-item label="排序">
        <el-input />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否顶级">
            <el-radio-group>
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group>
              <el-radio label="1">正常</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上级部门">
        <el-tree-select
          style="width: 100%"
          accordion
          check-strictly
          :data="treeList"
          :props="{
            value: 'id',
            label: 'title',
            children: 'children'
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
