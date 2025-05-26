import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Table, { Columns } from "../../common/Table";
import Input from "../../common/Input";
import { IApp } from "../../../utils/interfaces/function";
import { processDs160Update } from "../../../utils/services/process";
import Toast from "../../common/Toast";

interface DSTable {
    process_id: number,
    client_id: number,
    client:string,
    ds160: string
}

interface Props extends IApp{
    id: number,
    onLoad: (id:number) => void
}

const ModalDS160 = forwardRef(({loader, id, onLoad}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<DSTable[]>([]);
    const columns:Columns[] = [
        {key:'client', title:'Nombre', grow:2, render:(row: DSTable) => row.client},
        {key:'ds160', title:'DS160', grow:2, render:(row: DSTable) => 
            <Input value={row.ds160} onChange={(e:any)=>handleChange(e, row.client_id)} />
        },
    ]

    const handleShow = (list:any)=>{
        setOpen(true);
        setData(list);
    }

    const handleClose = ()=>{
        setOpen(false);
        setData([]);
    }

    const handleChange = (e:React.FormEvent<HTMLInputElement>, id:number)=>{
        const {value} = e.currentTarget;

        const items = data.map((item:DSTable)=>{
            if(id === item.client_id){
                item = {
                    ...item,
                    ds160: value
                }
            }

            return item;
        })

        setData(items);
    }

    const handleSubmit = async ()=>{

        let items:any = [];

        data.forEach((item)=>{
            const element = {
                process_id: item.process_id,
                ds_160: item.ds160
            };

            if(item.ds160 !== ''){
                items.push(element);
            }
        });

        if(items.length > 0){
            
            loader.current?.handleShow('Actualizando...');

            const response = await processDs160Update(items);

            loader.current?.handleClose();
            
            if(response && response.success){
                Toast.fire('Correcto', response.message, 'success');
                handleClose();
                onLoad(id);
                return;
            }

            Toast.fire('Error', response.message, 'error');
        }

        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Registrar DS160 a usuarios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24}>
                            <Table 
                                columns={columns}
                                data={data}
                                autoHeight
                            />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-3">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button appearance="primary" onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalDS160;