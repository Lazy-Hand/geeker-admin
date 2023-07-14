import http from "@/api";
import { Note } from "@/api/interface/note";

// 获取短信模板列表
export const getNoteList = (params: Note.NoteParams) => http.get("/sms-template/page", params);

// 新增短信模板
export const addNote = (params: Note.NoteAddParams) => http.post("/sms-template", params, { noLoading: true });

// 编辑短信模板
export const editorNote = (params: Note.NoteAddParams) => http.put(`/sms-template/${params.id}`, params);

// 删除短信模板
export const delNote = (id: number) => http.delete(`/sms-template/${id}`);

// 手动发送短信
export const saveNote = (params: Note.SaveNote) => http.post("/sms-record/send", params);

// 短信日志
export const getNoteLogList = (params: any) => http.get("/sms-record/page", params);
