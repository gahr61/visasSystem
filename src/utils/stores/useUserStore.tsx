import { create } from "zustand";
import { decript, encript } from "../functions";

interface User{
    id:number;
    name:string;
    change_password_required:string | boolean;
    role:string;
}

interface UserState {
    user: User,
    setUser: (value: User) => void
}

const user:string = decript('user');

export const useUserStore = create<UserState>((set) => ({
    user: user !== '' ? JSON.parse(user) : [],
    setUser: (value: User) => {
        set({user: value});

        encript('user', JSON.stringify(value));
    }
}));