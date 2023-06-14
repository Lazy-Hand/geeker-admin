<script setup lang="ts" name="AddMenus">
import { ref, reactive } from "vue";
import SelectIcon from "@/components/SelectIcon/index.vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入菜单标题", trigger: "change" }],
  path: [{ required: true, message: "请输入路由地址", trigger: "change" }],
  name: [{ required: true, message: "请输入路由名称", trigger: "change" }]
});
const buttonRules = reactive<FormRules>({
  title: [{ required: true, message: "请输入按钮标题", trigger: "change" }]
});
interface DialogProps {
  title: string;
  rowData?: any;
  isView: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
  tableData: Menu.MenuOptions[];
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: "新增",
  tableData: []
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (!valid) return console.log("submit!");
    // 类型切换之后只收集关键信息
    let newForm: Record<any, any>;
    switch (dialogProps.value.rowData.menuType) {
      case "M":
        newForm = {
          id: dialogProps.value.rowData.id,
          menuType: dialogProps.value.rowData.menuType,
          icon: dialogProps.value.rowData.icon,
          affix: dialogProps.value.rowData.affix,
          full: dialogProps.value.rowData.full,
          hidden: dialogProps.value.rowData.hidden,
          cache: dialogProps.value.rowData.cache,
          link: dialogProps.value.rowData.isLink ? dialogProps.value.rowData.path : null,
          title: dialogProps.value.rowData.title,
          path: dialogProps.value.rowData.path,
          menuSort: dialogProps.value.rowData.menuSort,
          parentId: dialogProps.value.rowData.parentId
        };
        break;
      case "C":
        newForm = {
          id: dialogProps.value.rowData.id,
          menuType: dialogProps.value.rowData.menuType,
          permission: dialogProps.value.rowData.permission,
          icon: dialogProps.value.rowData.icon,
          hidden: dialogProps.value.rowData.hidden,
          link: dialogProps.value.rowData.isLink ? dialogProps.value.rowData.path : null,
          title: dialogProps.value.rowData.title,
          path: dialogProps.value.rowData.path,
          name: dialogProps.value.rowData.name,
          menuSort: dialogProps.value.rowData.menuSort,
          component: dialogProps.value.rowData.component,
          parentId: dialogProps.value.rowData.parentId
        };
        break;
      case "A":
        newForm = {
          id: dialogProps.value.rowData.id,
          menuType: dialogProps.value.rowData.menuType,
          permission: dialogProps.value.rowData.permission,
          title: dialogProps.value.rowData.title,
          menuSort: dialogProps.value.rowData.menuSort,
          parentId: dialogProps.value.rowData.parentId
        };
        break;
      default:
        newForm = {};
    }
    try {
      await dialogProps.value.api!({
        ...newForm
      });
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const loadProps = {
  value: "id",
  label: "title",
  children: "children"
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
  <el-dialog el-dialog v-model="dialogVisible" :title="dialogProps.title" width="700" draggable destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" :rules="dialogProps.rowData.menuType === 'C' ? rules : buttonRules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="dialogProps.rowData.menuType">
              <el-radio-button label="M">目录</el-radio-button>
              <el-radio-button label="C">菜单</el-radio-button>
              <el-radio-button label="A">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.rowData.menuType !== 'M'">
          <el-form-item label="权限标识">
            <el-input v-model="dialogProps.rowData.permission" placeholder="权限标识 system:menuManage:add"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.rowData.menuType === 'A'">
          <el-form-item label="按钮标题" prop="title">
            <el-input v-model="dialogProps.rowData.title" placeholder="按钮标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="菜单图标" v-if="dialogProps.rowData.menuType !== 'A'">
        <SelectIcon v-model:icon-value="dialogProps.rowData.icon" />
      </el-form-item>
      <el-row>
        <el-col :span="8" v-if="dialogProps.rowData.menuType === 'C'">
          <el-form-item label="固定导航">
            <el-radio-group v-model="dialogProps.rowData.affix" :disabled="dialogProps.rowData.isLink">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dialogProps.rowData.menuType === 'C'">
          <el-form-item label="是否全屏">
            <el-radio-group v-model="dialogProps.rowData.full" :disabled="dialogProps.rowData.isLink">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dialogProps.rowData.menuType !== 'A'">
          <el-form-item label="菜单可见">
            <el-radio-group v-model="dialogProps.rowData.hidden">
              <el-radio-button :label="false">是</el-radio-button>
              <el-radio-button :label="true">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dialogProps.rowData.menuType === 'C'">
          <el-form-item label="菜单缓存">
            <el-radio-group v-model="dialogProps.rowData.cache">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dialogProps.rowData.menuType !== 'A'">
          <el-form-item label="外链菜单">
            <el-radio-group v-model="dialogProps.rowData.isLink">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" v-if="dialogProps.rowData.menuType !== 'A'">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model="dialogProps.rowData.title" placeholder="菜单标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.rowData.menuType !== 'A'">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="dialogProps.rowData.path" placeholder="路由地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序">
            <el-input-number
              placeholder="菜单排序"
              v-model.number="dialogProps.rowData.menuSort"
              controls-position="right"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.rowData.menuType !== 'A'">
          <el-form-item label="路由名称" prop="name">
            <el-input v-model="dialogProps.rowData.name" placeholder="路由名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.rowData.menuType === 'C'">
          <el-form-item label="组件路径">
            <el-input v-model="dialogProps.rowData.component" placeholder="组件路径"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上级目录">
        <el-tree-select
          placeholder="请选择上级菜单"
          accordion
          style="width: 100%"
          v-model="dialogProps.rowData.parentId"
          check-strictly
          :props="loadProps"
          :data="dialogProps.tableData"
        ></el-tree-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
