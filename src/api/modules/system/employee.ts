import http from "@/api";
import { PORT2 } from "@/api/config/servicePort";
import EmployeeList from "@/assets/json/employeeList.json";
export const reqGetEmpList = (params: any) => {
  return Promise.resolve(EmployeeList);
  return http.get(PORT2 + "/api/dept/employee", params);
};
