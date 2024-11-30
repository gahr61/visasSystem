import { Col, Divider, Row } from "rsuite";
import Input from "../../../common/Input";
import { Employee } from "../../../../utils/interfaces/employee";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import { useEffect, useState } from "react";
import { rolesList } from "../../../../utils/services/roles";
import CommissionsForm from "../../commissions/Form";

const EmployeeForm = ({
    employee,
    setEmployee,
    errorEmail, 
    setErrorEmail,
    password,
    setPassword,
    handleChange,
}:{
    employee: Employee,
    setEmployee: (e: Employee) => void,
    errorEmail: string,
    setErrorEmail: (e: string) => void,
    password: string,
    setPassword: (e: string) => void,
    handleChange: (e: React.FormEvent<HTMLInputElement>) => void
})=>{
    const [roles, setRoles] = useState<ISelectOptions[]>([]);
    const [editable, setEditable] = useState(false);

    const onLoad = async ()=>{
        let response = await rolesList();
        if(response){
            setRoles(response.data);
        }

        console.log(employee.id)
        if(employee.id){
            setEditable(true);
        }
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return(
        <>
            <Row className="user-form">
                <Col xs={8}>
                    <label>Nombre</label>
                    <Input
                        id="names"
                        value={employee.names}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={8}>
                    <label>Apellido Paterno</label>
                    <Input
                        id="lastname1"
                        value={employee.lastname1}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={8}>
                    <label>Apellido Materno</label>
                    <Input
                        id="lastname2"
                        value={employee.lastname2 || ''}
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={8}>
                    <label>Rol</label>
                    <SelectForm
                        id="role"
                        options={roles}
                        value={employee.role}
                        handleChange={(value:string)=>setEmployee({
                            ...employee,
                            role: value
                        })}
                        required
                    />
                </Col>
                <Col xs={8}>
                    <label>Correo Electrónico</label> 
                    <span className="span-required text-red-600">                                
                        {<span className="text-sm text-red-400 ms-2">{errorEmail}</span>}
                    </span>
                    <Input
                        id="email"
                        type="email"
                        value={employee.email}
                        onChange={handleChange}
                        setErrorEmail={setErrorEmail}
                        required
                        disabled={employee.id !== undefined}
                    />
                </Col>
                {employee.id === undefined && (
                    <Col xs={8}>
                        <label>Contraseña</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                    </Col>
                )}
                
                <Col xs={8}>
                    <label>Salario</label>
                    <Input
                        id="salary"
                        type="number"
                        value={employee.salary}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={8}>
                    <label>Meta</label>
                    <Input
                        id="goal"
                        type="number"
                        value={employee.goal}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>
            
            <Divider className="my-4" />
            
            <CommissionsForm employee={employee} setEmployee={setEmployee} />
        </>
    )
}

export default EmployeeForm;