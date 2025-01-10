export interface ILogin{
    email: string,
    password: string
}

export type ILoginResponse =  {
    access_token: string,
    user: ILoginUser,
    expires_at: string
}

type ILoginUser = {
    id: number,
    name: string,
    change_password_required: boolean
}

export interface PasswordReset {
    users_id: string | null;
    password: string;
    password_confirmation: string;
}