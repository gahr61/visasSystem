import {create} from 'zustand';
import { IModalResetPassword } from '../utils/interfaces/function';

interface AppContext {
    resetPassword: IModalResetPassword | null,
    setResetPassword: (element: IModalResetPassword) => void
}

export const appContext = create<AppContext>()((set)=>({
    resetPassword: null,
    setResetPassword: (element: IModalResetPassword | null) => set(() => ({resetPassword: element}))
}));