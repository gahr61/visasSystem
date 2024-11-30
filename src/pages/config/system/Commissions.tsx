import { useEffect, useRef, useState } from "react";
import { Col, Divider, Grid } from "rsuite";
import { Column, Commissions, Modal } from "../../../utils/interfaces/system";
import ButtonTable from "../../../components/common/ButtonTable";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import Table from "../../../components/common/Table";
import { commissionsDelete, commissionsList, commissionsVerifyUser } from "../../../utils/services/commisions";
import Button from "../../../components/common/Button";
import ModalCommissionsForm from "../../../components/ui/config/system/commissions/ModalComissionsForm";
import { IApp } from "../../../utils/interfaces/function";
import { swalConfirm } from "../../../utils/functions";
import Toast from "../../../components/common/Toast";

const CommissionsList = ({loader}:IApp)=>{
    const commissionRef = useRef<Modal>(null);

    const height = (window.innerHeight - 190 ) - (document.getElementById('header-content')?.offsetHeight || 60);

    const columns:Column[]= [
        {key:'concept', title:'Concepto', grow:5, render:(row: Commissions)=>row.concept},
        {key:'', title:'Acciones', grow:1, render:(row: Commissions)=>
            <div className="flex gap-2">
                <ButtonTable 
                    title="Editar"
                    controlId="edit"
                    icon={<FaPencil />}
                    onClick={()=>openModalForm(row.id ?? '')}
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

    const [data, setData] = useState<Commissions[]>([]);

    const openModalForm = (id?: string | number | null)=>{
        if(id){
            commissionRef.current?.handleShow(id ?? undefined);
        }  

        commissionRef.current?.handleShow(undefined);
    }

    const verifyCommissionInUser = async (id: number)=>{
        let response = await commissionsVerifyUser(id);

        if(response && response.success){
            if(response.data === true){
                swalConfirm({
                    text:'La comisión que intenta eliminar se encuentra asignado a varios usuarios, desea continuar?',
                    confirmText:'Si, Continuar',
                    value: id,
                    confirmFunction: onDelete
                })
            }else{
                onDelete(id);
            }
        }
    }

    const onDelete = async (id: number)=>{
        let response = await commissionsDelete(id);

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
            confirmFunction:verifyCommissionInUser,
            value: id
        });
    }

    const getData = async ()=>{
        let response = await commissionsList();

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
                    <span className="text-lg">Comisiones</span>
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
            <ModalCommissionsForm loader={loader} getData={getData} ref={commissionRef} />
        </Grid>
    )
}

export default CommissionsList;