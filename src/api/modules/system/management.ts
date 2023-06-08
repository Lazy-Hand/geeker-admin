import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";
import type { AddForm } from "@/views/system/menu/interface/addForm";
import { DictSubItem } from "../../interface/dict";
//*****************************菜单*************************/

/**
 * @description 添加菜单
 * @param params AddForm
 */
export const reqAddMenu = (params: AddForm) => http.post(PORT1 + "/menu", params);

/**
 * @description 修改菜单
 * @param params AddForm
 * @param id 菜单id
 */
export const reqPutMenu = (params: AddForm) => http.put(PORT1 + `/menu/${params.id}`, params);

/**
 * @description 删除菜单
 * @param params AddForm
 * @param id 菜单id
 */
export const reqDelMenu = (params: { id: number }) => http.delete(PORT1 + `/menu/${params.id}`);

/**
 * @description 批量删除
 * @param ids 菜单集合
 */
export const reqBatchDelMenu = (ids: string[]) => http.delete(PORT1 + `/menu/batch/${ids.join(",")}`);
//*****************************字典******************************/

/**
 * @description 字典列表父项
 */
export const reqGetDict = (params: any) => http.get(PORT1 + "/dict", params);

/**
 * @description 新增字典
 * @param params paramName 字典名称
 */
export const reqAddDict = (params: { paramName: string }) => http.post(PORT1 + "/dict", params);

/**
 * @description 修改字典
 * @param params 修改数据
 */
export const reqPutDict = (params: any) => http.put(PORT1 + `/dict/${params.id}`, params);

/**
 * @description 删除字典
 * @param ids 删除字典集合
 */
export const reqDelDict = (ids: string[]) => http.delete(PORT1 + `/dict/batch/${ids.join(",")}`);

/**
 * @description 字典子项
 * @param parentCode 字典code
 */
export const reqGetDictDetail = (parentCode: any) => http.get<DictSubItem[]>(PORT1 + `/dictChild/parentCode/${parentCode.id}`);

/**
 * @description 新增字典子项
 * @param params
 */
export const reqAddDictChild = (params: any) => http.post(PORT1 + "/dictChild", params);

/**
 * @description 删除字典子项
 * @param params
 */
export const reqDelDictChild = (params: { id: number }) => http.delete(PORT1 + `/dictChild/batch/${params.id}`);
