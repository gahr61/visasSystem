import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Tabs } from "rsuite";

import Content from "../../../components/common/Content";
import DetailsForm from "../../../components/ui/procedures/visa/DetailsForm";

import { IApp } from "../../../utils/interfaces/function";
import { visasInfoDetails } from "../../../utils/services/sales/procedures";
import { useIdleTimer } from "react-idle-timer";
import moment from "moment";
import { decript, encript, isValidForm, removeFromStorage, verifyRequiredFields } from "../../../utils/functions";
import Toast from "../../../components/common/Toast";
import Button from "../../../components/common/Button";
import { Client } from "../../../utils/interfaces/client";
import { Passport } from "../../../utils/interfaces/passport";
import { salesClientsLanguages, salesClientsOcuppations, salesClientsRelationships, salesClientsStudies, salesClientsTravel, salesClientsUpdate, salesClientsUpdateAddress, salesClientsUpdatePhones } from "../../../utils/services/clients";
import { passportUpdate } from "../../../utils/services/passport";
import { usePermissionsStore } from "../../../utils/stores/usePermissionsStore";
import {  detailsForm } from "../../../utils/requiredFields";
import { useUserStore } from "../../../utils/stores/useUserStore";
import VisaDetailPrint from "../../../components/ui/procedures/visa/VisaDetailPrint";

const VisaDetails = ({loader}:IApp)=>{
    const hasPermission = usePermissionsStore(state => state.hasPermission);
    const userData = useUserStore(store => store.user);

    if(!hasPermission('procedure_visa_update')){
        <Navigate to="/" />
    }

    const navigate = useNavigate();

    const {id} = useParams();

    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const [clients, setClients] = useState([]);

    const dataForm:any = {
        personalInformation:{
            id:null,
            names:'', lastname1:'', lastname2:'', birthdate:'', sex:'', curp:'', civilStatus:'', languages:[],
            birthplace:{
                country:42, state:'', city:'', nationality:''
            },
            passport:{
                id:null, number:'', expedition_date:'', expiration_date:'', country_expedition:42, state_expedition:'', city_expedition:''
            }
        },
        contactInformation:{
            address:{
                id:'', street:'', noInt:'', noExt:'', postCode:'', colony:'', country:42, state:'', city:''                
            },
            phones:[]
        },
        familiarInformation:{
            relationships:[]
        },
        jobsSchools:{
            occupation:'', otherOcupation:'', salary:'', antiquity:'', ocupationName:'', ocupationAddress:'',
            schools:[]
        },
        generalInformation:{
            residence:{
                fullName:'', personalPhone:'', workPhone:'', celPhone:''
            },
            history:{ tryProcedureVisa:'', procedureDate:'', visaApproved:'' },
            visa:{ lastVisa:'',expeditionDate:'', expirationDate:'' },
            details:{
                addressEEUU:'', travelDateEEUU:'', has_visit_eeuu:'', travel_date:'',
                timeEEUU:'', travelReason:'', coverExpenses:'', lastVisit:'', dateLastVisit:'', timeLastVisit:'',
                other_countries:'', travelCountries:'',
                observations:'', socialNetworks:[]
            }
        }
    };

    const validationRules:any = {
        personalInformation:{            
            names:'required', lastname1:'required', lastname2:'required', birthdate:'required', sex:'', curp:'required', civilStatus:'',
            birthplace:{
                country:'required', state:'required', city:'required', nationality:''
            },
            passport:{
                number:'required', expedition_date:'required', expiration_date:'required', country_expedition:'', state_expedition:'', city_expedition:''
            }
        },
        contactInformation:{
            address:{
                street:'required', noInt:'', noExt:'required', postCode:'required', colony:'required', country:'required', state:'required', city:'required'                
            }
        },
        jobsSchools:{
            occupation:'required', otherOcupation:'', salary:'required', antiquity:'required', ocupationName:'required', ocupationAddress:'required',
            schools:[]
        },
        generalInformation:{
            residence:{
                fullName:'required', personalPhone:'required', workPhone:'', celPhone:''
            },
            history:{ tryProcedureVisa:'required', procedureDate:'' },
            visa:{ lastVisa:'',expeditionDate:'', expirationDate:'' },
            details:{
                addressEEUU:'required', travelDateEEUU:'required', has_visit_eeuu:'required', travel_date:'required',
                timeEEUU:'', travelReason:'required', coverExpenses:'required', lastVisit:'required', dateLastVisit:'required', timeLastVisit:'required',
                observations:''
            }
        }
    };

    const [currentKey, setCurrentKey] = useState<string | number | undefined>('0');
    const [saleStatus, setSaleStatus] = useState('');
    const [saleType, setSaleType] = useState('');
    const [showPrint, setShowPrint] = useState(false);

    const onLoad = async ()=>{
        const fromStorage = decript('clients', 'local');

        if(fromStorage !== ''){
            setClients(JSON.parse(fromStorage));
            //return;
        }


        loader.current?.handleShow('Cargando...')
        let response = await visasInfoDetails(id);

        if(response && response.success){
            setSaleStatus(response.data.sale_status || '');
            setSaleType(response.data.sale_type || '');

            let data = dataForm;
            let clientsList:any = [];

            response.data.clients.forEach((item:any)=>{
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
                        languages: item.languages || [],
                        birthplace:{
                            ...data.personalInformation.birthplace,
                            country: item.country_birth_id || 42,
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
                            country_expedition: item.passport.expedition_country_id || 42, 
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
                        relationships: item.parents.map((parent:any)=>{
                            const item = {
                                ...parent,
                                birthdate: moment(parent.birtdate).format('DD/MM/YYYY')
                            }

                            return item;
                        })
                    },
                    jobsSchools:{
                        ...dataForm.jobsSchool,
                        ...data.jobsSchool,
                        schools: item.studies
                    },
                    generalInformation:{
                        ...data.generalInformation,                        
                        residence:{
                            ...data.generalInformation.residence,
                            process_id: item.process.id
                        }
                    },
                    process_id: item.process.id,
                    account_email: item.account?.email || '',
                    account_password: item.account?.password || '',
                }

                if(item.address !== null){
                    data = {
                        ...data,
                        contactInformation:{
                            ...data.contactInformation,
                            address:{
                                id: item.address.id || '',
                                street: item.address.street || '',
                                noInt: item.address.int_number || '', 
                                noExt: item.address.ext_number || '', 
                                postCode: item.address.postal_code || '', 
                                colony: item.address.colony || '', 
                                country: item.address.countries_id || '', 
                                state: item.address.states_id || '', 
                                city: item.address.city || ''
                            }
                            
                        }
                    }
                }

                if(item.occupation !== null){
                    data = {
                        ...data,
                        jobsSchools:{
                            ...data.jobSchools,
                            id: item.occupation.id,
                            occupation: item.occupation.occupations_id, 
                            salary: item.occupation.salary, 
                            antiquity: item.occupation.antiquity, 
                            occupationName: item.occupation.name, 
                            occupationAddress: item.occupation.address,
                            schools: item.studies
                        }
                        
                    }
                }

                if(item.residence !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            residence:{
                                ...data.generalInformation.residence,
                                id: item.residence.id,                                
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
                                tryProcedureVisa: item.process_history.has_tried_visa ? '1' : '0',
                                procedureDate: item.process_history.date,
                                visaApproved: item.process_details.visa_approved ? '1' : '0'
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
                    const has_visit = (item.process_details.has_visit_eeuu ? '1' : '0')
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            details:{
                                id: item.process_details.id,
                                travel_date: item.process_details.travel_date || '',
                                has_visit_eeuu:  has_visit,
                                addressEEUU: item.process_details.address_eeuu || '', 
                                travelDateEEUU: item.process_details.travel_date_eeuu || '',
                                timeEEUU: item.process_details.time_stay_eeuu || '', 
                                travelReason: item.process_details.travel_reason || '', 
                                coverExpenses: item.process_details.cover_expenses || '', 
                                lastVisit: item.process_details.date_visit_eeuu , 
                                dateLastVisit: item.process_details.time_visit_eeuu || '', 
                                timeLastVisit: item.process_details.date_visit_eeuu || '',
                                observations: item.process_details.observations || '',    
                                travel_before: item.process_details.travel_before || '',
                                other_countries: item.process_details.travel_before_countries || '',
                                travelCountries: item.process_details.travel_countries || '',
                                clave_ds_160: item.process_details.clave_ds_160 || '',
                                socialNetworks: item.social
                            }
                        }
                    }
                }

                clientsList.push(data);
            });
            
            setClients(clientsList);
            encript('clients', JSON.stringify(clientsList), 'local');
            setCurrentKey('0');
        }

        loader.current?.handleClose()
    }

    const onIdle = ()=>{
        console.log('save data')

        handleSubmit();
    }

    const updateClient = (data:any, index:number)=>{
        const dataClients:any = clients.map((client:any, i)=>{
            if(i === index){
                client = data;
            }

            return client;
        });

        encript('clients', JSON.stringify(dataClients), 'local');

        setClients(dataClients);
    }

    const validateAllData = () => {
        let errors:any = [];

        clients.forEach((client, index)=>{
            Object.keys(validationRules).forEach((section)=>{                
                Object.keys(validationRules[section]).forEach((element)=>{
                    
                    const formElement = validationRules[section][element];
                    
                    if(typeof formElement === 'object'){
                        Object.keys(formElement).forEach((item)=>{
                            const valueItem = formElement[item];
                            const value = client[section][element][item];

                            if(valueItem === 'required' && value === ''){
                                let error:any = errors.find((obj:any) => obj.form === index);

                                if(!error){
                                    errors.push({
                                        form:index,
                                        fields:[{field:item}]
                                    })
                                }else{
                                    error = {
                                        ...error,
                                        fields:[...error.fields, {field: item}]
                                    }

                                    errors[index] = error;
                                }
                            }                            
                        })
                    }
                })
            })
        })
        
        return errors.length === 0;
    }

    const updatePersonalInfo = async (client:any)=>{
        let valid = true;
        
        //update clients
        const clientObj:Client = {
            names: client.personalInformation.names,
            lastname1: client.personalInformation.lastname1,
            lastname2: client.personalInformation.lastname2,
            birthdate: client.personalInformation.birthdate,
            sex: client.personalInformation.sex || null,
            curp: client.personalInformation.curp,
            civil_status: client.personalInformation.civil_status || null,
            country_birth_id: client.personalInformation.birthplace.country || null,
            state_birth_id: client.personalInformation.birthplace.state || null,
            city_birth: client.personalInformation.birthplace.city || null,
            nationality: client.personalInformation.birthplace.nationality || null
        }

        //update pasport
        const passportObj:Passport = {            
            number: client.personalInformation.passport.number,
            expedition_date: client.personalInformation.passport.expedition_date,
            expiration_date: client.personalInformation.passport.expiration_date,
            expedition_country_id: client.personalInformation.passport.expedition_country_id || null,
            expedition_state_id: client.personalInformation.passport.expedition_country_id || null,
            expedition_city: client.personalInformation.passport.expedition_city || null
        }

        const languagesObj = {
            clients_id: client.personalInformation.id,
            languages: client.personalInformation.languages || []
        };

        const clientRequest = salesClientsUpdate(client.personalInformation.id, clientObj);
        const passportRequest = passportUpdate(client.personalInformation.passport.id, passportObj);
        const languagesRequest = salesClientsLanguages(languagesObj);

        const [
            clientResponse,
            passportResponse,
            languagesResponse
        ]:any = await Promise.allSettled([
            clientRequest,
            passportRequest,
            languagesRequest
        ]);

        if(clientResponse.value.success && passportResponse.value.success && languagesResponse.value.success){
            valid = true;

            return valid;
        }

        Toast.fire('Error', clientResponse.value.message+' - '+passportResponse.value.message, 'error');
    };

    const updateContactInfo = async (client:any)=>{

        const addressObj = {
            id:client.contactInformation.address.id || null,
            address:{
                clients_id: client.personalInformation.id,
                street: client.contactInformation.address.street,
                int_number: client.contactInformation.address.noInt || null,
                ext_number: client.contactInformation.address.noExt,
                postal_code: client.contactInformation.address.postCode,
                colony: client.contactInformation.address.colony,
                city: client.contactInformation.address.city,
                countries_id: client.contactInformation.address.country,
                states_id: client.contactInformation.address.state,
            }
            
        };

        const phonesObj = {
            clients_id: client.personalInformation.id,
            phones: client.contactInformation.phones.map((phone:any)=>{
                const item = {
                    type: phone.type, 
                    number: phone.number
                };

                return item;
            })
        }

        const validAddress = verifyRequiredFields(addressObj.address, detailsForm.address);

        if(validAddress){
            const addressRequest = salesClientsUpdateAddress(addressObj);
        
            let responses = [addressRequest];

            if(phonesObj.phones.length > 0){
                const phoneRequest = salesClientsUpdatePhones(phonesObj);
                responses.push(phoneRequest);
            }

            const [
                addressResponse,
                phoneResponse
            ]:any = await Promise.allSettled(responses);


            let error = addressResponse.value.success ? '' : addressResponse.value.message;

            if(responses.length === 1){
                if(addressResponse.value.success){
                    return true;
                }

                Toast.fire('Error', addressResponse.value.message, 'error');
                return;
            }

            if(addressResponse.value.success && phoneResponse.value.success){
                return true;
            }

            error += addressResponse.value.success ? '' : ' - '+addressResponse.value.message

            Toast.fire('Error', error, 'error');

            return;
        }

        return true;
    }

    const saveUpdateRelationships = async (client:any)=>{
        const obj = {
            clients_id: client.personalInformation.id,
            relationships: client.familiarInformation.relationships.map((relation:any)=>{
                const item = {
                    relationship: relation.relationship,
                    fullname: relation.full_name,
                    birthdate: moment(relation.birthdate, 'DD/MM/YYYY').local().format('YYYY-MM-DD'),
                    has_visa: relation.hasVisa === 'No' ? false : true
                }

                return item;
            })
        };

        const response = await salesClientsRelationships(obj);

        if(response && response.success){            
            return true;
        }

        Toast.fire('Error', response.message, 'error');
        return false;
        
    }

    const updateJobsSchools = async (client:any)=>{

        const objJobs = {
            clients_id: client.personalInformation.id,
            occupations_id: client.jobsSchools.occupation,
            name: client.jobsSchools.occupationName,
            otherOccupation: client.jobsSchools.otherOccupation,
            address: client.jobsSchools.occupationAddress,
            salary: client.jobsSchools.salary,
            antiquity: client.jobsSchools.antiquity
        };

        const schools = client.jobsSchools.schools.map((school:any)=>{
            const item = {
                name: school.name,
                address: school.address,
                period: school.period
            };

            return item;
        });

        const objSchool = {
            clients_id: client.personalInformation.id,
            schools: schools
        };


        const validForm = verifyRequiredFields(objJobs, detailsForm.job);
        
        if(validForm){
            const jobRequest = salesClientsOcuppations(objJobs);

            let responses:any = [jobRequest];

            if(schools.length > 0){
                const schoolRequest = salesClientsStudies(objSchool);

                responses.push(schoolRequest);
            }

            const [
                jobResponse,
                schoolResponse
            ]:any = await Promise.allSettled(responses);

            let error = jobResponse.value.success ? '' : jobResponse.value.message;

            if(responses.length === 1){
                if(jobResponse.value.success){
                    return true;
                }

                Toast.fire('Error', jobResponse.value.message, 'error');
                return;
            }

            if(jobResponse.value.success && schoolResponse.value.success){
                return true;
            }

            error += jobResponse.value.success ? '' : ' - '+jobResponse.value.message

            Toast.fire('Error', error, 'error');

            return;
        }

        return true;
        
    }

    const saveGeneralInfo = async (client:any)=>{
        let valid = false;

        let obj:any = {
            clients_id: client.personalInformation.id,
            residence:{
                process_id: client.process_id,
                full_name: client.generalInformation.residence.fullName,
                cel_phone: client.generalInformation.residence.celPhone,
                work_phone: client.generalInformation.residence.workPhone,
                personal_phone: client.generalInformation.residence.personalPhone
            },
            process_details:{
                id: client.generalInformation.details.id,
                travel_date: client.generalInformation.details.travelDate,
                address_eeuu: client.generalInformation.details.addressEEUU,
                travel_date_eeuu: client.generalInformation.details.travelDateEEUU,
                time_stay_eeuu: client.generalInformation.details.timeEEUU,
                travel_reason: client.generalInformation.details.travelReason,
                cover_expenses: client.generalInformation.details.coverExpenses,
                has_visit_eeuu: client.generalInformation.details.has_visit_eeuu,
                last_visit_eeuu: client.generalInformation.details.lastVisit,
                date_visit_eeuu: client.generalInformation.details.lastVisit,
                time_visit_eeuu: client.generalInformation.details.dateLastVisit,
                travel_before: client.generalInformation.details.has_visit_eeuu,
                visa_approved: client.generalInformation.history.visaApproved,
                travel_before_countries: client.generalInformation.details.other_countries,
                travel_countries: client.generalInformation.details.travelCountries
            },
            history:{
                process_id: client.process_id,
                has_tried_visa: client.generalInformation.history.tryProcedureVisa,
                date: client.generalInformation.history.procedureDate,
                observations: client.generalInformation.history.observations
            },
            social_networks: client.generalInformation.details.socialNetworks.map((social:any)=>{
                let item = {
                    ...social,
                    clients_id: client.personalInformation.id
                }

                return item;
            })
        }

        if(client.generalInformation.history.tryProcedureVisa === '1'){
            obj = {
                ...obj,
                visa:{
                    number: client.generalInformation.visa.lastVisa,
                    expedition_date: client.generalInformation.visa.expeditionDate,
                    expiration_date: client.generalInformation.visa.expirationDate,
                }
            }
        }
        
        const response = await salesClientsTravel(obj);

        if(response && response.success){
            valid = true;
        }

        return valid;
    }

    const handleSubmit = async ()=>{
        if(!validateAllData() && !isValidForm('div.forms')){
            Toast.fire('Error', 'Existen campos vacios en los clientes, que son requeridos', 'error');
            return;
        }
    
        loader.current?.handleShow('Guardando...');

        const requested = await Promise.all(clients.map(async (client:any)=>{
            const resPersonal = await updatePersonalInfo(client);
            const resContact = await updateContactInfo(client);
            const resRelation = await saveUpdateRelationships(client);
            const resJob = await updateJobsSchools(client);
            const resGeneral = await saveGeneralInfo(client);

            if(resPersonal && resContact && resRelation && resJob && resGeneral){
                return true;
            }
        }));

        const filtered = requested.filter(obj => obj !== undefined);

        loader.current?.handleClose();
        
        if(filtered.length === clients.length){
            Toast.fire('Correcto', 'Se guardaron los datos correctamente', 'success');

            if(userData.role === 'cliente'){
                navigate('/procedures/visa/client/list');
            }else{
                navigate('/procedures/visa/list');
            }

            removeFromStorage('clients', 'local');
            
            return;
        }
        
        Toast.fire('Error', 'Existe un error en el guardado de datos', 'error');
    }

    const handleCancel = ()=>{
         if(userData.role === 'cliente'){
            navigate('/procedures/visa/client/list');
        }else{
            navigate('/procedures/visa/list');
        }

        removeFromStorage('clients', 'local');
    }

    useIdleTimer({
        onIdle,
        timeout:6_000 * 50, // n * 10 = seconds, 6_000 * 10 = 60 seconds
    })

    useEffect(()=>{
        onLoad();
    },[])

    return(
        <Content
            url="/procedures/visa/details"
            page="Visas"
            subpage="Detalles"
            title="Detalle de trámite de visa"
            autoHeight
        >
            <>
                <VisaDetailPrint
                    open={showPrint}
                    onClose={() => setShowPrint(false)}
                    clients={clients}
                    saleStatus={saleStatus}
                    saleType={saleType}
                />
                <div style={{minHeight:height}}>
                    <Tabs activeKey={currentKey} onSelect={setCurrentKey}>
                        {clients.map((client, index)=>
                            <Tabs.Tab key={index} eventKey={index.toString()} title={'Cliente '+index + 1}>
                                <DetailsForm 
                                    loader={loader} 
                                    client={client} 
                                    index={index} 
                                    updateClient={updateClient} 
                                />
                            </Tabs.Tab>
                        )}
                    </Tabs>

                    <div className="my-3 flex justify-end gap-2">
                        <Button appearance="default" onClick={()=>handleCancel()}>Cancelar</Button>
                        <Button appearance="ghost" onClick={() => setShowPrint(true)}>Vista previa</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </div>
                </div>
            </>
        </Content>
    )
}

export default VisaDetails;