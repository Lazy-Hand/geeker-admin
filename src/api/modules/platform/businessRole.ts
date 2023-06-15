import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 商户角色列表
export const reqGetBusinessRoleList = (params: any) => http.get(PORT1 + "/role/page", params);

// 商户角色-获取权限树
export const reqGetTendPermissionTree = (id: number) =>
  http.get<any>(PORT1 + `/role/getAllMenuByTenantId/${id}`, {}, { noLoading: true });
