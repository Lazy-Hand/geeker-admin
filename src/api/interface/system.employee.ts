export namespace Employee {
  export interface EmployeeData {
    id: number;
    name: string;
    account: string;
    realName: string;
    phone: string;
    email: string;
    status: number;
    lastTime: string;
    gmtCreate: string;
    tenantId: number;
    tenantName: string;
    dept: EmDept[];
    role: EmRole[];
    job: EmJob[];
  }
  export interface EmDept {
    id: number;
    userId: number;
    userName: string;
    deptId: number;
    deptName: string;
  }
  export interface EmRole {
    id: number;
    userId: number;
    userName: string;
    roleId: number;
    roleName: string;
  }
  export interface EmJob {
    id: number;
    userId: number;
    userName: string;
    jobId: number;
    jobName: string;
  }
  export interface EmAddParam {
    id?: number;
    account: string;
    phone: string;
    name: string;
    realName: string;
    email: string;
    sex: number;
    status: number;
    dept: any;
    job: any;
    role: any;
  }
}
