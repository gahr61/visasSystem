import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Grid, Modal } from "rsuite";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";

import { rolesId, rolesStore, rolesUpdate } from "../../../utils/services/roles";
import { IApp } from "../../../utils/interfaces/function";
import { Roles } from "../../../utils/interfaces/system";
import { isValidForm, normalizeString } from "../../../utils/functions";

interface Props extends IApp {
    getList: ()=>void
}

const ModalRolesForm = forwardRef(({
    getList,
    loader
}:Props, ref)=>{
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<string | number>('');
    const [data, setData] = useState<Roles>({
        name:'',
        display_name:'',
        description:''
    });
    const [saving, setSaving] = useState(false);

    const handleShow = (id:string | number)=>{
        setOpen(true);

        if(id){
            setId(id);
            getData(id);
        }
    }

    const getData = async (id: string | number)=>{
        loader.current?.handleShow('Cargando...');

        let response = await rolesId(id);
        if(response && response.success){
            setData(response.data)
        }

        if(loader.current?.handleClose){
            loader.current?.handleClose();
        }
       
    }

    const handleClose = ()=>{
        setOpen(false);
        setId('');
        setSaving(false);
        setData({
            name:'',
            display_name:'',
            description:''
        });
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;

        setData({
            ...data,
            [name]: value
        });
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.roles-form')){
            Toast.fire('Error', 'Campose requeridos', 'error');
            return;
        }

        setSaving(true);

        let obj: Roles = {
            name: normalizeString(data.display_name),
            display_name: data.display_name,
            description: data.description
        }

        let response;

        loader.current?.handleShow('Cargando...');

        if(id){
            response = await rolesUpdate(id, obj);
        }else{
            response = await rolesStore(obj);
        }

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');

            getList();

            handleClose();

            return;
        }

        Toast.fire('Error', response?.message, 'error');
        setSaving(false);
        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} backdrop="static" keyboard={false} onClose={handleClose}>
            <Modal.Title>{id === '' ? 'Registro de Rol' : 'Edición de Rol'}</Modal.Title>
            
            <Modal.Body className="overflow-[unset]">
                <Grid fluid>
                    <div className="grid gap-2 roles-form">
                        <div>
                            <label>Nombre</label>
                            <Input 
                                id="display_name"
                                value={data.display_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Descripción</label>
                            <Input 
                                id="description"
                                value={data.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex gap-2 justify-center">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalRolesForm;