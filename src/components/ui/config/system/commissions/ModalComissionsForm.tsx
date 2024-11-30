import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal } from "rsuite";
import Input from "../../../../common/Input";
import Button from "../../../../common/Button";
import { Commissions } from "../../../../../utils/interfaces/system";
import { commissionsId, commissionsStore, commissionsUpdate } from "../../../../../utils/services/commisions";
import { IApp } from "../../../../../utils/interfaces/function";
import { isValidForm } from "../../../../../utils/functions";
import Toast from "../../../../common/Toast";

interface Props extends IApp{
    getData: ()=>void
}

const ModalCommissionsForm = forwardRef(({loader, getData}:Props, ref)=>{

    const [open, setOpen] = useState(false);
    const [commission, setCommission] = useState<Commissions>({
        id:0,
        concept:''
    });
    const [saving, setSaving] = useState(false);

    const handleShow = async (id?: number)=>{
        if(id){
            loader.current?.handleShow('Cargando...');

            let response = await commissionsId(id);

            loader.current?.handleClose();

            if(response && response.success){
                setCommission(response.data);
            }
        }

        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
        setCommission({id:0, concept:''});
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.commission-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');
        setSaving(true);

        let response;

        if(commission.id){
            response = await commissionsUpdate(commission);
        }else{
            response = await commissionsStore(commission);  
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
                <Modal.Title>Formulario - Comisiones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24} className="commission-form">
                        <label>Concepto</label>
                        <Input 
                            id="concept"
                            value={commission.concept}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => setCommission({...commission, concept: e.currentTarget.value})}
                            required
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

export default ModalCommissionsForm;