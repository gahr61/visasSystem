import { create } from "zustand";
import { decript, encript } from "../functions";


interface PermissionsStore {
    permissions: string[],
    setPermissions: (list: string[]) => void,
    hasPermission: (value: string) => boolean
}

const permissions:string = decript('permissions');

export const usePermissionsStore = create<PermissionsStore>((set) => ({
    permissions: permissions !== '' ? JSON.parse(permissions) : [],
    setPermissions: (list: string[]) => {
        set({permissions: list});

        encript('permissions', JSON.stringify(list));
    },
    hasPermission:(value: string) =>{
        const permissionsList = permissions !== '' ? JSON.parse(permissions) : [];

        const permission = permissionsList.find((obj:string) => obj === value);

        if(permission){
            return true;
        }

        return false;
    }
}));