
import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Commissions } from "../interfaces/system";

export const commissionsList = ():Promise<IResponse<Commissions[]>>=>{
    return fetchRequest({url:'commissions/list'})
}

export const commissionsUserUpdate = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'commissions/users/update', method:'PUT', body:obj});
}