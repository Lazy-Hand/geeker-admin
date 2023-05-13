export interface DictSubItem {
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
  remark?: any;
}
