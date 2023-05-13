export namespace Role {
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
  }
}
