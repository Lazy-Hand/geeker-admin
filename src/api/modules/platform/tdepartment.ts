import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 商户-部门列表
export const reqGetTDepartmentList = (params: any) => http.get(PORT1 + "/tenant-dept/pagePT", params);

export const reqGetTenantList = () => http.get(PORT1 + "/tenant/list");
