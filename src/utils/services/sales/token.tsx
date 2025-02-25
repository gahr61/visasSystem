import { fetchRequest } from "../../functions";
import { IResponse } from "../../interfaces/function";

export const validateToken = (obj: any):Promise<IResponse<any>> => {
    return fetchRequest({url:'sales/validate/token', method:'POST', body:obj})
}