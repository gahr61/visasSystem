import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Concept, ConceptsList, PriceHistory } from "../interfaces/system";

export const concepts = ():Promise<IResponse<ConceptsList[]>> => {
    return fetchRequest({url:'concepts/list'});
}

export const conceptsId = (id: number):Promise<IResponse<Concept>>=>{
    return fetchRequest({url:`concepts/${id}/edit`});
}

export const conceptsHistory = (id: number):Promise<IResponse<PriceHistory[]>>=>{
    return fetchRequest({url:`concepts/${id}/history`});
}

export const conceptsStore = (obj: Concept): Promise<IResponse<undefined>> => {
    return fetchRequest({url:'concepts', method:'POST', body: obj});
}

export const conceptsUpdate = (id: number, obj:Concept): Promise<IResponse<undefined>> => {
    return fetchRequest({url:`concepts/${id}/update`, method:'PUT', body:obj});
}

export const conceptsVisaPrices = ():Promise<IResponse<any[]>>=>{
    return fetchRequest({url:`concepts/visa`});
}