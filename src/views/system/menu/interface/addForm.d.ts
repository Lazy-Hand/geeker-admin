export interface AddForm {
  id?: number;
  path: string;
  name: string;
  component: string;
  icon: string;
  title: string;
  link: string;
  full: boolean;
  hidden: boolean;
  affix: boolean;
  isLink: boolean;
  cache: boolean;
  menuSort: number;
  menuType: string;
}
