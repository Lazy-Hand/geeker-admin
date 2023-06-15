export namespace PresentMenu {
  // menu列表数据
  export interface Datum {
    id: number;
    parentId: number;
    tenantId: number;
    name: string;
    title: string;
    component?: any;
    path: string;
    permission?: any;
    menuType: string;
    icon: string;
    menuSort: number;
    link: string;
    full: boolean;
    affix: boolean;
    cache: boolean;
    hidden: boolean;
    createBy: number;
    updateBy: number;
    gmtCreate: string;
    gmtModified: string;
    childMenu: Datum[];
  }
  // menu新增params
  export interface MenuAddParams {
    id?: number;
    path?: string;
    name?: string;
    component?: string;
    icon?: string;
    title?: string;
    link?: string | null;
    full?: boolean;
    hidden?: boolean;
    affix?: boolean;
    isLink?: boolean;
    cache?: boolean;
    menuSort?: number;
    menuType?: string;
    parentId?: number;
    permission?: string;
  }
}
