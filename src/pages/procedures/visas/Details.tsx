import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Message, Tabs } from "rsuite";

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
import { salesClientsLanguages, salesClientsOcuppations, salesClientsRelationships, salesClientsSocialNetworks, salesClientsStudies, salesClientsTravel, salesClientsUpdate, salesClientsUpdateAddress, salesClientsUpdatePhones } from "../../../utils/services/clients";
import { passportUpdate } from "../../../utils/services/passport";
import { usePermissionsStore } from "../../../utils/stores/usePermissionsStore";
import {  detailsForm } from "../../../utils/requiredFields";
import { useUserStore } from "../../../utils/stores/useUserStore";
import VisaDetailPrint from "../../../components/ui/procedures/visa/VisaDetailPrint";

const parseFullName = (fullName: string) => {
    const words = (fullName || '').trim().split(/\s+/).filter(Boolean);

    if(words.length === 0){
        return { names: '', lastname1: '', lastname2: '' };
    }

    if(words.length === 1){
        return { names: words[0], lastname1: '', lastname2: '' };
    }

    if(words.length === 2){
        return { names: words[0], lastname1: words[1], lastname2: '' };
    }

    const lastname2 = words[words.length - 1];
    const lastname1 = words[words.length - 2];
    const names = words.slice(0, words.length - 2).join(' ');

    return { names, lastname1, lastname2 };
}

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
            },
            spouse:{
                id:null, names:'', lastname1:'', lastname2:'', birthdate:'', country:42, state:'', hasVisa:''
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
            occupations:[],
            schools:[]
        },
        generalInformation:{
            residence:{
                fullName:'', relationship:'', citizen_status:'', personalPhone:'', workPhone:'', celPhone:''
            },
            history:{ tryProcedureVisa:'', procedureDate:'', visaApproved:'' },
            visa:{ lastVisa:'',expeditionDate:'', expirationDate:'' },
            details:{
                addressEEUU:{ street:'', number:'', city:'', state:'', zip:'' },
                travelDateEEUU:'', has_visit_eeuu:'', travel_date:'',
                timeEEUU:'', travelReason:'', coverExpenses:'', lastVisit:'', dateLastVisit:'', timeLastVisit:'',
                other_countries:'', travelCountries:'',
                observations:'', socialNetworks:[]
            }
        }
    };

    const validationRules:any = {
        personalInformation:{
            names:'required', lastname1:'required', lastname2:'', birthdate:'required', sex:'', curp:'required', civilStatus:'',
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
        generalInformation:{
            residence:{
                fullName:'required', relationship:'', citizen_status:'', personalPhone:'', workPhone:'', celPhone:'required'
            },
            history:{ tryProcedureVisa:'', procedureDate:'' },
            details:{
                addressEEUU:{
                    street:'', number:'', city:'', state:'', zip:''
                },
                travelDateEEUU:'', timeEEUU:'', travelReason:'', coverExpenses:'',
                has_visit_eeuu:'', other_countries:''
            }
        }
    };

    const SECTION_LABELS:any = {
        personal: 'Datos personales',
        contact: 'Información de contacto',
        familiar: 'Familia directa',
        job: 'Información laboral y académica',
        general: 'Información de estancia'
    };

    const isRuleComplete = (obj:any, rules:any):boolean => {
        return Object.keys(rules).every((key)=>{
            const rule = rules[key];

            if(typeof rule === 'object'){
                return isRuleComplete(obj?.[key], rule);
            }

            if(rule === 'required'){
                return obj?.[key] !== '' && obj?.[key] !== null && obj?.[key] !== undefined;
            }

            return true;
        });
    }

    const isPersonalComplete = (client:any) => {
        if(!isRuleComplete(client.personalInformation, validationRules.personalInformation)) return false;

        const isMarried = client.personalInformation.civilStatus === 'Casado' || client.personalInformation.civilStatus === 'Union libre';

        if(isMarried){
            const spouse = client.personalInformation.spouse;
            if(!spouse.names || !spouse.lastname1 || !spouse.birthdate || !spouse.state || spouse.hasVisa === '') return false;
        }

        return true;
    }

    const isContactComplete = (client:any) => isRuleComplete(client.contactInformation, validationRules.contactInformation);

    const isFamiliarComplete = (client:any) => {
        const relationships = client.familiarInformation.relationships;
        const hasFather = relationships.some((r:any) => r.relationship === 'PADRE');
        const hasMother = relationships.some((r:any) => r.relationship === 'MADRE');

        return hasFather && hasMother;
    }

    const isJobComplete = (client:any) => (client.jobsSchools.occupations || []).length > 0;

    const isGeneralComplete = (client:any) => {
        const formIsValid = isValidForm('div.general-form');

        if(!isRuleComplete(client.generalInformation, validationRules.generalInformation) || !formIsValid) return false;

        const details = client.generalInformation.details;
        if(details.has_visit_eeuu === '1' && (!details.lastVisit || !details.dateLastVisit)){
            return false;
        }
        if(details.other_countries === '1' && !details.travelCountries){
            return false;
        }

        const history = client.generalInformation.history;
        if(history.tryProcedureVisa === '1'){
            if(!history.procedureDate || history.visaApproved === ''){
                return false;
            }

            if(history.visaApproved === '1'){
                const visa = client.generalInformation.visa;
                if(!visa.lastVisa || !visa.expirationDate || !visa.expeditionDate){
                    return false;
                }
            }
        }

        return true;
    }

    const [currentKey, setCurrentKey] = useState<string | number | undefined>('0');
    const [saleStatus, setSaleStatus] = useState('');
    const [saleType, setSaleType] = useState('');
    const [showPrint, setShowPrint] = useState(false);
    const [missingData, setMissingData] = useState<Record<number, string[]>>({});

    const onLoad = async ()=>{
        const fromStorage = decript('clients', 'local');

        if(fromStorage !== ''){
            const cachedClients = JSON.parse(fromStorage).map((client:any) => ({
                ...dataForm,
                ...client,
                personalInformation:{
                    ...dataForm.personalInformation,
                    ...client.personalInformation,
                    spouse:{ ...dataForm.personalInformation.spouse, ...client.personalInformation?.spouse }
                },
                jobsSchools:{
                    ...dataForm.jobsSchools,
                    ...client.jobsSchools
                },
                generalInformation:{
                    ...dataForm.generalInformation,
                    ...client.generalInformation,
                    details:{
                        ...dataForm.generalInformation.details,
                        ...client.generalInformation?.details,
                        addressEEUU:{ ...dataForm.generalInformation.details.addressEEUU, ...client.generalInformation?.details?.addressEEUU }
                    }
                }
            }));

            setClients(cachedClients);
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
                const spouseRelationships = ['esposo', 'esposa', 'conyuge'];
                const spouseEntry = item.parents.find((parent:any) => spouseRelationships.includes(parent.relationship));
                const otherRelationships = item.parents.filter((parent:any) => !spouseRelationships.includes(parent.relationship));

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
                            city: item.city_birth || '',
                            nationality: item.nationality || ''
                        },
                        passport:{
                            ...data.personalInformation.passport,
                            id: item.passport.id || '',
                            number: item.passport.number,
                            expedition_date: item.passport.expedition_date,
                            expiration_date: item.passport.expiration_date,
                            country_expedition: item.passport.expedition_countries_id || 42,
                            state_expedition: item.passport.expedition_states_id || '',
                            city_expedition: item.passport.expedition_city || ''
                        },
                        spouse:{
                            ...data.personalInformation.spouse,
                            id: spouseEntry?.id || null,
                            ...parseFullName(spouseEntry?.full_name || ''),
                            birthdate: spouseEntry?.birthdate || '',
                            country: spouseEntry?.country_birth_id || 42,
                            state: spouseEntry?.state_birth_id || '',
                            hasVisa: spouseEntry ? (spouseEntry.has_visa ? '1' : '0') : ''
                        }
                    },
                    contactInformation:{
                        ...data.contactInformation,
                        phones: item.phones
                    },
                    familiarInformation:{
                        ...data.familiarInformation,
                        relationships: otherRelationships.map((parent:any)=>({
                            ...parent,
                            birthdate: moment(parent.birthdate).format('DD/MM/YYYY'),
                            hasVisa: parent.has_visa ? 'Si' : 'No',
                            livesInUsa: parent.lives_in_usa ? 'Si' : 'No',
                            citizenStatus: parent.citizen_status || ''
                        }))
                    },
                    jobsSchools:{
                        occupations: (item.occupations || []).map((occupation:any)=>({
                            id: occupation.id,
                            occupations_id: occupation.occupations_id,
                            name: occupation.name,
                            salary: occupation.salary,
                            antiquity: occupation.antiquity,
                            hireDate: occupation.hire_date || '',
                            activities_description: occupation.activities_description || '',
                            is_primary: !!occupation.is_primary,
                            address:{
                                street: occupation.street || '',
                                noInt: occupation.int_number || '',
                                noExt: occupation.ext_number || '',
                                postCode: occupation.postal_code || '',
                                colony: occupation.colony || '',
                                country: occupation.countries_id || 42,
                                state: occupation.states_id || '',
                                city: occupation.city || ''
                            }
                        })),
                        schools: (item.studies || []).map((school:any)=>({
                            name: school.name,
                            degree_level: school.degree_level || '',
                            is_last_degree: !!school.is_last_degree,
                            period: school.period,
                            address:{
                                street: school.street || '',
                                noInt: school.int_number || '',
                                noExt: school.ext_number || '',
                                postCode: school.postal_code || '',
                                colony: school.colony || '',
                                country: school.countries_id || 42,
                                state: school.states_id || '',
                                city: school.city || ''
                            }
                        }))
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

                if(item.residence !== null){
                    data = {
                        ...data,
                        generalInformation:{
                            ...data.generalInformation,
                            residence:{
                                ...data.generalInformation.residence,
                                id: item.residence.id,
                                fullName: item.residence.full_name  || '',
                                relationship: item.residence.relationship || '',
                                citizen_status: item.residence.citizen_status || '',
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
                                ...data.generalInformation.details,
                                id: item.process_details.id,
                                travel_date: item.process_details.travel_date || '',
                                has_visit_eeuu:  has_visit,
                                addressEEUU:{
                                    street: item.process_details.street_eeuu || '',
                                    number: item.process_details.number_eeuu || '',
                                    city: item.process_details.city_eeuu || '',
                                    state: item.process_details.state_eeuu || '',
                                    zip: item.process_details.zip_eeuu || ''
                                },
                                travelDateEEUU: (item.process_details.travel_date_eeuu || '').slice(0, 7),
                                timeEEUU: item.process_details.time_stay_eeuu || '',
                                travelReason: item.process_details.travel_reason || '',
                                coverExpenses: item.process_details.cover_expenses || '',
                                lastVisit: item.process_details.date_visit_eeuu ,
                                dateLastVisit: item.process_details.time_visit_eeuu || '',
                                timeLastVisit: item.process_details.date_visit_eeuu || '',
                                observations: item.process_details.observations || '',
                                other_countries: item.process_details.travel_before ? '1' : '0',
                                travelCountries: item.process_details.travel_countries || '',
                                clave_ds_160: item.process_details.clave_ds_160 || ''
                            }
                        }
                    }
                }

                data = {
                    ...data,
                    generalInformation:{
                        ...data.generalInformation,
                        details:{
                            ...data.generalInformation.details,
                            socialNetworks: item.social || []
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
            civil_status: client.personalInformation.civilStatus || null,
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
            expedition_countries_id: client.personalInformation.passport.country_expedition || null,
            expedition_states_id: client.personalInformation.passport.state_expedition || null,
            expedition_city: client.personalInformation.passport.city_expedition || null
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
                    number: phone.number,
                    description: phone.description || null
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
        const relationships = client.familiarInformation.relationships.map((relation:any)=>{
            const item = {
                relationship: relation.relationship,
                fullname: relation.full_name,
                birthdate: moment(relation.birthdate, 'DD/MM/YYYY').local().format('YYYY-MM-DD'),
                has_visa: relation.hasVisa === 'No' ? false : true,
                lives_in_usa: relation.livesInUsa === 'No' ? false : true,
                citizen_status: relation.citizenStatus || null,
                country_birth_id: relation.country_birth_id || null,
                state_birth_id: relation.state_birth_id || null
            }

            return item;
        });

        const isMarried = client.personalInformation.civilStatus === 'Casado' || client.personalInformation.civilStatus === 'Union libre';

        if(isMarried && client.personalInformation.spouse.names !== ''){
            const spouse = client.personalInformation.spouse;

            relationships.push({
                relationship: 'conyuge',
                fullname: [spouse.names, spouse.lastname1, spouse.lastname2].filter(Boolean).join(' '),
                birthdate: spouse.birthdate,
                has_visa: spouse.hasVisa === '1',
                country_birth_id: spouse.country || null,
                state_birth_id: spouse.state || null
            });
        }

        const obj = {
            clients_id: client.personalInformation.id,
            relationships
        };

        const response = await salesClientsRelationships(obj);

        if(response && response.success){            
            return true;
        }

        Toast.fire('Error', response.message, 'error');
        return false;
        
    }

    const updateJobsSchools = async (client:any)=>{

        const occupations = (client.jobsSchools.occupations || []).map((occupation:any)=>{
            const occupationAddress = occupation.address || {};

            return {
                occupations_id: occupation.occupations_id,
                name: occupation.name,
                otherOccupation: occupation.otherOccupation,
                salary: occupation.salary,
                antiquity: occupation.antiquity,
                hire_date: occupation.hireDate,
                activities_description: occupation.activities_description,
                is_primary: occupation.is_primary,
                address:{
                    street: occupationAddress.street,
                    int_number: occupationAddress.noInt || null,
                    ext_number: occupationAddress.noExt,
                    postal_code: occupationAddress.postCode,
                    colony: occupationAddress.colony,
                    city: occupationAddress.city,
                    countries_id: occupationAddress.country,
                    states_id: occupationAddress.state
                }
            };
        });

        const objJobs = {
            clients_id: client.personalInformation.id,
            occupations: occupations
        };

        const schools = client.jobsSchools.schools.map((school:any)=>{
            const schoolAddress = school.address || {};

            const item = {
                name: school.name,
                degree_level: school.degree_level,
                is_last_degree: school.is_last_degree,
                period: school.period,
                address:{
                    street: schoolAddress.street,
                    int_number: schoolAddress.noInt || null,
                    ext_number: schoolAddress.noExt,
                    postal_code: schoolAddress.postCode,
                    colony: schoolAddress.colony,
                    city: schoolAddress.city,
                    countries_id: schoolAddress.country,
                    states_id: schoolAddress.state
                }
            };

            return item;
        });

        const objSchool = {
            clients_id: client.personalInformation.id,
            schools: schools
        };

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

    const saveGeneralInfo = async (client:any, markComplete:boolean = false)=>{
        let valid = false;

        let obj:any = {
            clients_id: client.personalInformation.id,
            mark_complete: markComplete,
            residence:{
                id: client.generalInformation.residence.id,
                process_id: client.process_id,
                full_name: client.generalInformation.residence.fullName,
                relationship: client.generalInformation.residence.relationship,
                citizen_status: client.generalInformation.residence.citizen_status,
                cel_phone: client.generalInformation.residence.celPhone,
                work_phone: client.generalInformation.residence.workPhone,
                personal_phone: client.generalInformation.residence.personalPhone
            },
            process_details:{
                id: client.generalInformation.details.id,
                travel_date: client.generalInformation.details.travel_date,
                address_eeuu: client.generalInformation.details.addressEEUU,
                travel_date_eeuu: client.generalInformation.details.travelDateEEUU
                    ? `${client.generalInformation.details.travelDateEEUU}-01`
                    : null,
                time_stay_eeuu: client.generalInformation.details.timeEEUU,
                travel_reason: client.generalInformation.details.travelReason,
                cover_expenses: client.generalInformation.details.coverExpenses,
                has_visit_eeuu: client.generalInformation.details.has_visit_eeuu,
                date_visit_eeuu: client.generalInformation.details.lastVisit,
                time_visit_eeuu: client.generalInformation.details.dateLastVisit,
                observations: client.generalInformation.details.observations,
                travel_before: client.generalInformation.details.other_countries,
                visa_approved: client.generalInformation.history.visaApproved,
                travel_before_countries: client.generalInformation.details.travelCountries,
                travel_countries: client.generalInformation.details.travelCountries
            },
            history:{
                process_id: client.process_id,
                has_tried_visa: client.generalInformation.history.tryProcedureVisa,
                date: client.generalInformation.history.procedureDate
            }
        }

        const visaWasApproved = client.generalInformation.history.tryProcedureVisa === '1'
            && client.generalInformation.history.visaApproved === '1';

        if(visaWasApproved && client.generalInformation.visa.lastVisa){
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

            return valid;
        }

        Toast.fire('Error', response?.message, 'error');

        return valid;
    }

    const saveSocialNetworks = async (client:any)=>{
        const obj = {
            clients_id: client.personalInformation.id,
            social_networks: (client.generalInformation.details.socialNetworks || []).map((social:any)=>({
                ...social,
                clients_id: client.personalInformation.id
            }))
        };

        const response = await salesClientsSocialNetworks(obj);

        if(response && response.success){
            return true;
        }

        Toast.fire('Error', response?.message, 'error');

        return false;
    }

    const VISIBLE_STEP_FORMS = ['div.personal-form', 'div.address-form', 'div.general-form'];

    const handleSubmit = async ()=>{
        const visibleFormIsValid = VISIBLE_STEP_FORMS.every((selector)=> isValidForm(selector));

        if(!visibleFormIsValid){
            Toast.fire('Error', 'Completa los campos requeridos del formulario que estás visualizando', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');

        const missingByClient:Record<number, string[]> = {};

        await Promise.all(clients.map(async (client:any, index:number)=>{
            const missing:string[] = [];

            if(isPersonalComplete(client)){
                const savedPersonal = await updatePersonalInfo(client);

                if(!savedPersonal){
                    missing.push(SECTION_LABELS.personal);
                }
            }else{
                missing.push(SECTION_LABELS.personal);
            }

            if(isContactComplete(client)){
                const savedContact = await updateContactInfo(client);

                if(!savedContact){
                    missing.push(SECTION_LABELS.contact);
                }
            }else{
                missing.push(SECTION_LABELS.contact);
            }

            if(!isFamiliarComplete(client)){
                missing.push(SECTION_LABELS.familiar);
            }

            const savedFamiliar = await saveUpdateRelationships(client);

            if(!savedFamiliar && !missing.includes(SECTION_LABELS.familiar)){
                missing.push(SECTION_LABELS.familiar);
            }

            if(isJobComplete(client)){
                const savedJob = await updateJobsSchools(client);

                if(!savedJob){
                    missing.push(SECTION_LABELS.job);
                }
            }else{
                missing.push(SECTION_LABELS.job);
            }

            const generalComplete = isGeneralComplete(client);
            const hasMinimumGeneralData = !!client.generalInformation.residence.fullName
                && !!client.generalInformation.residence.celPhone;

            if(!generalComplete){
                missing.push(SECTION_LABELS.general);
            }

            if(hasMinimumGeneralData){
                const savedGeneral = await saveGeneralInfo(client, generalComplete && missing.length === 0);

                if(!savedGeneral && !missing.includes(SECTION_LABELS.general)){
                    missing.push(SECTION_LABELS.general);
                }
            }

            await saveSocialNetworks(client);

            if(missing.length > 0){
                missingByClient[index] = missing;
            }
        }));

        setMissingData(missingByClient);
        loader.current?.handleClose();

        if(Object.keys(missingByClient).length === 0){
            Toast.fire('Correcto', 'Se guardaron los datos correctamente', 'success');

            if(userData.role === 'cliente'){
                navigate('/procedures/visa/client/list');
            }else{
                navigate('/procedures/visa/list');
            }

            removeFromStorage('clients', 'local');

            return;
        }

        Toast.fire('Alerta', 'Se guardó tu avance. Aún hay datos pendientes por completar.', 'warning');
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
                    {Object.keys(missingData).length > 0 && (
                        <Message type="warning" showIcon className="mb-2">
                            <strong>Guardado parcial:</strong> se guardó lo que ya estaba completo, pero faltan datos por capturar.
                            <ul className="m-0 mt-1">
                                {Object.entries(missingData).map(([index, sections])=>
                                    <li key={index}>Cliente {parseInt(index)+1}: {sections.join(', ')}</li>
                                )}
                            </ul>
                        </Message>
                    )}
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