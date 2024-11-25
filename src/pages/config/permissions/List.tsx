import { useEffect, useState } from "react";
import { Col, Row } from "rsuite";

import Content from "../../../components/common/Content";
import Input from "../../../components/common/Input";
import Table from "../../../components/common/Table";

import { Column, Permissions } from "../../../utils/interfaces/system";
import { permissions } from "../../../utils/services/permissions";

const PermissionsList = ()=>{
    const height = document.getElementById('header-content')?.offsetHeight || 60;

    const [ search, setSearch ] = useState('');
    const [ data, setData ] = useState<Permissions[]>([]);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:1, render:(row: Permissions)=>row.name},
        {key:'display_name', title:'Nombre identificador', grow:1, render:(row: Permissions)=>row.display_name},
        {key:'description', title:'Descripción', grow:3, render:(row: Permissions)=>row.description}
    ]

    const onLoadPage = async()=>{
        let response = await permissions();

        if(response && response.success){
            setData(response.data ?? []);
        }
    }

    const onSearch = (e: React.FormEvent<HTMLInputElement>)=>{
        const { value } = e.currentTarget;

        setSearch(value);
    }

    useEffect(()=>{
        onLoadPage();
    },[]);

    return(
        <Content
            url="/config/permissions/list"
            page="Permisos"
            subpage="Listado"
            title="Permisos - Listado"
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

export default PermissionsList;