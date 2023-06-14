import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 系统管理-岗位列表
export const reqGetPostList = (params: any) => http.get(PORT1 + "/tenant-job/page", params);

// 系统管理-岗位新增
export const reqAddPost = (params: any) => http.post(PORT1 + "/tenant-job", params);

// 系统管理-岗位修改
export const reqEditPost = (params: any) => http.post(PORT1 + "/tenant-job", params);

// 系统管理-岗位删除
export const reqDelPost = (id: number) => http.delete(PORT1 + `/tenant-job/${id}`);
