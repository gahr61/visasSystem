import { useEffect, useState } from "react";
import { Col, Divider, Grid, Message, Row, Tabs } from "rsuite"

import { FaTrashAlt } from "react-icons/fa";

import SelectForm from "../../common/Select"
import Button from "../../common/Button";
import Toast from "../../common/Toast";
import OptionButtons from "./OptionButtons";
import ClientForm from "./ClientForm";
import PassportForm from "./PassportForm";
import VisaForm from "./VisaForm";

import { Client, Passport, Visas } from "../../../utils/interfaces/procedure";
import { swalConfirm } from "../../../utils/functions";

interface Props {
    procedureType: string,
    setProcedureType: (value:string)=>void,
    formData: Visas[],
    setFormData: (list:Visas[])=>void,
    errorPhone: string,
    setErrorPhone: (value: string) => void,
    errors: string[],
    setErrors: (value: string[]) => void
}

const ProcedureForm = ({
    procedureType,
    setProcedureType,
    formData,
    setFormData,
    errorPhone,
    setErrorPhone,
    errors,
    setErrors
}:Props)=>{
    const options = [
        {value:'Familiar', label:'Familiar'},
        {value:'Personal', label:'Personal'},
        {value:'Grupo', label:'Grupo'}
    ];

    const client:Visas = {
        title:'Solicitante',
        options:{
            type:{
                tourist:{
                    title:'Turista',
                    value:false
                },
                work:{
                    title:'Trabajo',
                    value:false
                },
            },
            option:{
                firstTime:{
                    title:'Primera vez',
                    value:false
                },
                renewal:{
                    title:'Renovación',
                    value:false
                },
            },
            renew:{
                expired:{
                    title:'Vencida o por vencer',
                    value: false
                },
                lost:{
                    title:'Extraviado',
                    value:false
                },
                expiredYears:{
                    title:'Vencida +4 años',
                    value:false
                }
            }
        },
        client:{
            names:'',
            lastname1:'',
            lastname2:'',
            curp:'',
            birthdate:'',
            country:42,
            state:-1,
            city:'',
            phone:''
        },
        passport:{
            passport_number:'',
            passport_expedition_date:'',
            passport_expiration_date:'',
            expirations:{
                time: '',
                complete:'',
                discount:''
            }
        },
        visa:{
            visa_number:'',
            visa_expedition_date:'',
            visa_expiration_date:'',
            visa_expedition_place:''
        }
    }

    const [activeKey, setActiveKey] = useState('client_0');

    const onSelectOptions = (item: string, option: string, selected: number)=>{
        const list = formData.map((client:any, index:number)=>{
            if(index === selected){
                Object.keys(client).forEach((key:string)=>{
                    if(key === 'options'){
                        Object.keys(client[key][item]).forEach((element:string)=>{                               
                            client = {
                                ...client,
                                [key]:{
                                    ...client[key],
                                    [item]:{
                                        ...client[key][item],
                                        [element]:{
                                            ...client[key][item][element],
                                            value: element === option ? !client[key][item][element].value : false
                                        }
                                    }
                                }
                            }
                        
                        })
                    }
                });

                if(client.options.option.firstTime.value === true){
                    
                    client = {
                        ...client,
                        options:{
                            ...client.options,
                            renew:{
                                expired:{...client.options.renew.expired, value:false},
                                lost:{...client.options.renew.lost, value:false},
                                expiredYears:{...client.options.renew.expiredYears, value:false}
                            }
                        },
                        visa:{
                            ...client.visa,
                            visa_number:'',
                            visa_expedition_date: '',
                            visa_expiration_date: '',
                            visa_expedition_place:''
                        }
                    }
                    
                }
            }

            return client;
        });


        setFormData(list);

        setErrors([]);
    }

    const handleChange = (key:string, element:any,  index: number) => {
        let data = formData.map((form: any, i: number)=>{
            if(i === index){
                form = {
                    ...form,
                    [key]: element
                }
            }

            return form;
        })

        setFormData(data);

        setErrors([]);
    }

    const onAddClient = async ()=>{
        if(formData.length < 10){
            await setFormData([...formData, client]);

            await setActiveKey('client_'+formData.length);

            return;
        }

        Toast.fire('Error', 'Ha alcanzado el número máximo de solicitantes', 'error');
        
    }

    const onDeleteClient = (index: number)=>{
        swalConfirm({
            title:'Alerta',
            text:'Realmente desea eliminar el solicitante?',
            confirmText:'Si, eliminar',
            confirmFunction:()=>{
                let elements:Visas[] = [];

                formData.forEach((data, i)=>{
                    if(i !== index){
                        elements.push(data);
                    }
                });

                setActiveKey('client_0');
                setFormData(elements);
            }
        })
    }

    const validateProcedureSelection = (value: string)=>{
        if(value === 'Personal'){
            if(formData.length > 1){
                swalConfirm({
                    title:'Alerta',
                    text:'Agrego mas de un solicitante, si selecciona esta opción se eliminaran los solicitantes, desea continuar?',
                    confirmText: 'Si, Continuar',
                    confirmFunction: ()=>{
                        let data = formData[0];

                        setFormData([data]);
                    }
                });
            }else{
                setProcedureType(value);
            }

            
        }else{
            setProcedureType(value);

            if(value === ''){
                setFormData([client]);
            }
        }

        setActiveKey('client_0');
    }

    useEffect(()=>{
        if(formData.length === 0){
            setFormData([client]);
        }        
    },[]);

    return(
        <Grid fluid className="flex flex-col gap-2">
            <Row className="flex items-end procedure-form" >
                <Col xs={4}>
                    <label>Tipo de trámite</label>
                    <SelectForm
                        id="type"
                        value={procedureType}
                        options={options}
                        handleChange={(e:any)=>validateProcedureSelection(e)}
                        required
                    />
                </Col>
                {(procedureType !== 'Personal' && procedureType !== '') && (
                    <Col xs={4}>
                        <Button size={"sm"} appearance="ghost" onClick={onAddClient}>Agregar solicitante</Button>
                    </Col>
                )}
                
            </Row>

            {procedureType !== '' && (
                <>
                    <Divider className="my-2" />

                    <Row>
                        <Col xs={24}>
                            {errors.length > 0 && (
                                <Message type="error" className="mb-2">
                                    <ul className="m-0">
                                        {errors.map((error, index)=>
                                            <li key={index}>
                                                <label>{error}</label>
                                            </li>
                                        )}
                                    </ul>
                                    
                                </Message>
                            )}
                        </Col>
                        <Col xs={24}>
                            <Tabs activeKey={activeKey} onSelect={(eventKey:any)=>setActiveKey(eventKey)}>
                                {formData.map((item:any, index: number)=>                                
                                    <Tabs.Tab 
                                        title={
                                            <div className="flex items-center">
                                                <div className="inline-block p-1">
                                                    <span>{item.title+' '+(index+1)}</span>
                                                </div>
                                                {index > 0 && (
                                                    <div className="ml-3">
                                                        <FaTrashAlt className="cursor-pointer" onClick={()=>onDeleteClient(index)} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                        } 
                                        eventKey={'client_'+index}
                                        key={index}
                                    >
                                        <Grid fluid className={"procedure-form-"+index}>
                                            <Row>
                                                <Col xs={24} lg={10}  className="p-2 flex flex-col gap-4">
                                                    <OptionButtons 
                                                        client={item}
                                                        onSelectOptions={(item:string, option: string)=>onSelectOptions(item, option, index)}
                                                    />
                                                </Col>
                                                <Col xs={24} lg={14}>
                                                    <ClientForm 
                                                        client={item.client}  
                                                        changeData={(client:Client) => handleChange('client', client, index)}
                                                        index={index}
                                                        errorPhone={errorPhone}
                                                        setErrorPhone={setErrorPhone} 
                                                    />
                                                </Col>
                                            </Row>
                                            
                                            <Divider />
                                            <Row>
                                                <Col xs={24} lg={item.options.option.renewal.value ? 12 : 14} lgOffset={item.options.option.renewal.value ? 0 : 10}>
                                                    <PassportForm 
                                                        passport={item.passport}
                                                        changeData={(passport:Passport) => handleChange('passport', passport, index)}
                                                        index={index}
                                                    />
                                                </Col>
                                                {item.options.option.renewal.value && (
                                                    <Col xs={24} lg={12}>
                                                        <VisaForm 
                                                            visa={item.visa}
                                                            changeData={(visa:Passport) => handleChange('visa', visa, index)}
                                                            index={index}
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                            
                                        </Grid>
                                    </Tabs.Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                    
                </>
            )}
            
        </Grid>
    )
}

export default ProcedureForm;