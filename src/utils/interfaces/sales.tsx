type ScheduleClient = {
    appointment_date: string,
    office: string,
    schedule: 'CAS' | 'Consulado',
    status: string,
    observations: string | null,
    city: string | null
};

export type SalesClientsInfo = {
    clients_id: number,
    process_id: number,
    names: string,
    lastname1: string,
    lastname2: string | null,
    curp: string,
    type: string,
    subtype: string,
    age_type: string,
    option_type: string | null,
    visa_type: string | null,
    complete: boolean,
    email: string | null,
    password: string | null | undefined,
    schedule: ScheduleClient[],
    ds_160: string | null
}
/** ── Edición de venta con el formulario de alta (visa y pasaporte) ── */

export type SaleEditClient = {
    process_id: number,
    subtype: string,
    age_type: string,
    option_type: string | null,
    visa_type: string | null,
    client: {
        id: number,
        names: string,
        lastname1: string,
        lastname2: string | null,
        curp: string,
        birthdate: string | null,
        country: number | null,
        state: number | null,
        city: string | null,
        phone: string | null
    },
    passport: {
        number: string,
        expedition_date: string | null,
        expiration_date: string | null,
        country_expedition: number | null,
        state_expedition: number | null,
        city_expedition: string | null
    } | null,
    visa: {
        number: string,
        expedition_date: string | null,
        expiration_date: string | null,
        expedition_city: string | null
    } | null
}

export type SaleEditData = {
    id: number,
    folio: string,
    type: string,
    total: number,
    paid: number,
    concept_id: number | null,
    contact: string | null,
    procedure: 'Visa' | 'Pasaporte',
    billing: {
        names: string,
        lastname1: string,
        lastname2: string | null,
        email: string | null,
        phone: string
    } | null,
    clients: SaleEditClient[]
}

/** estado del paso de pago de la edición */
export type EditPaymentData = {
    contact: string,
    billing: { names: string, lastname1: string, lastname2: string, email: string, phone: string },
    concept: string,
    price: number,
    total: string,
    amount: string,
    method_payment: string,
    receipt: string,
    reference: string
}

export type SaleEditApplicant = {
    process_id?: number,
    client: Record<string, any>,
    process: Record<string, any>,
    passport?: Record<string, any> | null,
    visa?: Record<string, any> | null
}

export type SaleEditPayload = {
    type?: string,
    contact?: string,
    billing?: EditPaymentData['billing'],
    clients: SaleEditApplicant[],
    new_clients: SaleEditApplicant[],
    pricing?: { sales_concepts_id: string, total: number },
    payment?: { method_payment: string, amount: number, receipt: string, reference: string | null }
}

export type SalesInfo = {
    id: number,
    branch_office: string,
    folio: string,
    date: string,
    total: string,
    advance_payment: string,
    payable: string,
    email: string,
    names: string,
    lastname1: string,
    lastname2: string | null,
    phone: string,
    clients: SalesClientsInfo[],
    type: string,
    payments: string;
}