export namespace Dict {
  // 字典列表数据
  export interface DictList {
    id: number;
    paramName: string;
    paramCode: string;
    sequence: number;
    display: boolean;
    deleted: boolean;
    createBy: number;
    updateBy: number;
    gmtCreate: string;
    gmtModified: string;
    remark: string;
  }
  // 字典值列表数据
  export interface DictValue {
    id: number;
    paramName: string;
    parentCode: string;
    paramCode: string;
    paramValue: string;
    sequence: number;
    display: boolean;
    deleted: boolean;
    createBy: number;
    updateBy: number;
    gmtCreate: string;
    gmtModified: string;
    remark?: string;
  }
  // 字典新增params
  export interface DictAddParam {
    id?: number;
    paramName: string;
    remark?: string;
  }
  // 字典值新增params
  export interface DictValueAddParam {
    id?: number;
    paramName: string;
    paramValue: string;
    remark?: string;
  }
}
