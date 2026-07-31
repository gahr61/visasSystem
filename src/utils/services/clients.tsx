import { fetchRequest } from "../functions";
import { Client } from "../interfaces/client";
import { IResponse } from "../interfaces/function";

export const salesClientsConfirm = (obj:any):Promise<IResponse<any>> => {
    return fetchRequest({url:'sales/clients/confirm', method:'POST', body:obj, sendFile:true, requireToken:false});
}

export const salesClientsUpdate = (id:string, obj:Client):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/update/'+id, method:'PUT', body:obj});
}

export const salesClientsUpdateAddress = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/address/update', method:'PUT', body:obj});
}

export const salesClientsUpdatePhones = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/phones/update', method:'PUT', body:obj});
}

export const  salesClientsRelationships = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/parents', method:'POST', body:obj});
}

export const salesClientsOcuppations = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/occupations', method:'POST', body:obj});
}

export const salesClientsStudies = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/studies', method:'POST', body:obj});
}

export const salesClientsTravel = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/travel', method:'POST', body:obj});
}

export const salesClientsSocialNetworks = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/social_networks', method:'POST', body:obj});
}

export const salesClientsAutocomplete = (query:string):Promise<IResponse<undefined>> =>{
    return fetchRequest({
        url:'clients/autocomplete?query='+query
    });
}

export const salesClientsData = (id:number): Promise<IResponse<any>> => {
    return fetchRequest({url:'clients/data/'+id});
}

export const salesClientsLanguages = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'clients/languages', method:'POST', body:obj});
}