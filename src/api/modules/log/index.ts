import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

export const reqGetLogList = (params: any) => http.get<any[]>(PORT1 + "/log/page", params);
