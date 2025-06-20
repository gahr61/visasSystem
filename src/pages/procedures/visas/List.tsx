import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row} from "rsuite";
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
import { visasSalesList } from "../../../utils/services/sales/visa";

type ModalTicket = {
    handleShow: (id: number, type: string, option:string) => void
}

type ModalConfirm = {
    handleShow: (id: number) => void
}

type ModalDetails = {
    handleShow: (id: number)=>void
}

const VisasList = ({loader}:IApp)=>{
    const navigate = useNavigate();
    const ticketModal = useRef<ModalTicket>(null);
    const confirmModal = useRef<ModalConfirm>(null);
    const detailsModal = useRef<ModalDetails>(null);

    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);
    
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
                
                {row.status === 'Ficha pagada' && (
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
                )}
                
                <ButtonTable 
                    title="Eliminar"
                    controlId="delete"
                    icon={<FaTrashAlt />}
                    onClick={()=>{}}
                />
            </div>
        },
    ];

    const [data, setData] = useState<Procedure[]>([]);
    const [ search, setSearch ] = useState('');

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

    const getList = async ()=>{
        loader.current?.handleShow('Cargando...');

        let response = await visasSalesList();

        loader.current?.handleClose();

        if(response && response.success){
            setData(response.data);
        }
    }

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
                        'http://localhost:5173';

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blamk');

    }

    useEffect(()=>{
        getList();
    },[]);

    return(
        <Content
            url="/procedures/visa/list"
            page="Visas"
            subpage="Listado"
            title="Visas - Listado"
        >
            <>
                <Row>
                    <Col xs={4}>
                        <Input 
                            id="search"
                            value={search}
                            onChange={onSearch}
                            placeholder="Buscar..."
                        />
                    </Col>
                    <Col xs={4} xsOffset={16} className="flex justify-end">
                        <Button onClick={()=>navigate('/procedures/visa/new')}>Nuevo</Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    data={data}
                    height={height}
                />

                <ModalSendVisaTicket loader={loader} getList={getList} ref={ticketModal} />
                <ModalConfirmVisaPayment loader={loader} getList={getList} ref={confirmModal} />
                <ModalInfoVisa loader={loader} ref={detailsModal} />
            </>
        </Content>
    )
}

export default VisasList;