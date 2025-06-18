import {  useEffect, useState } from "react"
import { Col, Grid } from "rsuite"
import { useNavigate, useParams } from "react-router-dom"

import EmployeeForm from "../../../components/ui/config/employees/Form"
import Content from "../../../components/common/Content"
import Button from "../../../components/common/Button"
import Toast from "../../../components/common/Toast"

import { usersId, usersUpdate } from "../../../utils/services/users"
import { IApp } from "../../../utils/interfaces/function"
import { Employee } from "../../../utils/interfaces/employee"
import { isValidForm } from "../../../utils/functions"

const UsersEdit = ({loader}:IApp)=>{
    const navigate = useNavigate();

    const {id} = useParams();

    const [employee, setEmployee] = useState<Employee>({
        names:'',
        lastname1:'',
        lastname2:'',
        email:'',
        role:'',
        role_text:'',
        goal:'',
        salary:'',
        commissions:[]
    });
    const [password, setPassword] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false)

    const onLoad = async ()=>{
        loader.current?.handleShow('Cargando...');

        let response = await usersId(id ?? '');
        
        loader.current?.handleClose();
        
        if(response && response.success){
            setEmployee(response.data);
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.user-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        setSaving(true);

        loader.current?.handleShow('Guardando...');

        let obj: Employee & {
            password: string
        } = {
            ...employee,
            role: employee.role_text.toLowerCase().replace(/ /g, '_'),
            password: password,
        }

        let response = await usersUpdate(id ?? '', obj);

        loader.current?.handleClose();
        
        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            navigate('/config/employees/list');

            return;
        }

        setSaving(false);

        Toast.fire('Error', response.message, 'error');
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return(
        <Content
            url="/config/employees/list"
            page="Empleados"
            subpage="Nuevo"
            title="Edición de empleados"
            autoHeight={true}
        >
            <Grid fluid>
                <Col xs={24} xl={18} xlOffset={3}>
                    <EmployeeForm 
                        employee={employee}
                        setEmployee={setEmployee}
                        errorEmail={errorEmail}
                        setErrorEmail={setErrorEmail}
                        password={password}
                        setPassword={setPassword}
                    />
                </Col>
                <Col xs={24} className="flex mt-3 justify-center">
                    <Button appearance="default" onClick={()=>navigate('/config/employees/list')}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving}>Guardar</Button>
                </Col>
            </Grid>
        </Content>
        
    )
}

export default UsersEdit;