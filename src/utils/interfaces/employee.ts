import { Commissions } from "./system"

export type EmployeeCommission = Commissions & {
    amount: number
} 

export type Employee = {
    id?: number,
    names: string,
    lastname1: string,
    lastname2?: string,
    email: string,
    role: string,
    role_text: string,
    goal: string,
    salary: string,
    commissions: EmployeeCommission[]
}

export type EmployeeList = Pick<Employee, 'email' | 'role' | 'goal' | 'salary' | 'commissions'> & {
    id: number;
    fullName: string,
    totalCommission: string
}   

