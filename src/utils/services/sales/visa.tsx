import { fetchRequest } from "../../functions";
import { IResponse } from "../../interfaces/function";
import { Procedure } from "../../interfaces/procedure";

export const visasSalesList = ():Promise<IResponse<Procedure[]>> => {
    return fetchRequest({url:'sales/visa/list'});
}

export const visaSalesStore = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'sales/visa', method:'POST', body:obj});
}

export const visaSalesPaymentList = (id: number):Promise<IResponse<any>> => {
    return fetchRequest({url:'sales/visa/payment/list/'+id});
}

export const visaSalesPaymentSend = (obj: any):Promise<IResponse<undefined>> => {
    return fetchRequest({
        url:'sales/visa/payment',
        method:'POST',
        body: obj,
        sendFile: true
    });
}

export const visaSalesPaymentUpdate = (obj:any):Promise<IResponse<undefined>> => {
    return  fetchRequest({url:'sales/visa/payment/confirm', method:'PUT', body:obj});
}