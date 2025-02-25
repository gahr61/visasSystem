import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";

export const salesClientsConfirm = (obj:any):Promise<IResponse<any>> => {
    return fetchRequest({url:'sales/clients/confirm', method:'POST', body:obj, sendFile:true, requireToken:false});
}