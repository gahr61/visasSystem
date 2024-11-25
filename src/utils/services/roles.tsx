import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Roles } from "../interfaces/system";

export const roles = ():Promise<IResponse<Roles[] | []>> => {
    return fetchRequest({url:'roles'});
}

export const rolesDelete = (id: number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:`roles/${id}`, method:'DELETE'});
}

export const rolesId = (id:string | number):Promise<IResponse<Roles>>=>{
    return fetchRequest({url:`roles/${id}`});
}

export const rolesStore = (obj:Roles):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'roles', method:'POST', body:obj});
}

export const rolesUpdate = (id: string | number, obj:Roles):Promise<IResponse<undefined>> => {
    return fetchRequest({url:`roles/${id}`, method:'PUT', body:obj});
}