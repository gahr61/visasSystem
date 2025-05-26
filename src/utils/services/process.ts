import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";

export const processDs160Update = (obj:any):Promise<IResponse<undefined>>=>{
    return fetchRequest({url:'process/ds_160/update', method:'PUT', body:obj});
}

export const processAccountUpdate = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'process/account/update', method:'PUT', body:obj});
}