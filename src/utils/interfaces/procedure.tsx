interface TypeValues{
    title: string;
    value: boolean;
}

interface Types {
    tourist: TypeValues;
    work: TypeValues;
}

interface Option {
    firstTime: TypeValues;
    renewal: TypeValues;
}

interface Renew {
    expired: TypeValues;
    lost: TypeValues;
    expiredYears: TypeValues;
}

type Options = {
    type: Types,
    option: Option,
    renew: Renew
}

export interface Client{
    names: string;
    lastname1: string;
    lastname2?: string;
    curp: string;
    birthdate: string;
    country: number;
    state: number;
    city: string;
    phone: string;
}

interface PassportExpirations {
    time: string;
    complete: string;
    discount: string;
}

export interface Passport {
    passport_number: string;
    passport_expedition_date: string;
    passport_expiration_date: string;
    expirations: PassportExpirations;
}

export type Procedure = {
    id: number;
    folio: string;
    date: string;
    no_applicants: number;
    client: string;
    email: string;
    phone: string;
    status: string;
}

export type Visa = {
    visa_number: string;
    visa_expedition_date: string;
    visa_expiration_date: string;
    visa_expedition_place: string;
}

export type Visas = {
    title: string;
    options: Options;
    client: Client;
    passport: Passport;
    visa?: Visa
}