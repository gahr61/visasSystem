import { fetchRequest } from "../functions";
import { ILogin, ILoginResponse } from "../interfaces/auth";
import { IResponse } from "../interfaces/function";

export const login = (obj: ILogin):Promise<IResponse<ILoginResponse>>=>{
    return fetchRequest({url:'auth/login', method:'POST', body: obj, requireToken: false});
}

export const logout = ():Promise<IResponse<undefined>>=>{
    return fetchRequest({url:'auth/logout'});
}