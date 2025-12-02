import React, { useEffect, useState } from "react";
import { Col, Row, Tooltip, Whisper } from "rsuite";
import { Link } from "react-router-dom";

import Input from "../../common/Input";
import SelectForm, { ISelectOptions } from "../../common/Select";

import { getCountries, getStates } from "../../../utils/services/countries";
import { Client } from "../../../utils/interfaces/procedure";
//@ts-ignore
import Autocomplete from "../../common/Autocomplete";
import { salesClientsAutocomplete, salesClientsData } from "../../../utils/services/clients";
import { Passport } from "../../../utils/interfaces/passport";

interface Props {
    client: Client;
    changeData: (data: any) => void,
    index: number,
    errorPhone: string,
    setErrorPhone: (value: string)=>void,
    handleUpdateAfterSelect?: (element:any, index:number) => void,
    passport: Passport | null
}

const ClientForm = ({
    client,
    changeData,
    index,
    errorPhone,
    setErrorPhone,
    handleUpdateAfterSelect = ()=>{},
    passport = null
}:Props)=>{
    const [countries, setCountries] = useState<ISelectOptions[]>([]);
    const [states, setStates] = useState<ISelectOptions[]>([]);
    //@ts-ignore
    const [clientSeleted, setClientSelected] = useState(0);

    //@ts-ignore
    const [clients, setClients] = useState([]);

    const onLoad = async ()=>{
        let response = await getCountries();

        if(response && response.success){
            setCountries(response.data);
        }

        response = await getStates(42);

        if(response && response.success){
            setStates(response.data);
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

    //@ts-ignore
    const handleSearchClient = async (query: string)=>{
        setClients([]);
        setClientSelected(0);

        const response:any = await salesClientsAutocomplete(query);

        if(response && response.success){
            const items = response.data.map((data:any)=>{
                data = {
                    ...data,
                    label: data.names+' '+data.lastname1+(data.lastame2 !== null ? ' '+data.lastname2 : '' )+' - '+data.curp
                }

                return data;
            });

            setClients(items);
        }
    }

    //@ts-ignore
    const handleSelectClient = async (value:number)=>{
        const response = await salesClientsData(value);

        if(response && response.success){
            setClientSelected(value);
            let element:any = {
                client:{
                    ...client
                }
            };
            element = {
                ...element,
                client:{
                    ...element.client,
                    id: response.data.id,
                    names: response.data.names,
                    lastname1: response.data.lastname1,
                    lastname2: response.data.lastname2,
                    curp: response.data.curp,
                    birthdate: response.data.birthdate,
                    country: response.data.country,
                    state: response.data.state,
                    city: response.data.city,
                    phone: response.data.phone ? response.data.phone.number : '',
                    phone_id: response.data.phone ? response.data.phone.id : '',
                }                
            }


            if(response.data.passport){

                element = {
                    ...element,
                    passport: {
                        ...passport,
                         id: response.data.passport.id,
                        passport_number: response.data.passport.number,
                        passport_expedition_date: response.data.passport.expedition_date,
                        passport_expiration_date: response.data.passport.expiration_date,
                    }
                }
               
                
            }

            handleUpdateAfterSelect(element, index);

            console.log(element, index, 'client')
        }
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return(
        <fieldset>
            <legend className="text-lg">Datos del cliente</legend>
            {/* <Row>
                <Col xs={24}>
                    <label>Buscar solicitante</label>
                    <Autocomplete 
                        id="client_search"
                        options={clients}
                        value={clientSeleted}
                        onSelect={handleSelectClient}
                        onSearch={handleSearchClient}
                        placeholder="Ingresa nombre, apellido paterno, apellido materno o curp"
                    />
                </Col>
            </Row>
            <hr className="my-2" /> */}
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
                    <label>CURP</label> 
                    <Whisper placement="top" trigger="hover" speaker={<Tooltip>Si no conoce su CURP de click para consultar</Tooltip>}>
                        <Link target="_blank" to="https://www.gob.mx/curp/" className="ms-2 text-xs text-blue-600">Consultar</Link>
                    </Whisper>
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