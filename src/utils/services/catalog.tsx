import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Catalog, CatalogList, PriceHistory } from "../interfaces/system";

export const catalog = ():Promise<IResponse<CatalogList[]>> => {
    return fetchRequest({url:'catalog/list'});
}

export const catalogId = (id: number):Promise<IResponse<Catalog>>=>{
    return fetchRequest({url:`catalog/${id}/edit`});
}

export const catalogHistory = (id: number):Promise<IResponse<PriceHistory[]>>=>{
    return fetchRequest({url:`catalog/${id}/history`});
}

export const catalogStore = (obj: Catalog): Promise<IResponse<undefined>> => {
    return fetchRequest({url:'catalog', method:'POST', body: obj});
}

export const catalogUpdate = (id: number, obj:Catalog): Promise<IResponse<undefined>> => {
    return fetchRequest({url:`catalog/${id}/update`, method:'PUT', body:obj});
}