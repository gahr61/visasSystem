import {  useState } from "react"
import { Col, Grid } from "rsuite"
import { useNavigate } from "react-router-dom"

import EmployeeForm from "../../../components/ui/config/employees/Form"
import Content from "../../../components/common/Content"
import Button from "../../../components/common/Button"
import Toast from "../../../components/common/Toast"

import { usersStore } from "../../../utils/services/users"
import { IApp } from "../../../utils/interfaces/function"
import { Employee } from "../../../utils/interfaces/employee"
import { isValidForm } from "../../../utils/functions"

const UsersNew = ({loader}:IApp)=>{
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee>({
        names:'',
        lastname1:'',
        lastname2:'',
        email:'',
        role:'',
        goal:'',
        salary:'',
        commissions:[]
    });
    const [password, setPassword] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');

    const handleChange = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;
      
        setEmployee({
            ...employee,
            [name]: value
        });
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.user-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');

        let obj: Employee & {
            password: string
        } = {
            ...employee,
            password: password
        }

        let response = await usersStore(obj);

        loader.current?.handleClose();
        
        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            navigate('/config/employees/list');

            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    return(
        <Content
            url="/config/employees/list"
            page="Empleados"
            subpage="Nuevo"
            title="Registro de empleados"
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
                        handleChange={handleChange}
                    />
                </Col>
                <Col xs={24} className="flex mt-4 justify-center">
                    <Button appearance="default">Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </Col>
            </Grid>
        </Content>
        
    )
}

export default UsersNew;