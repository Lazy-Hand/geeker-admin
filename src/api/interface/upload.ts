export namespace Uploads {
  export interface FolderResult {
    id: number;
    name: string;
    remark: string;
    tenantId: number;
    type?: number;
    createBy?: string;
    deleted?: boolean;
    gmtCreate?: string;
    gmtModified?: string;
    [key: string]: any;
  }
  export interface AccessoryResult {
    id: number;
    httpUrl: string;
    [key: string]: any;
  }
}
