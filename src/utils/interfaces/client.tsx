export interface Client {
    names: string;
    lastname1:string;
    lastname2:string;
    birthdate:string;
    sex:string;
    curp:string;
    civil_status:string;
    country_birth_id:number | null;
    state_birth_id:number | null;
    city_birth:string;
    nationality:string;
}

export interface Address {
    street: string;
    int_number: number | null;
    ext_number: number;
    postal_code: string;
    colony: string;
    city: string;
    contries_id: number;
    states_id: number;
}