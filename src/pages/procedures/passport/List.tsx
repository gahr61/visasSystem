import { Col, Row } from "rsuite";
import Content from "../../../components/common/Content";
import { Column } from "../../../utils/interfaces/system";

import ButtonTable from "../../../components/common/ButtonTable";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import { Passports } from "../../../utils/interfaces/procedure";

const PassportList = ()=>{
    const height = (window.innerHeight - 170 ) - (document.getElementById('header-content')?.offsetHeight || 60);
    
    const columns:Column[]= [
        {key:'folio', title:'Folio', grow:1, render:(row: Passports)=> row.folio },
        {key:'date', title:'Fecha', grow:1, render:(row: Passports)=> row.date },
        {key:'applicant', title:'No. Solicitantes', grow:1, render:(row: Passports)=> row.no_applicants.toString() },
        {key:'client', title:'Cliente', grow:2, render:(row: Passports)=> row.client },
        {key:'email', title:'Correo', grow:1, render:(row: Passports)=> row.email },
        {key:'status', title:'Estatus', grow:1, render:(row: Passports)=> row.status },
        {key:'', title:'Acciones', grow:1, render:(row: Passports)=>
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

    const [data, setData] = useState<Passports[]>([]);
    const [ search, setSearch ] = useState('');

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

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