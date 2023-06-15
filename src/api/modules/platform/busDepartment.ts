import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

export const reqGetBusDepartmentList = (params: any) => http.get(PORT1 + "/tenant-dept/pagePT", params);
