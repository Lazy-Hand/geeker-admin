<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="系统日志" :request-api="reqGetLogList" :columns="columns">
      <template #expand="scope">
        <div style="padding: 12px">
          <p><span style="font-weight: 600">入参：</span>{{ scope.row.param }}</p>
          <p><span style="font-weight: 600">出参：</span>{{ scope.row.result }}</p>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="cropper">
import ProTable from "@/components/ProTable/index.vue";
import { reqGetLogList } from "@/api/modules/log";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ref } from "vue";
import { Employee } from "@/api/interface/system.employee";
const proTableRef = ref<ProTableInstance>();
const columns: ColumnProps<Employee.EmployeeData>[] = [
  { type: "expand", label: "", width: 100 },
  { type: "index", label: "#", width: 80 },
  { prop: "method", label: "方法名" },
  { prop: "uri", label: "接口名" },
  { prop: "ip", label: "ip" },
  { prop: "userName", label: "操作人" },
  { prop: "gmtCreate", label: "操作时间" }
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
