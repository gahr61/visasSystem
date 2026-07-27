import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";

export const relationshipTypesList = ():Promise<IResponse<{id:number, name:string}[]>> => {
    return fetchRequest({url:'relationship_types/list'});
}
