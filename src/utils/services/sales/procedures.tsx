import { fetchRequest } from "../../functions";
import { IResponse } from "../../interfaces/function";

export const visasInfoDetails = (id: string | undefined): Promise<IResponse<any>> => {
    return fetchRequest({url:'procedures/visas/'+id+'/details'});
}