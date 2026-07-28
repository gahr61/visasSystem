export interface IProcedureStatus {
    status: string;
    count: number;
}

export interface IEmployeeRanking {
    id: number;
    name: string;
    sales_count: number;
}

export interface IBranchSales {
    name: string;
    count: number;
    amount: number;
}

export interface ISalesType {
    type: string;
    count: number;
    amount: number;
}

export interface IProcedureType {
    type: string;
    count: number;
}

export interface IEmployeeByRole {
    role: string;
    count: number;
}

export interface IDashboardData {
    my_sales: { count: number; amount: number };
    my_procedures: { active: number; by_status: IProcedureStatus[]; by_type: IProcedureType[] };
    my_upcoming_appointments: number;
    my_commissions: { count: number; amount: number };

    // Solo Ventas
    my_rank?: { position: number | null; total: number };

    // Solo Volanteo
    my_flyer_sales?: { count: number; amount: number };
    my_flyer_commissions?: { count: number; amount: number };
    my_flyer_clients?: number;

    // Solo Administrador de sistema
    roles_count?: number;
    permissions_count?: number;
    employees_by_role?: IEmployeeByRole[];
    pending_email_verifications?: number;

    // Solo admin / gerencia
    total_sales?: { count: number; amount: number };
    pending_payment?: number;
    all_procedures_by_status?: IProcedureStatus[];
    total_active_procedures?: number;
    total_clients?: number;
    new_clients?: number;
    total_commissions?: number;
    total_commissions_count?: number;
    employees_ranking?: IEmployeeRanking[];
    active_employees?: number;
    web_contacts?: number;
    pending_tokens?: number;
    all_upcoming_appointments?: number;
    sales_by_branch?: IBranchSales[];
    sales_by_type?: ISalesType[];

    // Desglose visa vs pasaporte (admin)
    visa_sales?: { count: number; amount: number };
    passport_sales?: { count: number; amount: number };
    visa_procedures_by_status?: IProcedureStatus[];
    passport_procedures_by_status?: IProcedureStatus[];
    visa_active_procedures?: number;
    passport_active_procedures?: number;
}

export interface IDashboardParams {
    start_date?: string;
    end_date?: string;
}
