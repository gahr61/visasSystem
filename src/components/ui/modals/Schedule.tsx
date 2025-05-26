import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Table, { Columns } from "../../common/Table";
import Input from "../../common/Input";
import { IApp } from "../../../utils/interfaces/function";
import Toast from "../../common/Toast";
import { scheduleDetailsUpdate } from "../../../utils/services/schedule";

interface ScheduleTable {
    client_id: number,
    client:string,
    consulado: string,
    consulado_time:string;
    cas:string;
    cas_time:string;
}

interface Props extends IApp{
    id: number,
    onLoad: (id:number) => void
}

const ModalSchedule = forwardRef(({loader, id, onLoad}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<ScheduleTable[]>([]);
    const columns:Columns[] = [
        {key:'client', title:'Nombre', grow:3, render:(row: ScheduleTable) => row.client},
        {key:'consulado', title:'Consulado', grow:4, render:(row: ScheduleTable) => 
            <Row>
                <Col xs={24} md={12}>
                    <Input type="date" name="consulado" value={row.consulado} onChange={(e:any)=>handleChange(e, row.client_id)} />
                </Col>
                <Col xs={24} md={12}>
                    <Input type="time" name="consulado_time" value={row.consulado_time} onChange={(e:any)=>handleChange(e, row.client_id)} />
                </Col>
            </Row>
            
        },
        {key:'cas', title:'CAS', grow:4, render:(row: ScheduleTable) => 
            <Row>
                <Col xs={24} md={12}>
                    <Input type="date" name="cas" value={row.cas} onChange={(e:any)=>handleChange(e, row.client_id)} />
                </Col>
                <Col xs={24} md={12}>
                    <Input type="time" name="cas_time" value={row.cas} onChange={(e:any)=>handleChange(e, row.client_id)} />
                </Col>
            </Row>
            
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
        const {name, value} = e.currentTarget;

        const items = data.map((item:ScheduleTable)=>{
            if(id === item.client_id){
                item = {
                    ...item,
                    [name]: value
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
                sales_id: id,
                clients_id: item.client_id,
                consulado: item.consulado,
                consulado_time: item.consulado_time,
                cas: item.cas,
                cas_time: item.cas_time
            };

            if(item.consulado !== '' || item.cas !== ''){
                items.push(element);
            }
        });

        if(items.length > 0){
            
            loader.current?.handleShow('Actualizando...');

            const response = await scheduleDetailsUpdate(items);

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
        <Modal size="lg" open={open} onClose={handleClose}>
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

export default ModalSchedule;