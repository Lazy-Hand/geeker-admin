import { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { Uploads } from "../interface/upload";
import { ResPage } from "@/api/interface/index";
/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData, id?: number) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/attachment${id ? "?sortId=" + id : ""}`, params);
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params);
};

// 获取服务器文件夹
export const getFolder = () => http.get<Uploads.FolderResult[]>("/attachment-sort/selectAll", {}, { noLoading: true });

// 新增文件夹
export const addFolder = (params: { name: string; remark: string }) => http.post("attachment-sort", params);

// 编辑文件夹
export const editorFolder = (params: { name: string; remark: string }, id: number) => http.put(`/attachment-sort/${id}`, params);

// 删除文件夹
export const delFolder = (id: number) => http.delete(`/attachment-sort/${id}`);

// 根据分类id查询附件
export const getFolderAccessory = (params: { id: number | null; pageSize: number; pageNum: number; total?: number }) =>
  http.get<ResPage<Uploads.AccessoryResult>>("/attachment/selectBySortId", params);

// 批量删除上传文件
export const delUploads = (ids: string) => http.delete(`/attachment/batch/${ids}`);

// 删除单个文件
export const delUpload = (id: number) => http.delete(`/attachment/${id}`);
