import { fetchRequest } from "../functions";
import { IResponse } from "../interfaces/function";
import { BranchOffice } from "../interfaces/system";

export const branchOfficeDelete = (id: number):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'branchOffice/'+id+'/delete', method:'DELETE'});
}

export const branchOfficeId = (id:number):Promise<IResponse<BranchOffice>> => {
    return fetchRequest({url:'branchOffice/'+id+'/edit'});
}

export const branchOfficeList = ():Promise<IResponse<BranchOffice[]>> => {
    return fetchRequest({url:'branchOffice/list'});
}

export const branchOfficeStore = (obj: BranchOffice):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'branchOffice', method:'POST', body:obj});
}

export const branchOfficeUpdate = (id: number, obj: BranchOffice):Promise<IResponse<undefined>> => {
    return fetchRequest({url:'branchOffice/'+id+'/update', method:'PUT', body:obj});
}