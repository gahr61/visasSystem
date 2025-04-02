import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "rsuite";

import Content from "../../../components/common/Content";
import DetailsForm from "../../../components/ui/procedures/visa/DetailsForm";

import { IApp } from "../../../utils/interfaces/function";
import { visasInfoDetails } from "../../../utils/services/sales/procedures";
import { useIdleTimer } from "react-idle-timer";

const VisaDetails = ({loader}:IApp)=>{
    const {id} = useParams();

    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const [clients, setClients] = useState([]);

    const dataForm:any = {
        personalInformation:{
            names:'', lastname1:'', lastname2:'', birthdate:'', sex:'', curp:'', civilStatus:'',
            birthplace:{
                country:42, state:'', city:'', nationality:''
            },
            passport:{
                number:'', expedition_date:'', expiration_date:'', country_expedition:'', state_expedition:'', city_expedition:''
            }
        },
        contactInformation:{
            address:{
                street:'', noInt:'', noExt:'', postCode:'', colony:'', country:'', state:'', city:''                
            },
            phones:[]
        },
        familiarInformation:{
            relationships:[]
        },
        jobsSchools:{
            ocupation:'', otherOcupation:'', salary:'', antiquity:'', ocupationName:'', ocupationAddress:'',
            schools:[]
        },
        generalInformation:{
            residence:{
                fullName:'', personalPhone:'', workPhone:'', celPhone:''
            },
            history:{ tryProcedureVisa:'', procedureDate:'' },
            visa:{ lastVisa:'',expeditionDate:'', expirationDate:'' },
            details:{
                addressEEUU:'', travelDateEEUU:'', has_visit_eeuu:'', travel_date:'',
                timeEEUU:'', travelReason:'', coverExpenses:'', lastVisit:'', dateLastVisit:'', timeLastVisit:'',
                observations:'',  ds160:''
            },
            account:{
                user:'', password:''
            }
        }
    };

    const [currentKey, setCurrentKey] = useState<string | number | undefined>('0');
    const onLoad = async ()=>{
        loader.current?.handleShow('Cargando...')
        let response = await visasInfoDetails(id);

        if(response && response.success){
            let data = dataForm;
            let clientsList:any = [];

            console.log(data)
            
            response.data.forEach((item:any)=>{
                data = {
                    ...data,
                    personalInformation:{
                        ...data.personalInformation,
                        id: item.id, //client id
                        names: item.names,
                        lastname1: item.lastname1,
                        lastname2: item.lastname2,
                        birthdate: item.birthdate,
                        sex: item.sex || "",
                        curp: item.curp,
                        civilStatus: item.civil_status || '',
                        birthplace:{
                            ...data.personalInformation.birthplace,
                            country: item.country_birth_id,
                            state: item.state_birth_id,
                            city: item.city,
                            nationality: item.nationality || ''
                        },
                        passport:{
                            ...data.personalInformation.passport,
                            id: item.passport.id || '',
                            number: item.passport.number,
                            expedition_date: item.passport.expedition_date,
                            expiration_date: item.passport.expiration_date,
                            country_expedition: item.passport.expedition_country_id || '', 
                            state_expedition: item.passport.expedition_state_id || '', 
                            city_expedition: item.passport.expedition_city || ''
                        }
                    },
                    contactInformation:{
                        ...data.contactInformation,
                        phones: item.phones
                    },
                    familiarInformation:{
                        ...data.familiarInformation,
                        relationships: item.parents
                    },
                    jobsSchools:{
                        ...data.jobsSchool,
                        schools: item.studies
                    }
                }

                if(item.address !== null){
                    data = {
                        ...data,
                        contactInformation:{
                            ...data.contactInformation,
                            id: item.address.id || '',
                            street: item.addres.street || '',
                            noInt: item.addres.int_number || '', 
                            noExt: item.addres.ext_number || '', 
                            postCode: item.addres.postal_code || '', 
                            colony: item.addres.colony || '', 
                            country: item.addres.countries_id || '', 
                            state: item.addres.states_id || '', 
                            city: item.addres.city || ''
                        }
                    }
                }

                if(item.occupation !== null){
                    data = {
                        ...data,
                        id: item.occupation.id,
                        ocupation: item.occupation.occupations_id, 
                        salary: item.occupation.salary, 
                        antiquity: item.occupation.antiquity, 
                        ocupationName: item.occupation.name, 
                        ocupationAddress: item.occupation.address,
                    }
                }

                if(item.residence !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            residence:{
                                id: item.resicende.id,
                                fullName: item.residence.full_name  || '', 
                                personalPhone: item.residence.personal_phone  || '', 
                                workPhone: item.residence.work_phone  || '', 
                                celPhone: item.residence.cel_phone  || ''
                            },
                        }
                    }
                }

                if(item.process_history !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            history:{
                                id: item.process_history.id,
                                tryProcedureVisa: item.process_history.has_tried_visa,
                                procedure_date: item.process_history.date
                            }
                        }
                    }
                }

                if(item.visa_history !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            visa:{
                                id: item.visa_history.id,
                                lastVisa: item.visa_history.number,
                                expeditionDate: item.visa_history.expedition_date, 
                                expirationDate: item.visa_history.expiration_date
                            }
                        }
                    }
                }

                if(item.process_details !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.gemeralInformation,
                            details:{
                                id: item.process_details.id,
                                travel_date: item.process_details.travel_date || '',
                                hasVisitEEUU: item.process_details.has_visit_eeuu || false,
                                addressEEUU: item.process_details.address_eeuu || '', 
                                travelDateEEUU: item.process_details.travel_date_eeuu || '',
                                timeEEUU: item.process_details.time_stay_eeuu || '', 
                                travelReason: item.process_details.travel_reason || '', 
                                coverExpenses: item.process_details.cover_expenses || '', 
                                lastVisit: item.process_details.date_visit_eeuu ? true : false, 
                                dateLastVisit: item.process_details.date_visit_eeuu || '', 
                                timeLastVisit: item.process_details.time_visit_eeuu || '',
                                observations: item.process_details.observations || '',                                 
                                ds160: item.process_details.item.clave_ds_160 || '',
                                travel_before: item.process_details.travel_before || '',
                                travel_before_countries: item.process_details.travel_before_countries || ''
                            }
                                
                            
                        }
                    }
                }

                if(item.account !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            account: item.account
                        }
                    }
                }

                clientsList.push(data);
            });

            console.log(clientsList)
            setClients(clientsList);
            setCurrentKey('0');
            
        }

        loader.current?.handleClose()
    }

    const onIdle = ()=>{
        console.log('save data')
    }

    const updateClient = (data:any, index:number)=>{
        const dataClients:any = clients.map((client:any, i)=>{
            if(i === index){
                client = data;
            }

            return client;
        });

        setClients(dataClients);
        console.log(data, index);
    }

    useIdleTimer({
        onIdle,
        timeout:6_000 * 10, // n * 10 = seconds, 6_000 * 10 = 60 seconds
    })

    useEffect(()=>{
        onLoad();
    },[])

    console.log(clients)

    return(
        <Content
            url="/procedures/visa/details"
            page="Visas"
            subpage="Detalles"
            title="Detalle de trámite de visa"
            autoHeight
        >
            <>
                <div style={{minHeight:height}}>
                    <Tabs activeKey={currentKey} onSelect={setCurrentKey}>
                        {clients.map((client, index)=>
                            <Tabs.Tab key={index} eventKey={index.toString()} title={'Cliente '+index + 1}>
                                <DetailsForm loader={loader} client={client} index={index} updateClient={updateClient} />
                            </Tabs.Tab>
                        )}
                    </Tabs>
                </div>
            </>
        </Content>
    )
}

export default VisaDetails;