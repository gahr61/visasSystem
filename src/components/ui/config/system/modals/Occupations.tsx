import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Input from "../../../../common/Input";
import Button from "../../../../common/Button";
import { IApp } from "../../../../../utils/interfaces/function";
import { occupationsId, occupationsStore, occupationsUpdate } from "../../../../../utils/services/occupations";
import { isValidForm } from "../../../../../utils/functions";
import Toast from "../../../../common/Toast";

interface Props extends IApp{
    getData: ()=>void
}

const ModalOccupations = forwardRef(({loader, getData}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [id, setId] = useState<number>(-1);

    const handleShow = async (id:number)=>{
        setOpen(true);

        if(id){
            loader.current?.handleShow('Cargando...');

            const response = await occupationsId(id);

            loader.current?.handleClose();

            if(response && response.success){
                setName(response.data.name);
                setId(response.data.id);
            }
        }
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.occupation-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');
        let obj:any = {
            name: name
        };
        let response;

        if(id === -1){
            response = await occupationsStore(obj);
        }else{
            obj = {...obj, id: id};

            response = await occupationsUpdate(id, obj);
        }

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            handleClose();
            getData();
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Ocupaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24} className="occupation-form">
                            <label>Nombre</label>
                            <Input 
                                id="name"
                                value={name}
                                onChange={(e:any)=>setName(e.currentTarget.value)}
                                required
                            />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="p-2 flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalOccupations;