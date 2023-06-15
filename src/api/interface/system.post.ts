export namespace Post {
  export interface PostData {
    id: number;
    deptsId?: any;
    name: string;
    tenantId: number;
    description: string;
    status: boolean;
    sort: number;
    deleted: boolean;
    createBy: string;
    gmtCreate: string;
    gmtModified: string;
  }
}
