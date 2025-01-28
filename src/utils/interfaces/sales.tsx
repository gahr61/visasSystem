type ScheduleClient = {
    appointment_date: string,
    office: string,
    schedule: 'CAS' | 'Consulado',
    status: string,
    observations: string | null
};

export type SalesClientsInfo = {
    clients_id: number,
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
    schedule: ScheduleClient[]
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
    clients: SalesClientsInfo[]
}