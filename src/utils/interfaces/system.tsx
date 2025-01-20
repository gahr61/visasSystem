import { ReactElement } from "react";

export interface BranchOffice {
    id: number,
    name: string,
    location: string
}

export type BranchOfficeForm = Omit<BranchOffice, 'id'>;

export interface Column {
    key: string;
    title: string;
    grow: number,
    colSpan?: number,
    render: (row: any)=>ReactElement | string
}

export type PriceHistory = {
    price: number,
    date: string
}

export type ConceptsList = Concept & {
    id: number
}

export interface Concept {
    name: string;
    price: number;
}

export interface Commissions {
    id:number,
    concept: string;
}

export interface Modal {
    handleShow: (id:string | number | undefined, name?: string, row?:any)=>void
}

export interface Permissions {
    id?: number;
    name: string;
    display_name: string;
    description: string;
}

export interface Roles {
    id?: number;
    name: string;
    display_name: string;
    description: string;
}


