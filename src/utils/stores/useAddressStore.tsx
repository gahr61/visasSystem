import { create } from "zustand";
import { ISelectOptions } from "../../components/common/Select";
import { decript, encript } from "../functions";

interface AddressState {
    countries: ISelectOptions[],
    setCountries: (list: ISelectOptions[]) => void
}

const countries:string = decript('countries');

export const useAddressStore = create<AddressState>((set) => ({
    countries: countries !== '' ? JSON.parse(countries) : [],
    setCountries: (list: ISelectOptions[]) => {
        set({countries: list});

        encript('countries', JSON.stringify(list));
    }
}));