import { PresentMenu } from "@/api/interface/index";
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 平台管理-商户权限列表
export const reqGetBusinessPermissionList = (params: any) => http.get(PORT1 + "/t-role/page", params);

// 平台管理-商户权限新增
export const reqAddBusinessPermission = (params: any) => http.post(PORT1 + "/t-role", params);

// 平台管理-商户权限修改
export const reqEditBusinessPermission = (params: any) => http.put(PORT1 + "/t-role", params);

// 平台管理-商户权限删除
export const reqDelBusinessPermission = (id: number) => http.delete(PORT1 + `/t-role/${id}`);

// 平台管理-商户权限-获取权限树
export const reqGetPermissionTree = (id: number) => http.get<PresentMenu.Datum[]>(PORT1 + `/t-role/selectCheck/${id}`);

// 平台管理-商户权限-分配权限
export const reqAssignPermission = (params: { id: number; roleIds: number[] }) =>
  http.post(PORT1 + `/t-role/saveMenu/${params.id}`, params.roleIds);
