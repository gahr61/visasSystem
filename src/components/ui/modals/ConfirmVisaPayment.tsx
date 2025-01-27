import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";

import Table, { Columns } from "../../common/Table";
import ModalImage from "./Image";
import Button from "../../common/Button";

import { visaSalesPaymentList, visaSalesPaymentUpdate } from "../../../utils/services/sales/visa";
import { IApp } from "../../../utils/interfaces/function";
import Toast from "../../common/Toast";

interface Props extends IApp {
    getList: ()=>void
}

type ConfirmList = {
    id: number,
    client: string,
    ticket: any,
    confirm: boolean,
    is_confirmed: boolean
};

type ModalImageProps = {
    handleShow: (id:number, ticket: string) => void
}

const host_file = import.meta.env.VITE_FILES;

const ModalConfirmVisaPayment = forwardRef(({loader, getList}:Props, ref)=>{
    const imageModal = useRef<ModalImageProps>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<ConfirmList[]>([]);
    const [canConfirm, setCanConfirm] = useState(true);

    const columns: Columns[] = [
        {key:'client', title:'Cliente', grow:2, render:(row:ConfirmList) => row.client},
        {key: 'image', title:'Ticket', grow:2, render:(row:ConfirmList) => 
            <>
                <div className="w-14 h-12">
                    <img src={row.ticket} className="w-full cursor-pointer" onClick={()=>onOpenModalImage(row.id, row.ticket)} />
                </div>                
            </>
        },
        {key:'confirmed', title:'Confirmado', grow:1, render:(row: ConfirmList) => 
            row.is_confirmed ? 
                'Confirmado'
            :
                <div className="flex items-center h-full">
                    <div>
                        <input type="checkbox" checked={row.confirm} onChange={(e) => onChangeCheckConfirm(e.currentTarget.checked, row.id)} />
                    </div>                    
                </div>            
        }
    ]

    const handleShow = async (id:number)=>{
        loader.current?.handleShow('Cargando...');

        let response = await visaSalesPaymentList(id);

        loader.current?.handleClose();

        if(response && response.success){
            let isConfirmed = 0;

            const items: ConfirmList[] = response.data.salesClients.map((data: any)=>{
                const item = {
                    id: data.id,
                    client: data.names+' '+data.lastname1+(data.lastname2 !== null ? ' '+data.lastname2 : ''),
                    ticket: host_file + data.ticket,
                    confirm: data.is_confirmed,
                    is_confirmed: data.is_confirmed
                };

                if(data.is_confirmed){
                    isConfirmed++
                }

                return item;
            });

            setCanConfirm(response.data.canConfirm || isConfirmed);

            setList(items);
            

        }
        await setOpen(true);
    }

    const handleCloseModal = ()=>{
        setOpen(false);
        getList();
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
        setOpen(false);
        loader.current?.handleShow('Confirmando...');

        let obj = {
            salesPayment: list.map((data)=>{
                let item ={
                    id: data.id,
                    is_confirmed: data.confirm
                };

                return item;
            })
        };

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

    const onOpenModalImage = (id:number, image: string) => {
        imageModal.current?.handleShow(id, image);
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

        <ModalImage onChange={onChangeCheckConfirm} ref={imageModal} />
        </>
    )
});

export default ModalConfirmVisaPayment;