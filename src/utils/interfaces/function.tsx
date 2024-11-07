import React from "react";

export type IFetchRequestParams = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Otros métodos HTTP que podrías necesitar
    body?: any; // Puede ser un objeto JSON o un archivo (para sendFile)
    requireToken?: boolean;
    sendFile?: boolean;
    printFile?: boolean;
};

export type IFetchResponse = {
    error?: string | undefined;
    file?: Blob;
    [key: string]: any;
};

export type IResponse<T> = {
    success: boolean,
    message: string,
    data?: T
}

export type ILoader = {
    handleShow: (text: string)=>void,
    handleClose: ()=>void
}

export interface IUser {
    id: string | number,
    name: string
}

export interface IApp {
    loader: React.RefObject<ILoader>
}