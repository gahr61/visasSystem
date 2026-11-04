import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Message, Row} from "rsuite";
import moment from "moment";

import { FaFileAlt } from "react-icons/fa";
import { IApp } from "../../../../utils/interfaces/function";
import Table, { Columns } from "../../../../components/common/Table";
import { Procedure } from "../../../../utils/interfaces/procedure";
import ButtonTable from "../../../../components/common/ButtonTable";
import { visasSalesClientList } from "../../../../utils/services/sales/visa";
import Content from "../../../../components/common/Content";
import Input from "../../../../components/common/Input";

const VisasClientList = ({loader}:IApp)=>{
    // acceso restringido al rol cliente desde AppRoutes (PermissionRoute clientOnly)
    const navigate = useNavigate();

    const height = (window.innerHeight - 300 ) - (document.getElementById('header-content')?.offsetHeight || 60);
    
    const columns:Columns[]= [
        {key:'folio', title:'Folio', grow:1, render:(row: Procedure)=> row.folio },
        {key:'date', title:'Fecha', grow:1, render:(row: Procedure)=> moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY') },
        {key:'', title:'Acciones', grow:1, render:(row: Procedure)=>
            <div className="flex gap-2">
                <ButtonTable
                    title="Completar información"
                    placement="top"
                    controlId="send_form"
                    icon={<FaFileAlt />}                    
                    onClick={()=>navigate('/procedures/visa/'+row.id+'/details')}
                    //onSelect={(option)=>onOpenDetails(row, option)}
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

    const getList = async ()=>{
        loader.current?.handleShow('Cargando...');

        let response = await visasSalesClientList();

        loader.current?.handleClose();

        if(response && response.success){
            setData(response.data);
        }
    }

    useEffect(()=>{
        getList();
    },[]);

    return(
        <Content
            url="/procedures/visa/list"
            page="Visas"
            subpage="Listado"
            title="Visas - Listado"
        >
            <>
                <Message type="info">
                    <div>
                        En esta sección encontrarás tus trámites de visa en curso.
                    </div>
                    <ul>
                        <li>Para continuar con un trámite, haz clic en el botón “Completar información” que aparece junto a cada registro.</li>
                        <li>Asegúrate de llenar todos los campos requeridos para evitar retrasos en el proceso.</li>
                        <li>Puedes guardar tu información y continuar más tarde si lo necesitas.</li>
                    </ul>
                    <div>
                        Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos. Estamos aquí para acompañarte en cada paso de tu trámite.
                    </div>
                </Message>
                <Row className="mt-2">
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

export default VisasClientList;