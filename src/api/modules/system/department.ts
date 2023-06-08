import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

export const reqGetDepartList = (params: any) => http.get(PORT1 + "/tenant-depts/page", params);
