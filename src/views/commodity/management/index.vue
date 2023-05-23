<template>
  <div class="table-box">
    <div class="card mb10 pt0 pb0">
      <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" />
    </div>
    <ProTable ref="proTableRef" title="商品列表" :columns="columns">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus">添加商品</el-button>
        <el-button type="success" :icon="Delete">商品采集</el-button>
        <el-button :icon="Download">导出</el-button>
      </template>
      <!-- Expand -->
      <template #expand> 123 </template>
      <!-- 表格操作 -->
      <template #operation>
        <el-button :icon="View" type="primary" link>详情</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx">
import SelectFilter from "@/components/SelectFilter/index.vue";
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { CirclePlus, Delete, Download, View } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

const proTableRef = ref<ProTableInstance>();

const columns: ColumnProps[] = [
  { type: "expand", label: "", width: 100 },
  { type: "index", label: "ID", width: 80 },
  {
    prop: "",
    label: "商品图",
    render: () => {
      return <img src="https://img.yzcdn.cn/vant/ipad.jpeg" alt="" style="width: 50px; height: 50px;" />;
    }
  },
  {
    prop: "username",
    label: "商品名称",
    width: 600
  },
  {
    prop: "username",
    label: "商品售价"
  },
  {
    prop: "username",
    label: "销量"
  },
  {
    prop: "username",
    label: "库存"
  },
  {
    prop: "sort",
    label: "排序"
  },
  {
    prop: "gmtCreate",
    label: "添加时间",
    width: 180,
    format: "YYYY-MM-DD HH:mm:ss"
  },
  {
    prop: "sort",
    label: "状态"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

// selectFilter 数据（用户角色为后台数据）
const selectFilterData = reactive([
  {
    title: "商品状态",
    key: "userStatus",
    options: [
      {
        label: "出售中的商品",
        value: ""
      },
      {
        label: "仓库中的商品",
        value: "1",
        icon: "User"
      },
      {
        label: "已经售罄的商品",
        value: "2",
        icon: "Bell"
      },
      {
        label: "警戒库存",
        value: "3",
        icon: "Clock"
      },
      {
        label: "商品回收站",
        value: "4",
        icon: "CircleClose"
      }
    ]
  }
]);
// 默认 selectFilter 参数
const selectFilterValues = ref({ userStatus: "" });
</script>

<style lang="scss" scoped></style>
