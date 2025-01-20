import React, { useEffect, useState } from "react";
import { Col, Row } from "rsuite";
import { Link } from "react-router-dom";

import Input from "../../common/Input";
import SelectForm, { ISelectOptions } from "../../common/Select";

import { getCountries, getStates } from "../../../utils/services/countries";
import { Client } from "../../../utils/interfaces/procedure";

interface Props {
    client: Client;
    changeData: (data: any) => void,
    index: number,
    errorPhone: string,
    setErrorPhone: (value: string)=>void
}

const ClientForm = ({
    client,
    changeData,
    index,
    errorPhone,
    setErrorPhone
}:Props)=>{
    const [countries, setCountries] = useState<ISelectOptions[]>([]);
    const [states, setStates] = useState<ISelectOptions[]>([]);

    const onLoad = async ()=>{
        let response = await getCountries();

        if(response){
            setCountries(response);
        }

        response = await getStates(42);

        if(response){
            setStates(response);
        }
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;

        client = {
            ...client,
            [name]: value.toUpperCase()
        }

        if(name === 'phone'){
            setErrorPhone(value.length > 0 && value.length < 12 ? 'Teléfono no valido' : '');
        }

        changeData(client)
    }

    const handleChangeSelect = (value: string, name: string) => {
        client = {
            ...client,
            [name]: value
        }

        changeData(client)
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return(
        <fieldset>
            <legend className="text-lg">Datos del cliente</legend>
            <Row>
                <Col xs={24} md={8}>
                    <label>Nombre(s)</label>
                    <Input 
                        id={"names"+index}
                        name={"names"}
                        value={client.names}
                        onChange={handleChange}
                        placeholder="Nombre(s)" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Apellido paterno</label>
                    <Input 
                        id={"lastname1"+index}
                        name={"lastname1"}
                        value={client.lastname1}
                        onChange={handleChange}
                        placeholder="Apellido paterno" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Apellido materno</label>
                    <Input 
                        id={"lastname2"+index}
                        name={"lastname2"}
                        value={client.lastname2}
                        onChange={handleChange}
                        placeholder="Apellido materno" 

                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>CURP</label> <Link to="" className="text-xs text-blue-600">Consultar</Link>
                    <Input 
                        id={"curp"+index}
                        name={"curp"}
                        value={client.curp}
                        onChange={handleChange}
                        placeholder="CURP" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>F. Nacimiento</label>
                    <Input 
                        id={"birthdate"+index}
                        name={"birthdate"}
                        type="date"
                        value={client.birthdate}
                        customClass="py-[3px]"
                        onChange={handleChange}
                        placeholder="Apellido paterno" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Teléfono</label>
                    {errorPhone !== '' && (<span className="text-xs text-red-400 ms-2">{errorPhone}</span>)}
                    <Input 
                        id={"phone"+index}
                        name={"phone"}
                        type="tel"
                        value={client.phone}
                        onChange={handleChange}
                        placeholder="000-000-0000" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>País</label>
                    <SelectForm 
                        id={"country"+index}
                        options={countries}
                        value={client.country}
                        handleChange={(value: string)=>handleChangeSelect(value, 'country')}
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Estado</label>
                    <SelectForm 
                        id={"state"+index}
                        options={states}
                        value={client.state}
                        handleChange={(value: string)=>handleChangeSelect(value, 'state')}
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Ciudad</label>
                    <Input 
                        id={"city"+index}
                        name={"city"}
                        value={client.city}
                        onChange={handleChange}
                        placeholder="Ciudad" 
                        required
                    />
                </Col>
            </Row>
        </fieldset>
    )
}

export default ClientForm;