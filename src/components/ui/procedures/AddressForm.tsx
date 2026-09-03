import { useEffect, useId, useState } from "react";
import { Col, Row } from "rsuite";
import Input from "../../common/Input";
import SelectForm, { ISelectOptions } from "../../common/Select";
import { useAddressStore } from "../../../utils/stores/useAddressStore";
import { getStates } from "../../../utils/services/countries";

export type AddressValue = {
    street: string,
    noInt: string,
    noExt: string,
    postCode: string,
    colony: string,
    country: number | string,
    state: string | number,
    city: string
}

const WIDTHS = {
    default: { street: 6, noInt: 3, noExt: 3, postCode: 6, colony: 6, country: 6, state: 6, city: 6 },
    compact: { street: 8, noInt: 4, noExt: 4, postCode: 8, colony: 8, country: 8, state: 8, city: 8 }
}

type Props = {
    address: AddressValue,
    onChange: (address: AddressValue) => void,
    size?: 'default' | 'compact',
    required?: boolean
}

const emptyAddress: AddressValue = {
    street: '', noInt: '', noExt: '', postCode: '', colony: '', country: 42, state: '', city: ''
}

const AddressForm = ({ address, onChange, size = 'default', required = true }: Props) => {
    const countries = useAddressStore(state => state.countries);
    const [states, setStates] = useState<ISelectOptions[]>([]);
    const idPrefix = useId();
    const w = WIDTHS[size];
    const value = address || emptyAddress;

    const onLoadStates = async (country_id: number) => {
        const response = await getStates(country_id);

        if(response && response.success){
            setStates(response.data);
        }
    }

    const handleChange = (name: string, fieldValue: any) => {
        onChange({
            ...value,
            [name]: typeof fieldValue === 'number' ? fieldValue : String(fieldValue).toUpperCase()
        });

        if(name === 'country'){
            onLoadStates(fieldValue);
        }
    }

    useEffect(()=>{
        onLoadStates(Number(value.country) || 42);
    }, []);

    return (
        <Row>
            <Col xs={24} lg={w.street}>
                <label>Calle</label>
                <Input id={idPrefix+'street'} value={value.street} onChange={(e:any)=>handleChange('street', e.currentTarget.value)} required={required} />
            </Col>
            <Col xs={24} lg={w.noInt}>
                <label>No. Int</label>
                <Input id={idPrefix+'noInt'} value={value.noInt} onChange={(e:any)=>handleChange('noInt', e.currentTarget.value)} />
            </Col>
            <Col xs={24} lg={w.noExt}>
                <label>No. Ext.</label>
                <Input id={idPrefix+'noExt'} value={value.noExt} onChange={(e:any)=>handleChange('noExt', e.currentTarget.value)} required={required} />
            </Col>
            <Col xs={24} lg={w.postCode}>
                <label>Código postal</label>
                <Input id={idPrefix+'postCode'} value={value.postCode} onChange={(e:any)=>handleChange('postCode', e.currentTarget.value)} required={required} maxLength={5} />
            </Col>
            <Col xs={24} lg={w.colony}>
                <label>Colonia</label>
                <Input id={idPrefix+'colony'} value={value.colony} onChange={(e:any)=>handleChange('colony', e.currentTarget.value)} required={required} />
            </Col>
            <Col xs={24} lg={w.country}>
                <label>País</label>
                <SelectForm id={idPrefix+'country'} options={countries} value={value.country || 42} handleChange={(v)=>handleChange('country', v)} required={required} />
            </Col>
            <Col xs={24} lg={w.state}>
                <label>Estado</label>
                <SelectForm id={idPrefix+'state'} options={states} value={value.state} handleChange={(v)=>handleChange('state', v)} required={required} />
            </Col>
            <Col xs={24} lg={w.city}>
                <label>Ciudad/Municipio</label>
                <Input id={idPrefix+'city'} value={value.city} onChange={(e:any)=>handleChange('city', e.currentTarget.value)} required={required} />
            </Col>
        </Row>
    )
}

export default AddressForm;
