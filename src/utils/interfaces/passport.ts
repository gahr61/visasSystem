export interface Passport {
    number:string;
    expedition_date:string;
    expiration_date:string;
    expedition_country_id:number | null;
    expedition_state_id:number | null;
    expedition_city:string;
};