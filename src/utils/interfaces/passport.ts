export interface Passport {
    number:string;
    expedition_date:string;
    expiration_date:string;
    expedition_countries_id:number | null;
    expedition_states_id:number | null;
    expedition_city:string;
};