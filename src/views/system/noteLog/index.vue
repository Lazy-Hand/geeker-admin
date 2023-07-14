<template>
  <div class="table-box">
    <ProTable ref="proTableRef" title="系统日志" :request-api="getNoteLogList" :columns="columns">
      <template #expand="scope">
        <div style="padding: 12px">
          <p><span style="font-weight: 600">入参：</span>{{ scope.row.param }}</p>
          <p><span style="font-weight: 600">出参：</span>{{ scope.row.result }}</p>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="NoteLog">
import ProTable from "@/components/ProTable/index.vue";
import { getNoteLogList } from "@/api/modules/system/note";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ref } from "vue";
import { Note } from "@/api/interface/note";
import { noteType } from "@/utils/serviceDict";
const proTableRef = ref<ProTableInstance>();
const columns: ColumnProps<Note.NoteLogList>[] = [
  { type: "expand", label: "", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "status", label: "状态", width: 100 },
  { prop: "phone", label: "手机号", width: 130 },
  {
    prop: "templateType",
    label: "短信类型",
    width: 120,
    search: {
      render: scope => {
        return (
          <el-select vModel={scope.searchParam.templateType}>
            {[{ label: "验证码通知", value: 0 }, ...noteType].map(item => (
              <el-option label={item.label} value={item.value}></el-option>
            ))}
          </el-select>
        );
      }
    }
  },
  { prop: "templateName", label: "模板名称", width: 220 },
  { prop: "content", label: "短信内容", width: 320 },
  { prop: "response", label: "响应" },
  { prop: "gmtCreate", label: "操作时间", format: "YYYY-MM-DD HH:mm:ss", width: 180 }
];
</script>
