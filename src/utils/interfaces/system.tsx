import { ReactElement } from "react";

export interface Column {
    key: string;
    title: string;
    grow: number,
    render: (row: any)=>ReactElement | string
}

export interface Commissions {
    id?:string,
    concept: string;
}

export interface Modal {
    handleShow: (id: number | undefined, name?: string)=>void
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


