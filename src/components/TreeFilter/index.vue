<template>
  <div class="card filter">
    <div class="header" v-if="title || submitBtn">
      <h4 class="title sle">{{ title ? title : "" }}</h4>
      <el-button type="primary" style="margin-bottom: 15px" v-if="submitBtn" @click="defaultClick" :loading="loading">{{
        submitBtn
      }}</el-button>
    </div>
    <el-input v-if="props.searchVisibel" v-model="filterText" placeholder="输入关键字进行过滤" clearable />
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
        :data="treeList"
        :show-checkbox="multiple"
        :check-strictly="checkStrictly"
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
import { ref, watch, onBeforeMount, nextTick, computed } from "vue";
import { ElTree } from "element-plus";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  /**
   * @name requestApi
   * @description 请求分类数据的 api ==> 非必传, 如果有data，则不会执行 api 请求
   * @type {(data?: any) => Promise<any>}
   */
  requestApi?: (data?: any) => Promise<any>;

  /**
   * @name data
   * @description 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
   * @type {{ [key: string]: any }[]}
   */
  data?: { [key: string]: any }[];

  /**
   * @name title
   * @description treeFilter 标题 ==> 非必传
   * @type {string}
   */
  title?: string;

  /**
   * @name id
   * @description 选择的id ==> 非必传，默认为 “id”
   * @type {string}
   */
  id?: string;

  /**
   * @name label
   * @description 显示的label ==> 非必传，默认为 “label”
   * @type {string}
   */
  label?: string;

  /**
   * @name multiple
   * @description 是否为多选 ==> 非必传，默认为 false
   * @type {boolean}
   * @default false
   */
  multiple?: boolean;

  /**
   * @name defaultValue
   * @description 默认选中的值 ==> 非必传
   * @type {any}
   */
  defaultValue?: any;

  /**
   * @name submitBtn
   * @description 按钮显示-文字 ==> 非必传
   * @type {string}
   */
  submitBtn?: string;

  /**
   * @name lazy
   * @description 子节点懒加载 ==> 非必传
   * @type {boolean}
   * @default false
   */
  lazy?: boolean;

  /**
   * @name submit
   * @description 按钮点击事件处理函数 ==> 非必传， 需传submitBtn生效
   * @type {(data?: any) => Promise<any>}
   */
  submit?: (data?: any) => Promise<any>;

  /**
   * @name load
   * @description 子节点懒加载事件 ==> 非必传，需lazy生效
   * @type {(node: any, resolve: any) => void}
   */
  load?: (node: any, resolve: any) => void;

  /**
   * @name searchVisibel
   * @description 显示搜索框 ==> 非必传，默认为true
   * @type {boolean}
   * @default true
   */
  searchVisibel?: boolean;

  /**
   * @name checkStrictly
   * @description 父子级强关联 ==> 非必传，默认为false
   * @type {boolean}
   * @default false
   */
  checkStrictly?: boolean;

  /**
   * @name checkStrictly
   * @description 递归树形字段 ==> 非必传，默认为children
   * @type {string}
   * @default children
   */
  treeChildren?: string;
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false,
  lazy: false,
  searchVisibel: true,
  checkStrictly: false,
  treeChildren: "children"
});
const defaultProps = {
  children: props.treeChildren,
  label: props.label
};
const filterText = ref<string>("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);
const treeList = computed(() => props.data || treeData.value);
const loading = ref(false);
onBeforeMount(async () => {
  if (props.data) return (treeData.value = props.data);
  const { data } = await props.requestApi!();
  const newData = treeDataEdit(data);

  treeData.value = newData;
  nextTick(() => {
    treeRef.value?.setCurrentKey(newData[0].id);
  });
});
function treeDataEdit(data: any[]): any[] {
  return data.map((item: any) => {
    if (item[defaultProps.children]) {
      return {
        ...item,
        [defaultProps.children]: item[defaultProps.children]
      };
    } else {
      return {
        ...item
      };
    }
  });
}
watch(filterText, val => {
  treeRef.value!.filter(val);
});
// 按钮点击事件
const defaultClick = async () => {
  try {
    if (props.submitBtn && props.submit) {
      loading.value = true;
      await props.submit();
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
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
  emit("change", [...treeRef.value!.getHalfCheckedKeys(), ...treeRef.value!.getCheckedKeys()]);
};
// 设置选中节点
const handleSetCheckedKeys = (keys: any[] = []) => {
  treeRef.value?.setCheckedKeys(keys);
};

// 清空选择
const clearChecked = () => {
  treeRef.value?.setCheckedKeys([]);
};
defineExpose({
  clearChecked,
  handleSetCheckedKeys
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
