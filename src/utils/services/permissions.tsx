import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Permissions } from "../interfaces/system";

type PermissionRole = {
    role_id: number;
    permission_name:string;
}

type PermissionAvailable = {
    availables: Permissions[],
    assigned: Permissions[]
}

export const permissions = ():Promise<IResponse<Permissions[]>>=>{
    return fetchRequest({url:'permissions'});
}

export const permissionsAssigned = (id:number):Promise<IResponse<PermissionAvailable>> =>{
    return fetchRequest({url:`permissions/assigned/${id}`});
}

export const permissionsToAssign = (obj:PermissionRole):Promise<IResponse<undefined>> =>{
    return fetchRequest({url:`permissions/assign`, method:'PUT', body:obj});
}

export const permissionsToDesign = (obj:PermissionRole):Promise<IResponse<undefined>> =>{
    return fetchRequest({url:`permissions/design`, method:'PUT', body:obj});
}