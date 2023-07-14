<template>
  <div class="table-box">
    <ProTable ref="proTableRef" :request-api="getNoteList" :columns="columns" title="短信模板">
      <template #expand="scope">
        <div style="padding: 12px">
          <p><span style="font-weight: 600">模板内容：</span>{{ scope.row.content }}</p>
        </div>
      </template>
      <template #tableHeader>
        <el-button class="btn" type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增模板</el-button>
      </template>
      <template #operation="{ row }">
        <el-button :icon="EditPen" type="primary" link @click="saveNote('手动发送短信', row)">手动发送</el-button>
        <el-button :icon="EditPen" type="primary" link @click="openDialog('编辑', row)">编辑</el-button>
        <el-button :icon="Delete" type="danger" link @click="deleteNote(row)">删除</el-button>
      </template>
    </ProTable>
    <AddNote ref="addNoteRef" />
    <SaveNote ref="saveNoteRef" />
  </div>
</template>

<script setup lang="ts" name="Note">
import { Note } from "@/api/interface/note";
import { addNote, delNote, editorNote, getNoteList, saveNote as saveNoteApi } from "@/api/modules/system/note";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { noteType } from "@/utils/serviceDict";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ref } from "vue";
import AddNote from "./components/AddNote.vue";
import SaveNote from "./components/SaveNote.vue";
import { useHandleData } from "@/hooks/useHandleData";
const proTableRef = ref<ProTableInstance>();
const addNoteRef = ref<InstanceType<typeof AddNote>>();
const saveNoteRef = ref<InstanceType<typeof SaveNote>>();
const columns: ColumnProps<Note.NoteList>[] = [
  { type: "expand", label: "", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "模板名称", width: 160, search: { el: "input", props: { placeholder: "模板名称" } } },
  { prop: "type", enum: noteType, width: 120, label: "短信用途", search: { el: "select-v2" } },
  { prop: "content", label: "短信内容" },
  { prop: "gmtCreate", label: "创建时间", width: 180, format: "YYYY-MM-DD HH:mm:ss" },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
];

const openDialog = (title: string, rowData: Partial<Note.NoteAddParams> = {}) => {
  let params = {
    title,
    rowData: rowData,
    isView: title === "查看",
    api: title === "新增" ? addNote : title === "编辑" ? editorNote : null,
    getTableList: proTableRef.value?.getTableList
  };
  addNoteRef.value?.acceptParams(params);
};

const saveNote = (title: string, rowData: Partial<Note.NoteAddParams> = {}) => {
  let params = {
    title,
    rowData: { name: rowData.name, templateId: rowData.id, content: rowData.content } as Note.SaveNote,
    api: saveNoteApi,
    isView: false,
    getTableList: proTableRef.value?.getTableList
  };
  saveNoteRef.value?.acceptParams(params);
};

// 删除
const deleteNote = async (row: Note.NoteList) => {
  await useHandleData(delNote, row.id, `删除【${row.name}】模板`);
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
