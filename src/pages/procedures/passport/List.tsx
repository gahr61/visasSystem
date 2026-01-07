import { Col, Row } from "rsuite";
import Content from "../../../components/common/Content";
import { Column } from "../../../utils/interfaces/system";

import ButtonTable from "../../../components/common/ButtonTable";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import { Procedure } from "../../../utils/interfaces/procedure";
import { useUserStore } from "../../../utils/stores/useUserStore";
import { Navigate } from "react-router-dom";

const PassportList = ()=>{
    const userData = useUserStore(store => store.user);
        
    if(userData.role === 'cliente'){
        <Navigate to="/procedure/visa/client/list" replace />
    }

    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);
    
    const columns:Column[]= [
        {key:'folio', title:'Folio', grow:1, render:(row: Procedure)=> row.folio },
        {key:'date', title:'Fecha', grow:1, render:(row: Procedure)=> row.date },
        {key:'applicant', title:'No. Solicitantes', grow:1, render:(row: Procedure)=> row.no_applicants.toString() },
        {key:'client', title:'Cliente', grow:2, render:(row: Procedure)=> row.client },
        {key:'email', title:'Correo', grow:1, render:(row: Procedure)=> row.email },
        {key:'status', title:'Estatus', grow:1, render:(row: Procedure)=> row.status },
        {key:'', title:'Acciones', grow:1, render:()=>
            <div className="flex gap-2">
                <ButtonTable
                    title="Editar"
                    controlId="edit"
                    icon={<FaPencil />}
                    onClick={()=>{}}
                />
                <ButtonTable 
                    title="Eliminar"
                    controlId="delete"
                    icon={<FaTrashAlt />}
                    onClick={()=>{}}
                />
            </div>
        },
    ];

    const [data, setData] = useState<Procedure[]>([]);
    const [ search, setSearch ] = useState('');

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

    const onLoad = ()=>{
        setData([]);
    }

    useEffect(()=>{
        onLoad();
    },[])

    return(
        <Content
            url="/procedures/passport/list"
            page="Pasaporte"
            subpage="Listado"
            title="Pasaporte - Listado"
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
                        <Button onClick={()=>{}}>Nuevo</Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    data={data}
                    height={height}
                />
            </>
        </Content>
    )
}

export default PassportList;