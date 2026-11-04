import { create } from "zustand";
import { decript, encript } from "../functions";


interface PermissionsStore {
    permissions: string[],
    setPermissions: (list: string[]) => void,
    hasPermission: (value: string) => boolean
}

const permissions:string = decript('permissions');

export const usePermissionsStore = create<PermissionsStore>((set, get) => ({
    permissions: permissions !== '' ? JSON.parse(permissions) : [],
    setPermissions: (list: string[]) => {
        set({permissions: list});

        encript('permissions', JSON.stringify(list));
    },
    // read from the current state (not the value captured at module load),
    // so permissions set at login apply without reloading the page
    hasPermission:(value: string) => get().permissions.includes(value)
}));