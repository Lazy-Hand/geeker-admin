import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 商户-岗位列表
export const reqBusPostList = (params: any) => http.get(PORT1 + "/tenant-job/pagePT", params);
