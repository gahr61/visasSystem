import { useEffect, useRef, useState } from "react";
import { Col, Popover, Row, Whisper } from "rsuite";

import { FaDollarSign, FaKey, FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import Content from "../../../components/common/Content";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import ButtonTable from "../../../components/common/ButtonTable";
import ModalCommissions, { IModalCommission } from "../../../components/ui/modals/Commisions";

import { EmployeeList } from "../../../utils/interfaces/employee";
import { Column } from "../../../utils/interfaces/system";
import { usersDelete, usersList } from "../../../utils/services/users";
import { useNavigate } from "react-router-dom";
import { formatPrice, swalConfirm } from "../../../utils/functions";
import Toast from "../../../components/common/Toast";
import { IApp } from "../../../utils/interfaces/function";
import { appContext } from "../../../context/appContext";


const UsersList = ({loader}:IApp)=>{
    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const navigate = useNavigate();

    const {resetPassword} = appContext();

    const refCommisions = useRef<IModalCommission>(null);

    const [ search, setSearch ] = useState('');
    const [data, setData] = useState<EmployeeList[]>([]);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:2, render:(row: EmployeeList)=>row.fullName},
        {key:'email', title:'Correo', grow:2, render:(row: EmployeeList)=>row.email},
        {key:'goal', title:'Meta', grow:1, render:(row: EmployeeList)=>formatPrice(row.goal)},
        {key:'commission', title:'Comisión', grow:1, render:(row: EmployeeList)=>
            <Whisper placement="bottom" controlId="comission" speaker={
                <Popover title="Comisiones" visible>
                    {row.commissions.map((commision, index)=>
                        <p key={index}>{commision.concept+' - '+formatPrice(commision.amount)}</p>
                    )}
                </Popover>
            }>
                <span className="cursor-pointer font-semibold">{formatPrice(row.totalCommission)}</span>
            </Whisper>
        },
        {key:'salary', title:'Salario', grow:1, render:(row: EmployeeList)=>formatPrice(row.salary)},
        {key:'role', title:'Rol', grow:2, render:(row: EmployeeList)=>row.role},
        {key:'', title:'Acciones', grow:1, render:(row: EmployeeList)=>
            <div className="flex gap-2">
                <ButtonTable 
                    title="Comisiones"
                    controlId="commision"
                    icon={<FaDollarSign />}
                    onClick={()=>handleCommissions(row)}
                />
                <ButtonTable 
                    title="Restablecer contraseña"
                    controlId="key"
                    icon={<FaKey />}
                    onClick={()=>openResetPassword(row.id)}
                />
                <ButtonTable 
                    title="Editar"
                    controlId="edit"
                    icon={<FaPencil />}
                    onClick={()=>navigate('/config/employees/edit/'+row.id)}
                />
                <ButtonTable 
                    title="Eliminar"
                    controlId="delete"
                    icon={<FaTrashAlt />}
                    onClick={()=>confirmDelete(row.id)}
                />
            </div>
        },
    ]

    const onLoadPage = async()=>{
        let response = await usersList();

        if(response && response.success){
            setData(response.data ?? []);
        }
    }

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

    /**
     * Open modal commissions
     * @param row employee object
     */
    const handleCommissions = (row: EmployeeList)=>{
        refCommisions.current?.handleShow(row.id, row.fullName, row.commissions)
    }

    const onDelete = async (id: number) => {
        loader.current?.handleShow('Eliminado...');

        let response = await usersDelete(id ?? '');

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');

            onLoadPage();
            
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    const confirmDelete = (id: number)=>{
        swalConfirm({
            title:'Alerta',
            text:'Realmente desea eliminar el registro',
            confirmFunction: (id: number)=>onDelete(id),
            value: id,
            confirmText:'Si, Eliminar'
        });
    }

    const openResetPassword = (id:number)=>{
        resetPassword?.handleShow(id.toString());
    }

    useEffect(()=>{
        onLoadPage();
    },[]);

    return(
        <Content
            url="/config/employees/list"
            page="Empleados"
            subpage="Listado"
            title="Usuarios - Listado"
        >
            <>
                <Row>
                    <Col xs={4}>
                        <Input 
                            id="search"
                            value={search}
                            onChange={onSearch}
                            placeholder="Buscar..."
                        />
                    </Col>
                    <Col xs={4} xsOffset={16} className="flex justify-end">
                        <Button onClick={()=>navigate('/config/employees/new')}>Nuevo</Button>
                    </Col>
                </Row>
                <Table 
                    columns={columns}
                    data={data}
                    height={height}
                />

                <ModalCommissions loader={loader} getList={onLoadPage} ref={refCommisions} />
            </>
            
            
        </Content>
    )
}

export default UsersList;