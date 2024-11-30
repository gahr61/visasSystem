
import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Commissions } from "../interfaces/system";

export const commissionsDelete = (id: number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'commissions/'+id+'/delete', method:'DELETE'});
}

export const commissionsId = (id: number):Promise<IResponse<Commissions>> => {
    return fetchRequest({url:'commissions/'+id+'/edit'});
}

export const commissionsList = ():Promise<IResponse<Commissions[]>>=>{
    return fetchRequest({url:'commissions/list'})
}

export const commissionsStore = (obj: Commissions):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'commissions', method:'POST', body:obj});
}

export const commissionsUpdate = (obj: Commissions):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'commissions/update', method:'PUT', body:obj});
}

export const commissionsUserUpdate = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'commissions/users/update', method:'PUT', body:obj});
}

export const commissionsVerifyUser = (id: number):Promise<IResponse<boolean>> => {
    return fetchRequest({url:'commissions/'+id+'/verify/users'});
}