import { Employee } from "./../../interface/system.employee";
import { ResPage } from "./../../interface/index";
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";
// 系统管理-员工管理
export const reqGetEmpList = (params: any) => http.get<ResPage<Employee.EmployeeData[]>>(PORT1 + "/user/page", params);

// 系统管理-员工管理-新增
export const reqAddEmp = (params: Employee.EmAddParam) => http.post(PORT1 + "/user/insert", params);

// 系统管理-员工管理-修改
export const reqEditEmp = (params: Employee.EmAddParam) => http.post(PORT1 + "/user/insert", params);

// 系统管理-员工管理-删除
export const reqDeleteEmp = (id: number) => http.delete(PORT1 + `/user/${id}`);

// 系统管理-员工管理-重置密码
export const reqResetPwd = (id: number) => http.put(PORT1 + `/user/resetPassWord/${id}`);

// 获取岗位下拉列表
export const reqGetPostSelect = () => http.get<any[]>(PORT1 + "/tenant-job/selectAll", {}, { noLoading: true });

// 获取部门下拉列表
export const reqGetDeptSelect = () => http.get<any[]>(PORT1 + "/tenant-dept/selectAll", {}, { noLoading: true });

// 获取角色下拉列表
export const reqGetRoleSelect = () => http.get<any[]>(PORT1 + "/role/selectAll", {}, { noLoading: true });
