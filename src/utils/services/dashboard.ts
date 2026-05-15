import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { IDashboardData, IDashboardParams } from "../interfaces/dashboard";

export const getDashboardIndicators = (params?: IDashboardParams) => {
    const query = params
        ? Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== '')
            .map(([k, v]) => `${k}=${v}`)
            .join('&')
        : '';

    return fetchRequest<IResponse<IDashboardData>>({
        url: `dashboard/indicators${query ? `?${query}` : ''}`,
        method: 'GET',
    });
};
