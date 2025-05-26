import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { Occupations } from "../interfaces/system";

export const occupationsList = ():Promise<IResponse<Occupations[]>> => {
    return fetchRequest({url:'occupations/list'});
}

export const occupationsId = (id:number):Promise<IResponse<Occupations>> => {
    return fetchRequest({url:'occupations/'+id+'/edit'});
}

export const occupationsStore = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'occupations', method:'POST', body:obj});
}

export const occupationsUpdate = (id:number, obj:Occupations):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'occupations/'+id+'/update', method:'PUT', body:obj});
}

export const occupationsDelete = (id:number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'occupations/'+id+'/delete', method:'DELETE'});
}