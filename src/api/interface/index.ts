// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  page: ReqPage;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
  total?: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    id?: number;
    tenantId?: number;
    businessId?: any;
    businessType?: any;
    fileName?: string;
    fileType?: string;
    url?: string;
    content?: any;
    fileSize?: number;
    storageType?: string;
    sequenceNo?: any;
    md5?: any;
    deleted?: boolean;
    createBy?: number;
    updateBy?: number;
    gmtCreate?: string;
    gmtModified?: string;
    httpUrl?: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    loginName: string;
    passwd: string;
    captcha: string;
    captchaKey: string;
    rememberMe: boolean;
  }
  export interface AuthRequest {
    auths: string[];
    roles: string[];
  }
  export interface Captcha {
    base64: string;
    keyCode: string;
  }
}
