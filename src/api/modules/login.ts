import { PresentMenu } from "@/api/interface/menu";
import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { UserInfo } from "@/stores/interface";

/**
 * @name 登录模块
 */

// 获取验证码
export const getCodeImg = () => http.get<Login.Captcha>(PORT1 + "/login/captcha", {}, { noLoading: true });

// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<UserInfo>(PORT1 + `/login/passwd`, params, { noLoading: true });
};

// 获取菜单列表
export const getAuthMenuListApi = (params?: any) => {
  return http.get<PresentMenu.Datum[]>(PORT1 + `/menu`, params, { noLoading: true });
};

// 获取按钮权限
export const getAuthButtonListApi = (id: number) => {
  return http.get<Login.AuthRequest>(PORT1 + `/auth/${id}`, {}, { noLoading: true });
};

// 用户户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/login/logout`);
};
