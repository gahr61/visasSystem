import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Col, Pagination, Row, Tooltip, Whisper } from "rsuite";

import { FaFileAlt, FaPrint, FaTrashAlt } from "react-icons/fa";
import { FaCheck, FaEnvelope, FaInfo, FaShare } from "react-icons/fa6";

import Content from "../../../components/common/Content";
import ButtonTable from "../../../components/common/ButtonTable";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import ModalSendVisaTicket from "../../../components/ui/modals/SendVisaTicket";
import ModalConfirmVisaPayment from "../../../components/ui/modals/ConfirmVisaPayment";
import ModalInfoVisa from "../../../components/ui/modals/InfoVisa";
import VisaDetailPrint from "../../../components/ui/procedures/visa/VisaDetailPrint";

import { Column } from "../../../utils/interfaces/system";
import { IApp } from "../../../utils/interfaces/function";
import { Procedure, VisaAccount } from "../../../utils/interfaces/procedure";
import { visasSalesList, visaAccountPassword, VisaListParams } from "../../../utils/services/sales/visa";
import { visasInfoDetails } from "../../../utils/services/sales/procedures";
import { usePermissionsStore } from "../../../utils/stores/usePermissionsStore";
import { useUserStore } from "../../../utils/stores/useUserStore";
import moment from "moment";

const AccountCell = ({ row, canViewPassword }: { row: Procedure, canViewPassword: boolean }) => {
    const [accounts, setAccounts] = useState<VisaAccount[] | null>(null);
    const [loading, setLoading] = useState(false);

    if(!row.account_email){
        return <span className="text-gray-400">—</span>;
    }

    if(!canViewPassword){
        return <span className="text-xs">{row.account_email}</span>;
    }

    const onOpen = async () => {
        if(accounts !== null || loading) return;

        setLoading(true);
        const response = await visaAccountPassword(row.id);
        setLoading(false);
        setAccounts(response?.success ? response.data : []);
    }

    return (
        <Whisper
            placement="top"
            trigger="hover"
            onOpen={onOpen}
            speaker={
                <Tooltip>
                    {loading && <span className="text-xs">Cargando...</span>}
                    {!loading && accounts && accounts.length === 0 && (
                        <span className="text-xs">Sin contraseña registrada</span>
                    )}
                    {!loading && accounts && accounts.length > 0 && (
                        <div className="flex flex-col gap-1 text-start">
                            {accounts.map((account, index) =>
                                <span className="text-xs" key={index}>
                                    {account.client && <strong>{account.client}: </strong>}
                                    {account.email} — <strong>{account.password}</strong>
                                </span>
                            )}
                        </div>
                    )}
                </Tooltip>
            }
        >
            <span className="cursor-help underline decoration-dotted decoration-gray-400 text-blue-600 text-xs">
                {row.account_email}
            </span>
        </Whisper>
    );
}

type ModalTicket = {
    handleShow: (id: number, type: string, option:string) => void
}

type ModalConfirm = {
    handleShow: (id: number) => void
}

type ModalDetails = {
    handleShow: (id: number)=>void
}

type Filters = {
    no_applicants: string;
    client: string;
    ds_160: string;
    email: string;
    status: string;
}

const VisasList = ({loader}:IApp)=>{
    const userData = useUserStore(store => store.user);
        
    if(userData.role === 'cliente'){
        <Navigate to="/procedure/visa/client/list" replace />
    }

    const hasPermission = usePermissionsStore(state => state.hasPermission);

    if(!hasPermission('procedure_visa')){
        <Navigate to="/" />
    }


    const navigate = useNavigate();
    const ticketModal = useRef<ModalTicket>(null);
    const confirmModal = useRef<ModalConfirm>(null);
    const detailsModal = useRef<ModalDetails>(null);

    const height = (window.innerHeight - 260) - (document.getElementById('header-content')?.offsetHeight || 60);
    
    const columns:Column[]= [
        {key:'applicant', title:'No. Solicitantes', grow:1, render:(row: Procedure)=> row.no_applicants.toString() },
        {key:'client', title:'Cliente', grow:2, render:(row: Procedure)=> row.client },
        {key:'ds_160', title:'DS-160', grow:1, render:(row: Procedure)=>
            row.ds_160
                ? <span className="font-mono text-xs">{row.ds_160}</span>
                : <span className="text-gray-400">—</span>
        },
        {key:'account', title:'Correo', grow:2, render:(row: Procedure)=>
            <AccountCell row={row} canViewPassword={hasPermission('procedure_visa_view_password')} />
        },
        {key:'status', title:'Estatus', grow:1, render:(row: Procedure)=> row.status },
        {key:'', title:'Acciones', grow:1, render:(row: Procedure)=>
            <div className="flex gap-2">
                <ButtonTable
                    title="Detalles"
                    controlId="details"
                    icon={<FaInfo />}
                    onClick={()=>onOpenInfo(row.id)}
                />

                <ButtonTable
                    title="Vista previa / Imprimir"
                    controlId="print"
                    icon={<FaPrint />}
                    onClick={() => onOpenPrint(row.id)}
                />

                <ButtonTable
                    title="Enviar formulario"
                    placement="bottom"
                    controlId="send_form"
                    icon={<FaFileAlt />}
                    options={[
                        {key:1, label:'Enviar formulario'},
                        {key:2, label:'Llenar formulario'}
                    ]}
                    //onClick={()=>navigate('/procedures/visa/'+row.id+'/details')}
                    onSelect={(option)=>onOpenDetails(row, option)}
                />

                {row.status === 'Ficha pendiente' && (
                    <ButtonTable
                        title="Enviar ficha"
                        placement="bottom"
                        controlId="send_ticket"
                        icon={<FaEnvelope />}
                        options={[
                            {key:1, label:'Enviar ficha'},
                            {key:2, label:'Entregar ficha'}
                        ]}
                        onClick={()=>{}}
                        onSelect={(option)=>onSendTicket(row, option)}
                    />
                )}

                {row.status === 'Con ficha' && (
                    <>
                        <ButtonTable
                            title="Reenviar ficha"
                            placement="bottom"
                            controlId="resend_ticket"
                            icon={<FaShare />}
                            options={[
                                {key:1, label:'Enviar ficha'},
                                {key:2, label:'Entregar ficha'}
                            ]}
                            onClick={()=>{}}
                            onSelect={(option)=>onSendTicket(row, option)}
                        />
                        <ButtonTable
                            title="Confirmar pago de ficha"
                            controlId="confirm"
                            icon={<FaCheck />}
                            onClick={()=>onConfirmTicket(row.id)}
                        />
                    </>
                )}
                
                {hasPermission('procedure_visa_delete') && (
                    <ButtonTable 
                        title="Eliminar"
                        controlId="delete"
                        icon={<FaTrashAlt />}
                        onClick={()=>{}}
                    />
                )}
                
            </div>
        },
    ];

    const [printState, setPrintState] = useState<{
        show: boolean; clients: any[]; saleStatus: string; saleType: string; saleFolio: string;
    }>({ show: false, clients: [], saleStatus: '', saleType: '', saleFolio: '' });

    const [data, setData] = useState<Procedure[]>([]);
    const [filters, setFilters] = useState<Filters>({
        no_applicants: '',
        client: '',
        ds_160: '',
        email: '',
        status: ''
    });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [total, setTotal] = useState(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getList = async (f: Filters, p: number, pp: number) => {
        loader.current?.handleShow('Cargando...');
        const params: VisaListParams = { ...f, page: p, per_page: pp };
        const response = await visasSalesList(params);
        loader.current?.handleClose();
        if(response?.success) {
            setData(response.data);
            setTotal(response.meta.total);
        }
    };

    const onTextFilterChange = (key: keyof Omit<Filters, 'status'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setPage(1);
        if(debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => getList(newFilters, 1, perPage), 400);
    };

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, status: e.target.value };
        setFilters(newFilters);
        setPage(1);
        getList(newFilters, 1, perPage);
    };

    const onPageChange = (p: number) => {
        setPage(p);
        getList(filters, p, perPage);
    };

    const onLimitChange = (pp: number) => {
        setPerPage(pp);
        setPage(1);
        getList(filters, 1, pp);
    };

    const onOpenInfo = (id: number) => {
        detailsModal.current?.handleShow(id);
    }

    const onSendTicket = (row: Procedure, option:number)=>{
        if(option === 1){
            ticketModal.current?.handleShow(row.id, 'visa', 'send');
        }else{
            ticketModal.current?.handleShow(row.id, 'visa', 'deliver');
        }
    }

    const onOpenDetails = (row:Procedure, option:number)=>{
        if(option === 1){
            handleSendMessageApp(row.phone);
        }else{
            navigate('/procedures/visa/'+row.id+'/details');
        }
    }
    
    const onConfirmTicket = (id: number)=>{
        confirmModal.current?.handleShow(id);
    }

    const onOpenPrint = async (id: number) => {
        loader.current?.handleShow('Cargando...');
        const response = await visasInfoDetails(String(id));
        loader.current?.handleClose();

        if (!response?.success) return;

        const spouseRelationships = ['esposo', 'esposa', 'conyuge'];

        const mapped = response.data.clients.map((item: any) => {
            const spouseEntry = (item.parents || []).find((p:any) => spouseRelationships.includes((p.relationship || '').toLowerCase()));
            const otherRelationships = (item.parents || []).filter((p:any) => !spouseRelationships.includes((p.relationship || '').toLowerCase()));

            return {
            personalInformation: {
                id: item.id,
                names: item.names || '',
                lastname1: item.lastname1 || '',
                lastname2: item.lastname2 || '',
                birthdate: item.birthdate || '',
                sex: item.sex || '',
                curp: item.curp || '',
                civilStatus: item.civil_status || '',
                languages: item.languages || [],
                birthplace: {
                    country: item.country_birth_id || 42,
                    state: item.state_birth_id || '',
                    city: item.city_birth || '',
                    nationality: item.nationality || '',
                },
                passport: {
                    id: item.passport?.id || '',
                    number: item.passport?.number || '',
                    expedition_date: item.passport?.expedition_date || '',
                    expiration_date: item.passport?.expiration_date || '',
                    country_expedition: item.passport?.expedition_countries_id || 42,
                    state_expedition: item.passport?.expedition_states_id || '',
                    city_expedition: item.passport?.expedition_city || '',
                },
                spouse: {
                    names: spouseEntry?.full_name || '',
                    birthdate: spouseEntry?.birthdate || '',
                    country: spouseEntry?.country_birth_id || '',
                    state: spouseEntry?.state_birth_id || '',
                    hasVisa: spouseEntry?.has_visa ? '1' : '0',
                },
            },
            contactInformation: {
                address: item.address ? {
                    street: item.address.street || '',
                    noInt: item.address.int_number || '',
                    noExt: item.address.ext_number || '',
                    postCode: item.address.postal_code || '',
                    colony: item.address.colony || '',
                    city: item.address.city || '',
                    country: item.address.countries_id || '',
                    state: item.address.states_id || '',
                } : {},
                phones: item.phones || [],
            },
            familiarInformation: {
                relationships: otherRelationships.map((p: any) => ({
                    ...p,
                    birthdate: p.birthdate ? moment(p.birthdate).format('DD/MM/YYYY') : '',
                    hasVisa: p.has_visa ? 'Si' : 'No',
                    livesInUsa: p.lives_in_usa ? 'Si' : 'No',
                })),
            },
            jobsSchools: {
                occupation: item.occupation?.occupations_id || '',
                occupationName: item.occupation?.name || '',
                salary: item.occupation?.salary || '',
                antiquity: item.occupation?.antiquity || '',
                activitiesDescription: item.occupation?.activities_description || '',
                address: item.occupation ? {
                    street: item.occupation.street || '',
                    noExt: item.occupation.ext_number || '',
                    colony: item.occupation.colony || '',
                    city: item.occupation.city || '',
                } : {},
                schools: (item.studies || []).map((school:any) => ({
                    name: school.name,
                    degree_level: school.degree_level || '',
                    is_last_degree: !!school.is_last_degree,
                    period: school.period,
                    address: {
                        street: school.street || '',
                        colony: school.colony || '',
                        city: school.city || '',
                    }
                })),
            },
            generalInformation: {
                residence: {
                    fullName: item.residence?.full_name || '',
                    relationship: item.residence?.relationship || '',
                    citizen_status: item.residence?.citizen_status || '',
                    personalPhone: item.residence?.personal_phone || '',
                    workPhone: item.residence?.work_phone || '',
                    celPhone: item.residence?.cel_phone || '',
                },
                history: {
                    tryProcedureVisa: item.process_history?.has_tried_visa ? '1' : '0',
                    procedureDate: item.process_history?.date || '',
                    visaApproved: item.process_details?.visa_approved ? '1' : '0',
                },
                visa: {
                    lastVisa: item.visa_history?.number || '',
                    expeditionDate: item.visa_history?.expedition_date || '',
                    expirationDate: item.visa_history?.expiration_date || '',
                },
                details: {
                    travel_date: item.process_details?.travel_date || '',
                    addressEEUU: {
                        street: item.process_details?.street_eeuu || '',
                        number: item.process_details?.number_eeuu || '',
                        city: item.process_details?.city_eeuu || '',
                        state: item.process_details?.state_eeuu || '',
                        zip: item.process_details?.zip_eeuu || '',
                    },
                    travelDateEEUU: item.process_details?.travel_date_eeuu || '',
                    timeEEUU: item.process_details?.time_stay_eeuu || '',
                    travelReason: item.process_details?.travel_reason || '',
                    coverExpenses: item.process_details?.cover_expenses || '',
                    has_visit_eeuu: item.process_details?.has_visit_eeuu ? '1' : '0',
                    lastVisit: item.process_details?.date_visit_eeuu || '',
                    dateLastVisit: item.process_details?.time_visit_eeuu || '',
                    other_countries: item.process_details?.travel_before_countries ? '1' : '0',
                    travelCountries: item.process_details?.travel_countries || '',
                    observations: item.process_details?.observations || '',
                    clave_ds_160: item.process_details?.clave_ds_160 || '',
                    socialNetworks: item.social || [],
                },
                appointments: {
                    cas: item.cas ? { date: item.cas.appointment_date, time: item.cas.schedule, city: item.cas.city } : null,
                    consulado: item.consulado ? { date: item.consulado.appointment_date, time: item.consulado.schedule, city: item.consulado.city } : null,
                },
            },
            process_id: item.process?.id || null,
            account_email: item.account?.email || '',
            };
        });

        setPrintState({
            show: true,
            clients: mapped,
            saleStatus: response.data.sale_status || '',
            saleType: response.data.sale_type || '',
            saleFolio: response.data.sale_folio || '',
        });
    };

    const handleSendMessageApp = (phone: string)=>{
        const number = phone.replace(/-/g, '');

        const phoneNumber = '521'+number;
       
        const message = 'Hola, para continuar con el proceso, por favor ingresa al siguiente enlace, '+
                        'inicia sesión en la plataforma y llena el formulario correspondiente: '+
                        window.location.origin;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');

    }

    useEffect(()=>{
        getList(filters, 1, 25);
    },[]);

    return(
        <Content
            url="/procedures/visa/list"
            page="Visas"
            subpage="Listado"
            title="Visas - Listado"
        >
            <>
                <Row className="mb-1">
                    <Col xs={20}>
                        <div className="flex gap-2">
                            <div style={{ flex: 1 }}>
                                <Input id="filter_no_applicants" value={filters.no_applicants} onChange={onTextFilterChange('no_applicants')} placeholder="No. Solicitantes" />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Input id="filter_client" value={filters.client} onChange={onTextFilterChange('client')} placeholder="Cliente" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input id="filter_ds_160" value={filters.ds_160} onChange={onTextFilterChange('ds_160')} placeholder="DS-160" />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Input id="filter_email" value={filters.email} onChange={onTextFilterChange('email')} placeholder="Correo" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <select
                                    value={filters.status}
                                    onChange={onStatusChange}
                                    className="py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="">Todos</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Ficha pendiente">Ficha pendiente</option>
                                    <option value="Con ficha">Con ficha</option>
                                    <option value="Ficha pagada">Ficha pagada</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </Col>
                    <Col xs={4} className="flex justify-end">
                        <Button onClick={()=>navigate('/procedures/visa/new')}>Nuevo</Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    data={data}
                    height={height}
                />

                <Row className="mt-2">
                    <Col xs={24} className="flex justify-end">
                        <Pagination
                            total={total}
                            limit={perPage}
                            limitOptions={[10, 25, 50, 100]}
                            activePage={page}
                            onChangePage={onPageChange}
                            onChangeLimit={onLimitChange}
                            layout={['total', '-', 'pager', '|', 'limit']}
                        />
                    </Col>
                </Row>

                <ModalSendVisaTicket loader={loader} getList={() => getList(filters, page, perPage)} ref={ticketModal} />
                <ModalConfirmVisaPayment loader={loader} getList={() => getList(filters, page, perPage)} ref={confirmModal} />
                <ModalInfoVisa loader={loader} ref={detailsModal} />
                <VisaDetailPrint
                    open={printState.show}
                    onClose={() => setPrintState(s => ({ ...s, show: false }))}
                    clients={printState.clients}
                    saleStatus={printState.saleStatus}
                    saleType={printState.saleType}
                    saleFolio={printState.saleFolio}
                />
            </>
        </Content>
    )
}

export default VisasList;