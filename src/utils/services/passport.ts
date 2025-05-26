import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Passport } from "../interfaces/passport";

export const passportUpdate = (id:number, obj:Passport):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'passport/'+id+'/update', method:'PUT', body:obj});
}