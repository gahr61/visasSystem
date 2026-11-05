import { Client, Passport } from "./procedure";

/** ── New form entry ──────────────────────────────────────────── */

export type PassportEntryOption = {
    title: string;
    value: boolean;
}

export type PassportEntry = {
    title: string;
    options: {
        option: {
            firstTime: PassportEntryOption;
            renewal: PassportEntryOption;
        };
    };
    client: Client;
    passport: Passport;
}

/** ── List ────────────────────────────────────────────────────── */

export type PassportProcedure = {
    id: number;
    folio: string;
    date: string;
    type: string;
    no_applicants: number;
    client: string;
    email: string | null;
    phone: string;
    status: string;
}

export type PassportListParams = {
    page?: number;
    per_page?: number;
    folio?: string;
    date?: string;
    client?: string;
    email?: string;
    status?: string;
    no_applicants?: string;
}

/** ── Detail ──────────────────────────────────────────────────── */

export type PassportScheduleClient = {
    appointment_date: string;
    office: string;
    city: string | null;
    schedule: string;
    status: string;
    observations: string | null;
}

export type PassportSalesClientsInfo = {
    clients_id: number;
    process_id: number;
    names: string;
    lastname1: string;
    lastname2: string | null;
    curp: string;
    ine: string | null;
    birthdate: string | null;
    city_birth: string | null;
    phone: string | null;
    subtype: string;
    age_type: string;
    option_type: string | null;
    observations: string | null;
    complete: boolean;
    process_status: string | null;
    passport_id: number | null;
    passport_number: string | null;
    expedition_date: string | null;
    expiration_date: string | null;
    schedule: PassportScheduleClient[];
}

export type PassportSalesInfo = {
    id: number;
    branch_office: string;
    folio: string;
    date: string;
    total: string;
    type: string;
    payments: string | null;
    advance_payment: string;
    payable: string;
    contact: string;
    email: string | null;
    names: string;
    lastname1: string;
    lastname2: string | null;
    phone: string;
    status: string;
    clients: PassportSalesClientsInfo[];
}

/** ── Store payload ───────────────────────────────────────────── */

export type PassportClientPhone = {
    id?: number;
    type: 'Casa' | 'Trabajo' | 'Celular' | 'Otro';
    number: string;
}

export type PassportClientData = {
    id?: number;
    names: string;
    lastname1: string;
    lastname2: string;
    curp: string;
    birthdate: string;
    city: string;
    country_birth_id: number | null;
    state_birth_id: number | null;
}

export type PassportClientProcess = {
    subtype: 'Primera vez' | 'Renovación';
    age_type: 'Mayor de edad' | 'Menor de edad';
    option_type: string | null;
    observations: string | null;
}

export type PassportClientPassport = {
    number: string;
    expedition_date: string | null;
    expiration_date: string | null;
    expedition_country_id: number | null;
}

export type PassportStoreClient = {
    client: PassportClientData;
    phones: PassportClientPhone[];
    process: PassportClientProcess;
    passport?: PassportClientPassport;
}

export type PassportStorePayload = {
    sales: {
        branch_office_id: number;
        date: string;
        folio: string;
        total: number;
        type: 'Individual' | 'Familiar' | 'Grupo';
    };
    billing: {
        email: string;
        names: string;
        lastname1: string;
        lastname2: string;
        phone: string;
    };
    sale_process: {
        advance_payment: number;
        payable: number;
        contact: string;
    };
    payment: {
        method_payment: string;
        amount: number;
        platform: string;
        receipt: string;
        reference: string | null;
    };
    commissions: {
        type: string;
        users_id: number;
        commission: string;
    }[];
    details: {
        sales_concepts_id: number;
        amount: number;
    }[];
    clients: PassportStoreClient[];
}

/** ── Schedule ────────────────────────────────────────────────── */

export type PassportScheduleItem = {
    clients_id: number;
    office: string;
    city: string;
    appointment_date: string;
    schedule: string;
    status: string;
    observations: string;
}

/** ── Update payload ──────────────────────────────────────────── */

export type PassportUpdateClientItem = {
    process_id: number;
    observations?: string | null;
    complete?: boolean;
    process_status?: string;
    client?: {
        names: string;
        lastname1: string;
        lastname2: string;
        curp: string;
        birthdate: string;
        phone: string;
    };
    process?: {
        subtype: string;
        age_type: string;
        option_type: string | null;
    };
    passport?: {
        number: string;
        expedition_date: string | null;
        expiration_date: string | null;
    };
}

export type PassportUpdatePayload = {
    billing?: {
        email: string;
        names: string;
        lastname1: string;
        lastname2: string;
        phone: string;
    };
    sale_process?: {
        advance_payment: number;
        payable: number;
        contact: string;
    };
    status?: string;
    clients?: PassportUpdateClientItem[];
}
