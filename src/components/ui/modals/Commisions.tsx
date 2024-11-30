import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Divider, Grid, Modal } from "rsuite";

import Input from "../../common/Input";
import CommissionsForm from "../commissions/Form";

import { EmployeeCommission } from "../../../utils/interfaces/employee";
import Button from "../../common/Button";
import { IApp } from "../../../utils/interfaces/function";
import { commissionsUserUpdate } from "../../../utils/services/commisions";
import Toast from "../../common/Toast";

export type IModalCommission = {
    handleShow: (id: number, name: string, commisions: EmployeeCommission[])=>void
}

type EmployeCommissionsModal = {
    id: number;
    name: string,
    commissions: EmployeeCommission[]
}

interface Props extends IApp{
    getList: ()=>void
}

const ModalCommissions = forwardRef(({loader, getList}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [employee, setEmployee] = useState<EmployeCommissionsModal>({id:0, name: '', commissions:[]});
    
    const handleShow = (id: number, name: string, commissions: EmployeeCommission[])=>{
        setOpen(true);
        setEmployee({...employee, id, name: name, commissions});
    }

    const handleClose = ()=>{
        setOpen(false);
        setEmployee({id:0, name: '', commissions:[]});
    }

    const handleSubmit = async ()=>{
        loader.current?.handleShow('Actualizando...');

        let obj:any = {
            users_id: employee.id,
            commissions: employee.commissions
        };

        let response = await commissionsUserUpdate(obj);

        loader.current?.handleClose();
        
        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');

            handleClose();
            getList();
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} backdrop="static" keyboard={false} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Comisiones</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset'}}>
                <Grid fluid className="flex flex-col gap-2">
                    <Col xs={24}>
                        <label>Empleado</label>
                        <Input id="employee" value={employee.name} disabled />
                    </Col>
                    <Divider className="my-2" />
                    <Col xs={24}>
                        <CommissionsForm employee={employee} setEmployee={setEmployee} />    
                    </Col>
                 </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Actualizar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalCommissions;