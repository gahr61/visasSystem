import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Col, Pagination, Row } from "rsuite";
import moment from "moment";

import { FaFileAlt, FaTrashAlt } from "react-icons/fa";
import { FaCheck, FaEnvelope, FaInfo, FaShare } from "react-icons/fa6";

import Content from "../../../components/common/Content";
import ButtonTable from "../../../components/common/ButtonTable";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import ModalSendVisaTicket from "../../../components/ui/modals/SendVisaTicket";
import ModalConfirmVisaPayment from "../../../components/ui/modals/ConfirmVisaPayment";
import ModalInfoVisa from "../../../components/ui/modals/InfoVisa";

import { Column } from "../../../utils/interfaces/system";
import { IApp } from "../../../utils/interfaces/function";
import { Procedure } from "../../../utils/interfaces/procedure";
import { visasSalesList, VisaListParams } from "../../../utils/services/sales/visa";
import { usePermissionsStore } from "../../../utils/stores/usePermissionsStore";
import { useUserStore } from "../../../utils/stores/useUserStore";

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
    folio: string;
    date: string;
    no_applicants: string;
    client: string;
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
        {key:'folio', title:'Folio', grow:1, render:(row: Procedure)=> row.folio },
        {key:'date', title:'Fecha', grow:1, render:(row: Procedure)=> moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY') },
        {key:'applicant', title:'No. Solicitantes', grow:1, render:(row: Procedure)=> row.no_applicants.toString() },
        {key:'client', title:'Cliente', grow:2, render:(row: Procedure)=> row.client },
        {key:'email', title:'Correo', grow:1, render:(row: Procedure)=> row.email },
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

    const [data, setData] = useState<Procedure[]>([]);
    const [filters, setFilters] = useState<Filters>({
        folio: '',
        date: '',
        no_applicants: '',
        client: '',
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
                                <Input id="filter_folio" value={filters.folio} onChange={onTextFilterChange('folio')} placeholder="Folio" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input id="filter_date" value={filters.date} onChange={onTextFilterChange('date')} placeholder="DD/MM/AAAA" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input id="filter_no_applicants" value={filters.no_applicants} onChange={onTextFilterChange('no_applicants')} placeholder="No. Solicitantes" />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Input id="filter_client" value={filters.client} onChange={onTextFilterChange('client')} placeholder="Cliente" />
                            </div>
                            <div style={{ flex: 1 }}>
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
            </>
        </Content>
    )
}

export default VisasList;