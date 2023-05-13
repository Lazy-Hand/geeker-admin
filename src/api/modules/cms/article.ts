import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";
import { ColumnsList } from "@/api/interface/cms";
import { ResPage } from "@/api/interface";
/**
 * @description 栏目列表
 */
export const getColumnList = () => http.get<ResPage<ColumnsList>>(PORT1 + "/column/page");
/**
 * @description 根据栏目id查询文章
 * @param params
 * @param {Number} params.id 栏目id
 */
export const getArticleList = (params: any) => http.get(PORT1 + `/article/page`, params);
