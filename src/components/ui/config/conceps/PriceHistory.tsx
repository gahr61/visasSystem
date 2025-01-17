import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Table, { Columns } from "../../../common/Table";
import { PriceHistory } from "../../../../utils/interfaces/system";
import moment from "moment";
import { IApp } from "../../../../utils/interfaces/function";
import { conceptsHistory } from "../../../../utils/services/concepts";

const ModalPriceHistory = forwardRef(({loader}:IApp, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<PriceHistory[]>([]); 
    const [name, setName] = useState('');

    const columns: Columns[] = [
         {key:'price', title:'Precio', grow:2, render:(row: PriceHistory)=>row.price},
         {key:'price', title:'Precio', grow:2, render:(row: PriceHistory)=>moment(row.date).format('DD/MM/YYYY')}
    ]

    const handleShow = async (id: number, name: string)=>{
        loader.current?.handleShow('Cargando...');

        const response = await conceptsHistory(id);

        loader.current?.handleClose();
        if(response && response.success){
            setData(response.data);
        }
        setName(name);
        setOpen(true);

    }

    const handleClose = ()=>{
        setOpen(false);
        setName('');
        setData([]);
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Historial de precios - {name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24}>
                            <Table 
                                columns={columns}
                                data={data}
                            />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
        </Modal>
    )
});

export default ModalPriceHistory;