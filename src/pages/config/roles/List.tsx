import { useEffect,  useRef,  useState } from "react";
import { Col, Row } from "rsuite";

import { GoPasskeyFill } from "react-icons/go";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import Content from "../../../components/common/Content";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import ButtonTable from "../../../components/common/ButtonTable";
import Toast from "../../../components/common/Toast";
import ModalRolesForm from "./ModalForm";

import { Column, Modal, Roles } from "../../../utils/interfaces/system";
import { roles, rolesDelete } from "../../../utils/services/roles";
import { IApp } from "../../../utils/interfaces/function";
import { swalConfirm } from "../../../utils/functions";
import ModalPermissions from "./MoralRolePemissions";


const RolesList = ({loader}:IApp)=>{
    const rolesRef = useRef<Modal>(null);
    const permissionsRef = useRef<Modal>(null);

    const height = document.getElementById('header-content')?.offsetHeight || 60;

    const [ search, setSearch ] = useState('');
    const [data, setData] = useState<Roles[]>([]);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:1, render:(row: Roles)=> row.name },
        {key:'description', title:'Descripción', grow:5, render:(row: Roles)=>row.description},
        {key:'', title:'Acciones', grow:1, render:(row: Roles)=>
            <div className="flex gap-2">
                <ButtonTable 
                    title="Asignar permisos"
                    controlId="key"
                    icon={<GoPasskeyFill />}
                    onClick={()=>handleAssignPermissions(row.id ?? -1)}
                />
                <ButtonTable 
                    title="Editar"
                    controlId="edit"
                    icon={<FaPencil />}
                    onClick={()=>openModalForm(row.id)}
                />
                <ButtonTable 
                    title="Eliminar"
                    controlId="delete"
                    icon={<FaTrashAlt />}
                    onClick={()=>handleConfirm(row.id ?? -1)}
                />
            </div>
        },
    ];

    const getList = async()=>{
        let response = await roles();

        if(response && response.success){
            setData(response.data ?? []);
        }
    }

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

    const openModalForm = (id?:number)=>{
        rolesRef.current?.handleShow(id);
    }

    const onConfirmDelete = async (id: number)=>{
        loader.current?.handleShow('Eliminando...');

        let response = await rolesDelete(id);

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            getList();

            return;
        }

        Toast.fire('Error', response.message, 'error');

    }

    const handleConfirm = (id: number)=>{
        swalConfirm({
            confirmFunction: (id:number)=>onConfirmDelete(id),
            value: id,
            text: 'Desea eliminar el registro?',
            confirmText: 'Si, eliminar'
        })
    }

    const handleAssignPermissions = (id: number)=>{
        permissionsRef.current?.handleShow(id);
    }

    useEffect(()=>{
        getList();
    },[]);

    return(
        <Content
            url="/config/employees/list"
            page="Empleados"
            subpage="Listado"
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
                        <Button onClick={()=>openModalForm()}>Nuevo</Button>
                    </Col>
                </Row>
                <Table 
                    columns={columns}
                    data={data}
                    height={height}
                />

                <ModalRolesForm loader={loader} getList={getList} ref={rolesRef} />
                <ModalPermissions loader={loader} ref={permissionsRef} />
            </>
        </Content>
    )
}

export default RolesList;