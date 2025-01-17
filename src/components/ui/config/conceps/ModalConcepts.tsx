import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";

import Input from "../../../common/Input";

import Button from "../../../common/Button";
import { IApp } from "../../../../utils/interfaces/function";
import Toast from "../../../common/Toast";
import { isValidForm } from "../../../../utils/functions";
import { conceptsId, conceptsStore, conceptsUpdate } from "../../../../utils/services/concepts";

interface Props extends IApp{
    getList: ()=>void
}

const ModalConcepts = forwardRef(({loader, getList}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | undefined>(undefined);
    const [dataForm, setDataForm] = useState({
        name:'',
        price:0
    })
    
    const handleShow = async (id: number)=>{
        if(id){
            setId(id);

            const response = await conceptsId(id);

            if(response && response.success){
                setDataForm(response.data);
            }
        }

        await setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
        setId(undefined);
        setDataForm({name:'', price:0});
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;

        setDataForm({
            ...dataForm,
            [name]: value
        });
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.catalog-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');

        let response;

        if(id){
            response = await conceptsUpdate(id, dataForm);
        }else{
            response = await conceptsStore(dataForm);
        }

        loader.current?.handleClose();
        
        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            getList();
            handleClose();

            return;
        }

        Toast.fire('Error', response?.message, 'error');
            
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} backdrop="static" keyboard={false} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Catalogo</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset'}}>
                <Grid fluid className="flex flex-col gap-2">
                    <Row>
                        <Col xs={24} className="catalog-form">
                            <Col xs={18}>
                                <label>Nombre</label>
                                <Input id="name" value={dataForm.name} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6}>
                                <label>Precio</label>
                                <Input type="number" id="price" value={dataForm.price} onChange={handleChange} required />
                            </Col>
                        </Col>
                    </Row>
                 </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalConcepts;