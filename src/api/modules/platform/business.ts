import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 平台管理-商户列表
export const reqGetBusinessList = (params: any) => http.get(PORT1 + "/tenant/page", params);

// 平台管理-商户新增
export const reqAddBusiness = (params: any) => http.post(PORT1 + "/tenant/insert", params);

// 平台管理-商户修改
export const reqEditBusiness = (params: any) => http.post(PORT1 + "/tenant/insert", params);

// 平台管理-商户删除
export const reqDelBusiness = (id: number) => http.delete(PORT1 + `/tenant/${id}`);

// 平台管理-租户权限选择
export const reqSelectBusinessAuthList = () => http.get<any>(PORT1 + `/t-role/selectAll`);
