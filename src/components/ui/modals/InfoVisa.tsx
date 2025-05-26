import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import { SalesClientsInfo, SalesInfo } from "../../../utils/interfaces/sales";
import { visasSalesInfo } from "../../../utils/services/sales/visa";
import { IApp } from "../../../utils/interfaces/function";
import moment from "moment";
import { encryptString, formatPrice } from "../../../utils/functions";
import { FaDollarSign, FaHandHoldingDollar } from "react-icons/fa6";
import ButtonTable from "../../common/ButtonTable";
import { AiOutlineFileSearch } from "react-icons/ai";
import { RiUserAddLine } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";
import { RiFileUserLine } from "react-icons/ri";

import Table, { Columns } from "../../common/Table";
import { useNavigate } from "react-router-dom";
import ModalDS160 from "./DS160Form";
import ModalAccount from "./AccountData";

type ModalUpdateRef = {
    handleShow:(list:any)=>void
}

const ModalInfoVisa = forwardRef(({loader}:IApp, ref) => {
    const dsRef = useRef<ModalUpdateRef>(null);
    const accountRef = useRef<ModalUpdateRef>(null);

    const navigate = useNavigate();

    const [columns, setColumns] = useState<Columns[]> ([
        {key:'client', title:'Nombre', grow:2, render:(row: SalesClientsInfo) => row.names+' '+row.lastname1+(row.lastname2 !== null ? ' '+row.lastname2 : '')},
        {key:'procedure', title:'Trámite', grow:3, render:(row:SalesClientsInfo) => 
            (row.visa_type !== null ? row.visa_type+' - ' : '')
            +row.subtype+' - '+row.age_type+
            (row.option_type !== null ? ' - '+row.option_type : '')
        },
        {key:'email', title:'Correo', grow:3, render:(row: SalesClientsInfo) => row.email !== null ? row.email : '' },
        {key:'ds160', title:'DS160', grow:1, render:(row:SalesClientsInfo) => row.ds_160},
        {key:'status', title:'Estatus', grow:1, render:(row:SalesClientsInfo) => row.complete ? 'Completo' : 'Incompleto'}
    ]);
    const [open, setOpen] = useState(false);
    const [sale, setSale] = useState<SalesInfo>({
        id:-1,
        branch_office:'',
        folio:'',
        date:'',
        total:'',
        advance_payment:'',
        payable: '',
        email:'',
        names:'',
        lastname1:'',
        lastname2:'',
        phone:'',
        clients:[],
        type:''
    });
    
    const handleShow = async (id:number)=>{
        await onLoadDataInfo(id);
        setOpen(true);
    }

    const onLoadDataInfo = async (id:number)=>{
        loader.current?.handleShow('Cargando...');

        let response = await visasSalesInfo(id);
        
        loader.current?.handleClose();

        if(response && response.success){
            const position = columns.length - 2;
            let dataColumns = columns;

            response.data = {
                ...response.data,
                clients: response.data.clients.map((client)=>{ 
                    client.schedule.forEach((data)=>{
                        const find = dataColumns.find(obj => obj.key.toLowerCase() === data.schedule.toLocaleLowerCase());
                        if(!find){
                            const column = {
                                key: data.schedule.toLocaleLowerCase(),
                                title: data.schedule,
                                grow: 2,
                                render:(row: any)=>row['schedule_'+data.schedule.toLowerCase()]
                            };
                            dataColumns.splice(position, 0, column)
    
                            client = {
                                ...client,
                                ['schedule_'+data.schedule.toLowerCase()]: data.office+' - '+moment(data.appointment_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            };
    
                            console.log(client, 'client')
                        }else{
                            client = {
                                ...client,
                                ['schedule_'+data.schedule.toLowerCase()]: data.office+' - '+moment(data.appointment_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            };
                        }
                        
                    })

                    return client;
                })
            }
            
            setColumns(dataColumns);

            setSale({
                ...response.data,
                date: moment(response.data.date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            });

        }
    }

    const handleClose = ()=>{
        setOpen(false);
        setColumns([
            {key:'client', title:'Nombre', grow:2, render:(row: SalesClientsInfo) => row.names+' '+row.lastname1+(row.lastname2 !== null ? ' '+row.lastname2 : '')},
            {key:'procedure', title:'Trámite', grow:3, render:(row:SalesClientsInfo) => 
                (row.visa_type !== null ? row.visa_type+' - ' : '')
                +row.subtype+' - '+row.age_type+
                (row.option_type !== null ? ' - '+row.option_type : '')
            },
            {key:'email', title:'Correo', grow:3, render:(row: SalesClientsInfo) => row.email !== null ? row.email : '' },
            {key:'ds160', title:'DS160', grow:1, render:(row:SalesClientsInfo) => row.ds_160},
            {key:'status', title:'Estatus', grow:1, render:(row:SalesClientsInfo) => row.complete ? 'Completo' : 'Incompleto'}
        ]);
        setSale({
            id:-1,
            branch_office:'',
            folio:'',
            date:'',
            total:'',
            advance_payment:'',
            payable: '',
            email:'',
            names:'',
            lastname1:'',
            lastname2:'',
            phone:'',
            clients:[],
            type:''
        })
    };

    const handleOpenFormDetails = ()=>{
        navigate('/procedures/visa/'+sale.id+'/details');
        handleClose();
    }

    const handleAddDs160 = ()=>{
         let list:any = [];
         
         sale.clients.forEach((client)=>{
            //if(client.ds_160 === null){
                const item = {
                    process_id: client.process_id,
                    client_id: client.clients_id,
                    client: client.names+' '+client.lastname1+(client.lastname2 !== null ? ' '+client.lastname2 : ''),
                    ds160: client.ds_160 || ''
                }

                list.push(item);
            //}
        })

         dsRef.current?.handleShow(list);
    }

    const handleOpenAccountModal = ()=>{
        let list:any = [];
         
         sale.clients.forEach((client)=>{
                const item = {
                    process_id: client.process_id,
                    client_id: client.clients_id,
                    client: client.names+' '+client.lastname1+(client.lastname2 !== null ? ' '+client.lastname2 : ''),
                    user: client.email,
                    password: client.password ? encryptString(client.password) : ''
                }

                list.push(item);
        })

         accountRef.current?.handleShow(list);
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <>
        <Modal size={'80%'} open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Detalles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <fieldset>
                        <legend className="text-lg font-bold">Trámite</legend>
                        <Row>
                            <Col xs={24} lg={8}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Tipo de trámite</label>
                                    <span>{sale.type}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className="flex items-end">                            
                            <Col xs={24} lg={8}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Oficina</label>
                                    <span>{sale.branch_office}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={6}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Folio</label>
                                    <span>{sale.folio}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={4}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Fecha</label>
                                    <span>{sale.date}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={4}>
                                <ButtonTable 
                                    controlId="aditiona_service"
                                    title="Servicios adicionales"
                                    icon={<FaHandHoldingDollar />}
                                    onClick={()=>{}}
                                />
                            </Col>
                        </Row>
                        <Row className="flex items-end">
                            <Col xs={24} lg={8}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Total</label>
                                    <span>{formatPrice(sale.total)}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={6}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Pagado</label>
                                    <span>{formatPrice(sale.advance_payment)}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={4}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Por pagar</label>
                                    <span>{formatPrice(sale.payable)}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={4}>
                                <ButtonTable 
                                    controlId="pay"
                                    title="Abonar"
                                    icon={<FaDollarSign />}
                                    onClick={()=>{}}
                                />
                            </Col>
                        </Row>
                    </fieldset>
                    <hr className="my-2" />
                    <fieldset>
                        <legend className="text-lg font-bold">Contacto</legend>
                        <Row>
                            <Col xs={24} lg={8}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Nombre</label>
                                    <span>
                                        {`${sale.names} ${sale.lastname1} ${sale.lastname2 !== null && ( sale.lastname2)}`}
                                    </span>
                                </div>
                            </Col>
                            <Col xs={24} lg={6}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Correo</label>
                                    <span>{sale.email}</span>
                                </div>
                            </Col>
                            <Col xs={24} lg={6}>
                                <div className="flex flex-col">
                                    <label className="font-semibold">Teléfono</label>
                                    <span>{sale.date}</span>
                                </div>
                            </Col>
                        </Row>
                    </fieldset>
                    <hr className="my-2" />
                    <fieldset>
                        <legend className="text-lg font-bold">Clientes</legend>
                        <div className="flex justify-end gap-2 p-2">
                            <ButtonTable 
                                controlId="add_ds160"
                                title="Agregar DS160"
                                icon={<RiFileUserLine />}
                                onClick={()=>handleAddDs160()}
                            />
                            <ButtonTable 
                                controlId="add_user"
                                title="Agregar usuario"
                                icon={<RiUserAddLine />}
                                onClick={()=>handleOpenAccountModal()}
                            />
                            <ButtonTable 
                                controlId="schedule"
                                title="Agendar cita"
                                icon={<IoCalendarOutline />}
                                onClick={()=>{}}
                            />
                            <ButtonTable 
                                    controlId="details"
                                    title="Detalles"
                                    icon={<AiOutlineFileSearch />}
                                    onClick={()=>handleOpenFormDetails()}
                                />
                        </div>
                        <Row>
                            <Col xs={24}>
                                <Table 
                                    columns={columns}
                                    data={sale.clients}
                                    height={200}
                                />
                            </Col>
                        </Row>
                    </fieldset>
                </Grid>
            </Modal.Body>
        </Modal>

        <ModalDS160 
            id={sale.id}  
            onLoad={onLoadDataInfo}
            loader={loader}
            ref={dsRef} 
        />

        <ModalAccount 
            id={sale.id}  
            onLoad={onLoadDataInfo}
            loader={loader}
            ref={accountRef} 
        />
        </>
    )
});

export default ModalInfoVisa;