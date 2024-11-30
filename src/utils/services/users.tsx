import { fetchRequest } from "../functions"
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

export const usersStore = (obj: Employee):Promise<IResponse<undefined>>=>{
    return fetchRequest({url:'users', method:'POST', body:obj});
}

export const usersUpdate = (id: string, obj:Employee):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'users/'+id+'/update', method:'PUT', body:obj});
}