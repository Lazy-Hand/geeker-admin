// ? 系统全局字典

interface ServiceEnum {
  label: string;
  value: boolean | number;
}

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];
export const isNo = [
  { label: "是", value: true },
  { label: "否", value: false }
];
export const dictStatus = [
  { label: "开启", value: true },
  { label: "关闭", value: false }
];
export const articleStatus = [
  { label: "草稿", value: 0 },
  { label: "发布", value: 1 },
  { label: "未发布", value: 2 }
];

export const articleType = [
  { label: "原创", value: 0 },
  { label: "转载", value: 1 }
];

export const menuType = [
  { label: "目录", value: "M" },
  { label: "菜单", value: "C" },
  { label: "按钮", value: "A" }
];
export const roleStatus = [
  { label: "启用", value: true },
  { label: "禁用", value: false }
];

export const twoStatus = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const twoStatus1 = [
  { label: "启用", value: 0 },
  { label: "禁用", value: 1 }
];

export const noteType: ServiceEnum[] = [
  { label: "会员营销", value: 1 },
  { label: "订单通知", value: 2 }
];
