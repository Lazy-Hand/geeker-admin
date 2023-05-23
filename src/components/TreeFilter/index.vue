<template>
  <div class="card filter">
    <div class="flex justify-between">
      <h4 class="title sle" v-if="title">{{ title }}</h4>
      <el-button type="primary" class="w-20" v-if="submitBtn" @click="defaultClick" :loading="loading">{{ submitBtn }}</el-button>
    </div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar
      :style="{
        height: title && submitBtn ? `calc(100% - 140px)` : title || submitBtn ? `calc(100% - 95px)` : `calc(100% - 56px)`
      }"
    >
      <el-tree
        ref="treeRef"
        :default-expand-all="false"
        :lazy="lazy"
        :load="load"
        :node-key="id"
        :data="treeData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? defaultValue : ''"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? defaultValue : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
import { ref, watch, onBeforeMount } from "vue";
import { ElTree } from "element-plus";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
  data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string; // treeFilter 标题 ==> 非必传
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
  defaultValue?: any; // 默认选中的值 ==> 非必传
  submitBtn?: string; // 按钮显示-文字 ==> 非必传
  lazy?: boolean; // 子节点懒加载 ==> 非必传
  submit?: (data?: any) => Promise<any>; // 按钮点击事件处理函数 ==> 非必传， 需传submitBtn生效
  load?: (node: any, resolve: any) => void; // 子节点懒加载事件 ==> 非必传，需lazy生效
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false,
  lazy: false
});
const defaultProps = {
  children: "children",
  label: props.label
};
const filterText = ref<string>("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);
const loading = ref(false);
onBeforeMount(async () => {
  if (props.data?.length) return (treeData.value = props.data);
  const { data } = await props.requestApi!();
  const newData = treeDataEdit(data);
  if (props.multiple) return (treeData.value = newData);
  treeData.value = [{ id: "", [props.label]: "全部" }, ...newData];
});
function treeDataEdit(data: any[]): any[] {
  return data.map((item: any) => {
    return {
      ...item,
      children: item.children ? item.children : treeDataEdit(item.childMenu)
    };
  });
}
watch(filterText, val => {
  treeRef.value!.filter(val);
});
// 按钮点击事件
const defaultClick = async () => {
  if (props.submitBtn && props.submit) {
    loading.value = true;
    await props.submit();
    loading.value = false;
    console.log("点击按钮");
  } else {
    console.log("默认点击事件");
  }
};
// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

interface FilterEmits {
  (e: "change", value: any): void;
}
const emit = defineEmits<FilterEmits>();

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  if (props.multiple) return;
  emit("change", data[props.id]);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys());
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
