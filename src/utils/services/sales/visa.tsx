import { fetchRequest } from "../../functions";
import { IResponse, IPaginatedResponse } from "../../interfaces/function";
import { Procedure, VisaAccount } from "../../interfaces/procedure";
import { SaleEditData, SaleEditPayload, SalesInfo } from "../../interfaces/sales";

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

/** datos de una venta (visa o pasaporte) en el formato del formulario de alta */
export const salesEditData = (id: number): Promise<IResponse<SaleEditData>> => {
    return fetchRequest({ url: 'sales/' + id + '/edit' });
}

/** guarda la edición de una venta con el formulario de alta */
export const salesEditUpdate = (procedure: 'Visa' | 'Pasaporte', id: number, obj: SaleEditPayload): Promise<IResponse<undefined>> => {
    const url = procedure === 'Visa' ? 'sales/visa/' + id + '/update' : 'sales/passport/' + id + '/update';
    return fetchRequest({ url, method: 'PUT', body: obj });
}

export const visasSalesDelete = (id: number): Promise<IResponse<undefined>> => {
    return fetchRequest({ url: 'sales/visa/' + id + '/delete', method: 'DELETE' });
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