import { useEffect, useRef, useState } from "react";
import { Col, Divider, Grid } from "rsuite";
import { Column, Modal, Occupations } from "../../../utils/interfaces/system";
import ButtonTable from "../../../components/common/ButtonTable";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import { IApp } from "../../../utils/interfaces/function";
import { swalConfirm } from "../../../utils/functions";
import Toast from "../../../components/common/Toast";
import ModalOccupations from "../../../components/ui/config/system/modals/Occupations";
import { occupationsDelete, occupationsList } from "../../../utils/services/occupations";

const OccupationsList = ({loader}:IApp)=>{
    const occupationRef = useRef<Modal>(null);

    const height = (window.innerHeight - 190 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:5, render:(row: Occupations)=>row.name},
        {key:'', title:'Acciones', grow:1, render:(row: Occupations)=>
            <div className="flex gap-2">
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
                    onClick={()=>handleConfirm(row.id)}
                />
            </div>
        },
    ];

    const [data, setData] = useState<Occupations[]>([]);

    const openModalForm = (id?: string | number | null)=>{
        if(id){
            occupationRef.current?.handleShow(id ?? undefined);
        }  

        occupationRef.current?.handleShow(undefined);
    }


    const onDelete = async (id: number)=>{
        loader.current?.handleShow('Eliminando...');

        let response = await occupationsDelete(id);

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');

            getData();

            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    const handleConfirm = (id: number)=>{
        swalConfirm({
            text:'Realmente desea eliminar el registro?',
            confirmText:'Si, Eliminar',
            confirmFunction:onDelete,
            value: id
        });
    }

    const getData = async ()=>{
        loader.current?.handleShow('Cargando...');

        const response = await occupationsList();

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
                    <span className="text-lg">Ocupaciones</span>
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
            <ModalOccupations loader={loader} getData={getData} ref={occupationRef} />
        </Grid>
    )
}

export default OccupationsList;