import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 系统管理-部门列表
export const reqGetDepartList = (params: any) => http.get(PORT1 + "/tenant-dept/page", params);

// 系统管理-部门新增
export const reqAddDepart = (params: any) => http.post(PORT1 + "/tenant-dept", params);

// 系统管理-部门修改
export const reqEditDepart = (params: any) => http.post(PORT1 + "/tenant-dept", params);

// 系统管理-部门删除
export const reqDelDepart = (id: number) => http.delete(PORT1 + `/tenant-dept/${id}`);
