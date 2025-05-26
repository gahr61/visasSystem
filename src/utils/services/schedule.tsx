import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";

export const scheduleDetailsUpdate = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'schedule/details', method:'PUT', body:obj});
}