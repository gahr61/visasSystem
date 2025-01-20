import { fetchRequest } from "../../functions";
import { IResponse } from "../../interfaces/function";
import { Procedure } from "../../interfaces/procedure";

export const visasSalesList = ():Promise<IResponse<Procedure[]>> => {
    return fetchRequest({url:'sales/visa/list'});
}

export const visaSalesStore = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'sales/visa', method:'POST', body:obj});
}