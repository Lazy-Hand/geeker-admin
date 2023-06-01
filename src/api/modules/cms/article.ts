import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";
import { ColumnsList } from "@/api/interface/cms";
import { ResPage } from "@/api/interface";
/**
 * @name getColumnList
 * @description 栏目列表
 */
export const getColumnList = () => http.get<ResPage<ColumnsList>>(PORT1 + "/column/page");
/**
 * @name getArticleList
 * @description 根据栏目id查询文章
 */
export const getArticleList = (params: any) => http.get(PORT1 + `/article/page`, params);

/**
 * @name delArticle
 * @description 根据栏目id删除文章
 */
export const delArticle = (params: { id: number }) => http.delete(PORT1 + `/article/${params.id}`);
/**
 * @name delArticles
 * @description 根据栏目id批量删除文章
 */
export const delArticles = (params: { ids: number[] }) => http.delete(PORT1 + `/article/batch/${params.ids}`);

/**
 * @name addArticle
 * @description 添加文章
 */
export const addArticle = (params: any) => http.post(PORT1 + `/article`, params);

/**
 * @name addArticle
 * @description 修改文章
 */
export const updateArticle = (params: any) => http.put(PORT1 + `/article/${params.id}`, params);
