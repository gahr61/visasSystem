import { Col, Divider, Grid, Row } from "rsuite";
import SelectForm, { ISelectOptions } from "../../common/Select";
import Input from "../../common/Input";
import TableDetailsPayment from "./TableDetailsPayment";
import React, { useEffect, useState } from "react";
import { branchOfficeList } from "../../../utils/services/branchOficce";
import { usersSales } from "../../../utils/services/users";

interface Props {
    dataPayment: any,
    setDataPayment: (data: any) => void,
    formData: any[],
    errorEmail: string
    setErrorEmail: (value: string) => void,
    errorPhone: string,
    setErrorPhone: (value: string) => void
}
const PaymentForm = ({
    dataPayment,
    setDataPayment,
    formData,
    errorEmail,
    setErrorEmail,
    errorPhone,
    setErrorPhone
}: Props)=>{
    const contacts:ISelectOptions[] = [
        {value:'Correo electrónico', label:'Correo electrónico'},
        {value:'Redes sociales', label:'Redes sociales'},
        {value:'Teléfono', label:'Teléfono'},
        {value:'Volante', label:'Volante'},
        {value:'Visita presencial', label:'Visita presencial'},
        {value:'Otro', label:'Otro'}
    ];

    const [branchOffices, setBranchOffices] = useState<ISelectOptions[]>([]);
    const [employees, setEmployees] = useState<ISelectOptions[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [optionSelected, setOptionSelected] = useState('');

    const onLoad = async ()=>{
        const responseBranch = await branchOfficeList();

        if(responseBranch && responseBranch.success){
            const list = responseBranch.data.map((data)=>{
                const item = {
                    value: data.id,
                    label: data.name
                };

                return item;
            });

            setBranchOffices(list);
        }

        const responseUsers = await usersSales();

        if(responseUsers && responseUsers.success){
            setEmployees(responseUsers.data);
        }

       let optionData = formData.map((data, index)=>{
            let item = {
                value:index + 1,
                label: data.client.names+' '+data.client.lastname1+' '+data.client.lastname2
            };

            return item;
       });

       setOptions(optionData);
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>, key: string, item?: string) => {
        const {name, value} = e.currentTarget;

        let data = dataPayment;

        if(item){
            data = {
                ...data,
                [key]:{
                    ...data[key],
                    [item]:{
                        ...data[key][item],
                        [name]: value
                    }
                }
            };
        }else{
            data = {
                ...data,
                [key]:{
                    ...dataPayment[key],
                    [name]: value
                }
            }
        }       

        if(name === 'phone'){
            setErrorPhone(value.length < 12 ? 'Teléfono no valido' : '');
        }
        
        setDataPayment(data);
    }

    const handleSelect = (name: string, value: string, key: string) => {
        let data = {
            ...dataPayment,
            [key]:{
                ...dataPayment[key],
                [name]: value
            }
        }
        
        if(name === 'contact'){
            if(value !== 'Volante'){
                data = {
                    ...data,
                    [key]:{
                        ...data[key],
                        flyer_id: ''
                    }
                }
            }
        }else if(name === 'method_payment'){
            if(value !== 'tarjeta'){
                data = {
                    ...data,
                    [key]:{
                        ...data[key],
                        reference: ''
                    }
                }
            }
        }

        setDataPayment(data);
    }

    const onSelectOption = (value: string)=>{
        let data = dataPayment;
        
        setOptionSelected(value);
        

        if(value !== ''){
            const findOption = formData[parseInt(value) - 1];

            if(findOption){
                data = {
                    ...data,
                    payment:{     
                        ...data.payment,                   
                        client:{
                            names:findOption.client.names,
                            lastname1:findOption.client.lastname1,
                            lastname2:findOption.client.lastname2,
                            email:'',
                            phone: findOption.client.phone
                        }
                    },
                };
                
            }
        }else{
            data = {
                ...data,
                payment:{
                    ...data.payment,                        
                    client:{
                        names:'',
                        lastname1:'',
                        lastname2:'',
                        email:'',
                        phone: '',
                    }
                },
            };
        }

        setDataPayment(data)
    }

    useEffect(()=>{
        onLoad();
    },[])

    return(
        <Grid fluid>
            <Row className="payment-form">
                <Col xs={24}>
                    <fieldset>
                        <legend className="text-lg">Datos de venta</legend>
                        <Row>
                            <Col xs={24} lg={6}>
                                <label>Sucursal</label>
                                <SelectForm 
                                    id="branch_office_id"
                                    options={branchOffices}
                                    value={dataPayment.payment.branch_office_id}
                                    handleChange={(value: string)=>handleSelect('branch_office_id', value, 'payment')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>Vendedor(a)</label>
                                <SelectForm 
                                    id="seller_id"
                                    options={employees}
                                    value={dataPayment.payment.seller_id}
                                    handleChange={(value: string)=>handleSelect('seller_id', value, 'payment')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>Medio de contacto</label>
                                <SelectForm 
                                    id="contact"
                                    options={contacts}
                                    value={dataPayment.payment.contact}
                                    handleChange={(value:string)=>handleSelect('contact', value, 'payment')}
                                    required
                                />
                            </Col>
                            {dataPayment.payment.contact === 'Volante' && (
                                <Col xs={24} lg={6}>
                                    <label>Volanteo</label>
                                    <SelectForm 
                                        id="flyer_id"
                                        options={employees}
                                        value={dataPayment.payment.flyer_id}
                                        handleChange={(value:string)=>handleSelect('flyer_id', value, 'payment')}
                                        required
                                    />
                                </Col>
                            )}
                            
                        </Row>
                    </fieldset>
                    <Divider />
                    <fieldset>
                        <legend className="text-lg">Datos de quien realiza el trámite</legend>
                        {formData.length > 1 && (
                            <Row>
                                <Col xs={24} lg={8}>
                                    <label>Solicitantes <span className="text-[10px] text-red-500">Seleccione al solicitante que esta realizando el trámite</span></label>
                                    <SelectForm 
                                        id="solicitante"
                                        value={optionSelected}
                                        options={options}
                                        handleChange={(value:string)=>onSelectOption(value)}
                                    />
                                </Col>
                            </Row>
                        )}
                        
                        <Divider />
                        <Row>
                            <Col xs={24} lg={4}>
                                <label>Nombre(s)</label>
                                <Input 
                                    id="names"
                                    value={dataPayment.payment.client.names}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment', 'client')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Apellido paterno</label>
                                <Input 
                                    id="lastname1"
                                    value={dataPayment.payment.client.lastname1}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment', 'client')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Apellido materno</label>
                                <Input 
                                    id="lastname2"
                                    value={dataPayment.payment.client.lastname2}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment', 'client')}
                                    
                                />
                            </Col>
                            <Col xs={24} lg={8}>
                                <label>Correo electrónico</label>
                                <span className="span-required text-red-600">                                    
                                    {<span className="text-xs text-red-400 ms-2">{errorEmail}</span>}
                                </span>
                                <Input 
                                    id="email"
                                    type="email"
                                    value={dataPayment.payment.client.email}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment', 'client')}
                                    setErrorEmail={setErrorEmail}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Teléfono</label>
                                <span className="span-required text-red-600">                                    
                                    {<span className="text-xs text-red-400 ms-2">{errorPhone}</span>}
                                </span>
                                <Input 
                                    id="phone"
                                    type="tel"
                                    value={dataPayment.payment.client.phone}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment', 'client')}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} lg={4}>
                                <label>Método de pago</label>
                                <SelectForm
                                    id="method_payment"
                                    options={[
                                        {value:'Efectivo', label:'Efectivo'},
                                        {value:'Tarjeta', label:'Tarjeta'}
                                    ]}
                                    value={dataPayment.payment.method_payment}
                                    handleChange={(value:string)=>handleSelect('method_payment', value, 'payment')}
                                    required
                                />
                            </Col>
                            {dataPayment.payment.method_payment === 'Tarjeta' && (
                                <Col xs={24} lg={4}>
                                    <label>No. Referencia</label>
                                    <Input 
                                        id="reference"
                                        type="number"
                                        value={dataPayment.payment.reference}
                                        onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment')}
                                        required
                                    />
                                </Col>
                            )}
                            
                            <Col xs={24} lg={4}>
                                <label>No. Recibo</label>
                                <Input 
                                    id="receipt"
                                    type="number"
                                    value={dataPayment.payment.receipt}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'payment')}
                                    required
                                />
                            </Col>
                        </Row>
                    </fieldset>
                    <Divider />

                    <Row>
                        <Col xs={24}>                                    
                            <TableDetailsPayment dataPayment={dataPayment} setDataPayment={setDataPayment} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Grid>
    )
}

export default PaymentForm;