import { useEffect, useRef, useState } from "react";
import { Col, Divider, Grid } from "rsuite";


import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import ButtonTable from "../../../components/common/ButtonTable";
import Table from "../../../components/common/Table";
import Toast from "../../../components/common/Toast";
import Button from "../../../components/common/Button";

import { BranchOffice, Column, Modal } from "../../../utils/interfaces/system";
import { IApp } from "../../../utils/interfaces/function";
import { swalConfirm } from "../../../utils/functions";
import { branchOfficeDelete, branchOfficeList } from "../../../utils/services/branchOficce";
import ModalBranchOfficeForm from "../../../components/ui/config/system/modals/BranchOffice";

const BranchOffices = ({loader}:IApp)=>{
    const modalRef = useRef<Modal>(null);

    const height = (window.innerHeight - 190 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const columns:Column[]= [
        {key:'name', title:'Nombre', grow:2, render:(row: BranchOffice)=>row.name},
        {key:'location', title:'Ubicación', grow:3, render:(row:BranchOffice)=>row.location },
        {key:'', title:'Acciones', grow:1, render:(row: BranchOffice)=>
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

    const [data, setData] = useState<BranchOffice[]>([]);

    const openModalForm = (id?: number)=>{
        if(id){
            modalRef.current?.handleShow(id ?? undefined);
        }  

        modalRef.current?.handleShow(undefined);
    }


    const onDelete = async (id: number)=>{
        loader.current?.handleShow('Eliminando...');

        let response = await branchOfficeDelete(id);
    
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
        let response = await branchOfficeList();

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
                    <span className="text-lg">Sucursales</span>
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
            
            <ModalBranchOfficeForm loader={loader} getData={getData} ref={modalRef} />
        </Grid>
    )
}

export default BranchOffices;