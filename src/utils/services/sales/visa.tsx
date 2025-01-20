import { fetchRequest } from "../../functions";
import { IResponse } from "../../interfaces/function";

export const visaSalesStore = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'sales/visa', method:'POST', body:obj});
}