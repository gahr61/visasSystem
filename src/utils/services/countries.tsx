import { ISelectOptions } from "../../components/common/Select";

import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";


export const getCountries = ():Promise<IResponse<ISelectOptions[]>> => {
    return fetchRequest({url:'countries/list'});
}

export const getStates = (country_id: number):Promise<IResponse<ISelectOptions[]>> => {
    return fetchRequest({url:'countries/states/'+country_id});

}