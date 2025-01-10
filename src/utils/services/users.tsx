import { ISelectOptions } from "../../components/common/Select";
import { fetchRequest } from "../functions"
import { PasswordReset } from "../interfaces/auth";
import { Employee, EmployeeList } from "../interfaces/employee"
import { IResponse } from "../interfaces/function"

export const usersDelete = (id: number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'users/'+id+'/delete', method:'DELETE'});
}

export const usersId = (id: string):Promise<IResponse<Employee>> => {
    return fetchRequest({url:'users/'+id+'/edit'});
}

export const usersList = ():Promise<IResponse<EmployeeList[]>>=>{
    return fetchRequest({ url:'users/list' });
}

export const usersSales = ():Promise<IResponse<ISelectOptions[]>> => {
    return fetchRequest({url:'users/sales'});
}

export const usersReset = (obj: PasswordReset): Promise<IResponse<undefined>> => {
    return fetchRequest({url:'users/reset', method:'POST', body:obj});
}

export const usersStore = (obj: Employee):Promise<IResponse<undefined>>=>{
    return fetchRequest({url:'users', method:'POST', body:obj});
}

export const usersUpdate = (id: string, obj:Employee):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'users/'+id+'/update', method:'PUT', body:obj});
}