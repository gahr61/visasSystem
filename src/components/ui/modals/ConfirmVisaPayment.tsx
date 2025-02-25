import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Col, Grid, Modal, Row, Uploader } from "rsuite";
import { Link } from "react-router-dom";

import { FaUpload } from "react-icons/fa6";

import Table, { Columns } from "../../common/Table";
import Button from "../../common/Button";
import Toast from "../../common/Toast";
import ButtonTable from "../../common/ButtonTable";
import ModalFilePreview from "./FilePreview";

import { visaSalesPaymentList, visaSalesPaymentUpdate } from "../../../utils/services/sales/visa";
import { IApp } from "../../../utils/interfaces/function";

interface Props extends IApp {
    getList: ()=>void
}

export type ConfirmList = {
    id: number,
    client: string,
    ticket: any,
    confirm: boolean,
    is_confirmed: boolean,
    sales_id: number,
    clients_id: number,
    file?:any
};

interface ModalPreviewProps {
    handleShow: (file: any, isFile: boolean, id?:number) => void
}

const host_file = import.meta.env.VITE_FILES;

const ModalConfirmVisaPayment = forwardRef(({loader, getList}:Props, ref)=>{
    const previewModal = useRef<ModalPreviewProps>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<ConfirmList[]>([]);
    const [canConfirm, setCanConfirm] = useState(true);

    const columns: Columns[] = [
        {key:'client', title:'Cliente', grow:2, render:(row:ConfirmList) => row.client},
        {key: 'image', title:'Ticket', grow:2, render:(row:ConfirmList) => 
            <>
                {row.ticket !== null ? (
                    <div className="w-14 h-12">
                        {row.ticket.indexOf('pdf') === -1 ?
                            <img src={row.ticket} className="w-full cursor-pointer" onClick={(e)=>onOpenPreviewFile(e, row.ticket, row.id)} />
                        :
                            <Link to="" onClick={(e)=>onOpenPreviewFile(e, row.ticket, row.id)}>Ticket</Link>
                        }                        
                    </div>

                ): row.file.length > 0 ?
                    <Link to="" onClick={(e)=>onOpenPreviewFile(e, row.file)} >{row.file[0].blobFile.name}</Link>
                :
                    <Uploader 
                        fileList={row.file} 
                        action="" 
                        onChange={(e:any)=>onLoadFile(e, row.id)} 
                        autoUpload={false}
                        accept=".pdf, .png, .jpeg"
                    >
                        <ButtonTable 
                            controlId="upload"
                            title="Cargar archivo"
                            icon={<FaUpload />}
                        />
                    </Uploader>
                }
            </>
        },
        {key:'confirmed', title:'Confirmado', grow:1, render:(row: ConfirmList) => 
            row.is_confirmed ? 
                'Confirmado'
            :
                <div className="flex items-center h-full">
                    <div>
                        <input 
                            type="checkbox" 
                            checked={row.confirm} 
                            onChange={(e) => onChangeCheckConfirm(e.currentTarget.checked, row.id)} 
                            disabled={row.file.length > 0 || row.ticket === null}
                        />
                    </div>                    
                </div>            
        }
    ]

    const handleShow = async (id:number)=>{
        getData(id);
    }

    const handleCloseModal = ()=>{
        setOpen(false);
        getList();
    }

    const getData = async (id: number) => {
        loader.current?.handleShow('Cargando...');

        let response = await visaSalesPaymentList(id);

        loader.current?.handleClose();

        if(response && response.success){
            let isConfirmed = 0;

            const items: ConfirmList[] = response.data.salesClients.map((data: any)=>{
                const item = {
                    id: data.id,
                    client: data.names+' '+data.lastname1+(data.lastname2 !== null ? ' '+data.lastname2 : ''),
                    ticket: data.ticket !== null ? host_file + data.ticket : null,
                    confirm: data.is_confirmed,
                    is_confirmed: data.is_confirmed,
                    sales_id: data.sales_id,
                    clients_id: data.clients_id,
                    file:[]
                };

                if(data.is_confirmed){
                    isConfirmed++
                }

                return item;
            });

            console.log(response.data.canConfirm, isConfirmed)
            setCanConfirm(response.data.canConfirm || isConfirmed);

            setList(items);
            

        }
        await setOpen(true);
    }

    const onLoadFile = (e:any, id:number)=>{
        const dataList = list.map((item)=>{
            if(item.id === id){
                item = {...item, file: e, confirm: true}
            }

            return item;
        });

        setList(dataList);
    }

    const onChangeCheckConfirm = (value: boolean, id: number) => {
        const items = list.map((data) => {
            if(id === data.id){
                data = {
                    ...data,
                    confirm: value
                }
            }

            return data;
        });

        console.log(items)

        setList(items);
    }

    const onConfirmPayment = async ()=>{
        let error = '';
        let countConfirm = 0;

        let obj = new FormData();
        list.forEach((data, index)=>{
            obj.append('salesPayment['+index+'][id]', data.id.toString());
            obj.append('salesPayment['+index+'][is_confirmed]', data.confirm ? '1' : '0');
            obj.append('salesPayment['+index+'][clients_id]', data.clients_id.toString());
            obj.append('salesPayment['+index+'][sales_id]', data.sales_id.toString());

            if(data.file.length > 0){
                obj.append('salesPayment['+index+'][files][0]', data.file[0].blobFile);
            }
            

            if(data.ticket === ''){
                if(data.file.length === 0){
                    error = 'No es posible confirmar los datos, debe cargar el archivo'
                }
            }

            if(data.confirm){
                countConfirm++;
            }
        });

        if(countConfirm === list.length - 1){
            Toast.fire('Error', 'No es posible confirmar, debe marcar las casillas de confirmación', 'error');
            return;
        }

        if(error !== ''){
            Toast.fire('Error', error, 'error');
            return;
        }

        setOpen(false);
        loader.current?.handleShow('Confirmando...');

        let response = await visaSalesPaymentUpdate(obj);

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            handleCloseModal();
            return;
        }

        setOpen(true);
        Toast.fire('ERror', response.message, 'error');
    }

    const onOpenPreviewFile = (e:any,  file:any, id?:number)=>{
        e.preventDefault();

        let urlFile = '';
        let isFile = false;
        if(typeof file === 'string'){
            urlFile = file;
            isFile = file.indexOf('pdf') !== -1;
        }else{
            urlFile = URL.createObjectURL(file[0].blobFile);
            isFile = file[0].name.indexOf('pdf') !== -1;
        }
        

        setOpen(false);
        console.log(file, id)
        previewModal.current?.handleShow(urlFile, isFile, id);
        
    } 

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return (
        <>
        <Modal open={open} onClose={handleCloseModal} backdrop="static">
            <Modal.Header>
                <Modal.Title>Confirmar pago de ficha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24}>
                            <Table 
                                columns={columns}
                                data={list}
                            />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleCloseModal}>Cerrar</Button>
                    {canConfirm && (
                        <Button onClick={onConfirmPayment}>Confirmar</Button>
                    )}
                    
                </div>
            </Modal.Footer>
        </Modal>

        <ModalFilePreview showPreview={setOpen} onChange={onChangeCheckConfirm} ref={previewModal} />
        </>
    )
});

export default ModalConfirmVisaPayment;