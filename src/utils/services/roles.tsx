import { ISelectOptions } from "../../components/common/Select";
import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Roles } from "../interfaces/system";

export const roles = ():Promise<IResponse<Roles[] | []>> => {
    return fetchRequest({url:'roles'});
}

export const rolesDelete = (id: number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:`roles/${id}/delete`, method:'DELETE'});
}

export const rolesId = (id:string | number):Promise<IResponse<Roles>>=>{
    return fetchRequest({url:`roles/${id}/edit`});
}

export const rolesList = ():Promise<IResponse<ISelectOptions[]>> => {
    return fetchRequest({url:'roles/list'});
}

export const rolesStore = (obj:Roles):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'roles', method:'POST', body:obj});
}

export const rolesUpdate = (id: string | number, obj:Roles):Promise<IResponse<undefined>> => {
    return fetchRequest({url:`roles/${id}/update`, method:'PUT', body:obj});
}