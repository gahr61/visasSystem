import { fetchRequest } from "../../functions";
import { IResponse, IPaginatedResponse } from "../../interfaces/function";
import { Procedure, VisaAccount } from "../../interfaces/procedure";
import { SalesInfo } from "../../interfaces/sales";

export type VisaListParams = {
    page?: number;
    per_page?: number;
    folio?: string;
    date?: string;
    client?: string;
    email?: string;
    status?: string;
    no_applicants?: string;
    ds_160?: string;
}

export const visasSalesInfo = (id: number):Promise<IResponse<SalesInfo>> => {
    return fetchRequest({url:'sales/'+id+'/details'});
}

export const visasSalesList = (params?: VisaListParams): Promise<IPaginatedResponse<Procedure[]>> => {
    const qs = new URLSearchParams();
    if(params) {
        Object.entries(params).forEach(([key, value]) => {
            if(value !== undefined && value !== '' && value !== null)
                qs.append(key, String(value));
        });
    }
    const query = qs.toString();
    return fetchRequest({ url: 'sales/visa/list' + (query ? '?' + query : '') });
}

export const visasSalesClientList = ():Promise<IResponse<Procedure[]>> => {
    return fetchRequest({url:'sales/visa/client/list'});
}

export const visaAccountPassword = (id: number):Promise<IResponse<VisaAccount[]>> => {
    return fetchRequest({url:'sales/visa/'+id+'/account/password'});
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
    return  fetchRequest({url:'sales/visa/payment/confirm', method:'POST', body:obj, sendFile:true});
}

export const visaSalesAddPayment = (obj:any):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'sales/visa/pay', method:'POST', body:obj});
}