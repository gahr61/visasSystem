import { fetchRequest } from '../../functions';
import { IResponse, IPaginatedResponse } from '../../interfaces/function';
import {
    PassportProcedure,
    PassportListParams,
    PassportSalesInfo,
    PassportScheduleItem,
    PassportStorePayload,
    PassportUpdatePayload,
} from '../../interfaces/passportSales';

export const passportSalesList = (params?: PassportListParams): Promise<IPaginatedResponse<PassportProcedure[]>> => {
    const qs = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null)
                qs.append(key, String(value));
        });
    }
    const query = qs.toString();
    return fetchRequest({ url: 'sales/passport/list' + (query ? '?' + query : '') });
}

export const passportSalesInfo = (id: number): Promise<IResponse<PassportSalesInfo>> => {
    return fetchRequest({ url: 'sales/passport/' + id + '/details' });
}

export const passportSalesStore = (obj: PassportStorePayload): Promise<IResponse<undefined>> => {
    return fetchRequest({ url: 'sales/passport', method: 'POST', body: obj });
}

export const passportSalesUpdate = (id: number, obj: PassportUpdatePayload): Promise<IResponse<undefined>> => {
    return fetchRequest({ url: 'sales/passport/' + id + '/update', method: 'PUT', body: obj });
}

export const passportSalesDelete = (id: number): Promise<IResponse<undefined>> => {
    return fetchRequest({ url: 'sales/passport/' + id + '/delete', method: 'DELETE' });
}

export const passportScheduleUpdate = (id: number, items: PassportScheduleItem[]): Promise<IResponse<undefined>> => {
    return fetchRequest({ url: 'sales/passport/' + id + '/schedule', method: 'PUT', body: items });
}
