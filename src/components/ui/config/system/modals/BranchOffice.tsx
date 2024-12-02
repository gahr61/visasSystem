import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal } from "rsuite";

import Input from "../../../../common/Input";
import Button from "../../../../common/Button";
import Toast from "../../../../common/Toast";

import { IApp } from "../../../../../utils/interfaces/function";
import { isValidForm } from "../../../../../utils/functions";
import { BranchOffice } from "../../../../../utils/interfaces/system";
import { branchOfficeId, branchOfficeStore, branchOfficeUpdate } from "../../../../../utils/services/branchOficce";


interface Props extends IApp{
    getData: ()=>void
}

const ModalBranchOfficeForm = forwardRef(({loader, getData}:Props, ref)=>{

    const [open, setOpen] = useState(false);
    const [branchOffice, setBranchOffice] = useState<BranchOffice>({
        id:0,
        name:'',
        location:''
    });
    const [saving, setSaving] = useState(false);

    const handleShow = async (id?: number)=>{
        if(id){
            loader.current?.handleShow('Cargando...');

            let response = await branchOfficeId(id);

            if(response && response.success){
                setBranchOffice(response.data);
            }

            loader.current?.handleClose();            
        }

        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
        setBranchOffice({id:0, name:'', location:''});
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.branch-office-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');
        setSaving(true);

        let response;

        if(branchOffice.id){
            response = await branchOfficeUpdate(branchOffice.id, branchOffice);
        }else{
            response = await branchOfficeStore(branchOffice);  
        }

        setSaving(false);
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
                <Modal.Title>Formulario - Sucursales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid className="branch-office-form">
                    <Col xs={24}>
                        <label>Nombre</label>
                        <Input 
                            id="name"
                            value={branchOffice.name}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => setBranchOffice({...branchOffice, name: e.currentTarget.value})}
                            required
                        />
                    </Col>
                    <Col xs={24}>
                        <label>Ubicación</label>
                        <Input 
                            id="location"
                            value={branchOffice.location}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => setBranchOffice({...branchOffice, location: e.currentTarget.value})}
                        />
                    </Col>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalBranchOfficeForm;