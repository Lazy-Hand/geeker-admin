export namespace Role {
  // 角色列表
  export interface RoleList {
    id: number;
    tenantId: number;
    roleCode: string;
    roleName: string;
    validFlag: boolean;
    deleted: boolean;
    roleDesc: string;
    sequenceNo: number;
    createBy: number;
    updateBy: number;
    gmtCreate: string;
    gmtModified: string;
    tenantName: string;
  }
  // 角色列表查询params
  export interface RoleParams {
    pageNum: number;
    pageSize: number;
    validFlag?: boolean | number;
    roleName?: string;
  }
  // 新增角色params
  export interface RoleAddParams {
    id?: number;
    roleCode: string;
    roleName: string;
    validFlag: number;
    roleDesc: string;
    sequenceNo: number;
  }
}
