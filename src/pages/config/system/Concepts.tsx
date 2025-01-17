import { useEffect, useRef, useState } from "react";
import { Col, Divider, Grid } from "rsuite";
import {  ConceptsList, Column, Modal } from "../../../utils/interfaces/system";
import ButtonTable from "../../../components/common/ButtonTable";
import { FaPencil } from "react-icons/fa6";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import { IApp } from "../../../utils/interfaces/function";
import { formatPrice } from "../../../utils/functions";
import { LuFileClock } from "react-icons/lu";
import { concepts } from "../../../utils/services/concepts";
import ModalConcepts from "../../../components/ui/config/conceps/ModalConcepts";
import ModalPriceHistory from "../../../components/ui/config/conceps/PriceHistory";

const ConceptList = ({loader}:IApp)=>{
    const catalogRef = useRef<Modal>(null);
    const historyRef = useRef<Modal>(null);

    const height = (window.innerHeight - 190 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:5, render:(row: ConceptsList)=>row.name},
        {key:'price', title:'Precio', grow:2, render:(row: ConceptsList)=> formatPrice(row.price)},        
        {key:'', title:'Acciones', grow:1, render:(row: ConceptsList)=>
            <div className="flex gap-2">
                <ButtonTable 
                    title="Historial de precios"
                    controlId="history"
                    icon={<LuFileClock />}
                    onClick={()=>openModalHistory(row.id, row.name)}
                />
                <ButtonTable 
                    title="Editar"
                    controlId="edit"
                    icon={<FaPencil />}
                    onClick={()=>openModalForm(row.id ?? '')}
                />
            </div>
        },
    ];

    const [data, setData] = useState<ConceptsList[]>([]);

    const openModalForm = (id?: string | number | null)=>{
        if(id){
            catalogRef.current?.handleShow(id ?? undefined);
        }  

        catalogRef.current?.handleShow(undefined);
    }

    const openModalHistory = (id:number, name:string) => {
        historyRef.current?.handleShow(id, name)
    }   

    const getData = async ()=>{
        loader.current?.handleShow('Cargando...');

        const response = await concepts();

        loader.current?.handleClose();

        if(response && response.success){
            setData(response.data);
        }
    }

    useEffect(()=>{
        getData();
    },[]);

    return(
        <Grid fluid>
            <fieldset>
                <legend className="w-full">
                    <span className="text-lg">Conceptos de venta</span>
                    <div className="float-right">
                        <Button size="sm" onClick={()=>openModalForm()}>Nuevo</Button>
                    </div>
                </legend>
                <Divider className="my-2" />
                <Col xs={24}>
                    <Table 
                        columns={columns}
                        data={data}
                        height={height}
                    />
                </Col>
            </fieldset>
            <ModalConcepts loader={loader} getList={getData} ref={catalogRef} />
            <ModalPriceHistory loader={loader} ref={historyRef} />
        </Grid>
    )
}

export default ConceptList;