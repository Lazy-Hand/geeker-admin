import { PresentMenu } from "@/api/interface/menu";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { Role } from "@/api/interface/role";

/**
 * @description 查询角色列表
 */
export const getRoleList = (params: any) => {
  return http.get<Role.RoleList>(PORT1 + "/role/pageT", params);
};

/**
 * @description 新增角色
 * @param params AddRole
 */
export const reqAddRole = (params: Role.RoleAddParams) => http.post(PORT1 + "/role", params, { noLoading: true });

/**
 * @description 修改角色信息
 * @param params AddRole
 */
export const reqPutRole = (params: Role.RoleAddParams) => http.put(PORT1 + `/role/${params.id}`, params, { noLoading: true });

/**
 * @description id删除角色
 * @param id 删除角色id
 */
export const reqDelRole = (params: { id: number }) => http.delete(PORT1 + `/role/${params.id}`);
/**
 * @description 批量删除角色
 * @param ids 删除数据id集合
 */
export const reqBatchDelRoles = (ids: string[]) => http.delete(PORT1 + `/role/batch/${ids.join(",")}`);
/**
 * @description 查询角色下菜单列表
 */
export const getRoleMenuList = (id: number) => {
  return http.get<PresentMenu.Datum[]>(PORT1 + `/role/menu/${id}`, {}, { noLoading: true });
};

/**
 * @description 给角色添加菜单权限
 * @param params 菜单Id集合
 * @param id 角色id
 */
export const addRoleMenu = (params: number[], id: number) => http.post(PORT1 + `/role/menu/${id}`, params, { noLoading: true });
