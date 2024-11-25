import '../../../assets/css/permissions.css';

import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import { IApp } from "../../../utils/interfaces/function";
import { Permissions } from "../../../utils/interfaces/system";
import { permissionsAssigned, permissionsToAssign, permissionsToDesign } from "../../../utils/services/permissions";



const ModalPermissions = forwardRef(({loader}:IApp, ref)=>{
    const [open, setOpen] = useState(false);
    const [assigned, setAssigned] = useState<Permissions[]>([]);
    const [availables, setAvailable] = useState<Permissions[]>([]);
    const [rol_id, setRolId] = useState(-1);

    const handleShow = async (id:number)=>{
        await loader.current?.handleShow('Cargando');
        let response = await permissionsAssigned(id);
        if(response && response.success){
            setAvailable(response.data.availables);
            setAssigned(response.data.assigned);
            setRolId(id);
        }
        
        setOpen(true);

        await loader.current?.handleClose();
       
    }

    const handleClose = ()=>{
        setOpen(false);
        setAssigned([]);
        setAvailable([]);
    }

    const assignPermissions = (index:number)=>{
        let auxAssigned = assigned;
        let auxAvailables:any[] = []
        availables.forEach(async (a, i)=>{
            if(i === index){
                auxAssigned.push(a);     

                await permissionsToAssign({role_id: rol_id, permission_name: a.name});                
            }else{
                auxAvailables.push(a);
            }            
        });
        setAssigned(auxAssigned);
        setAvailable(auxAvailables);        
    }

    const designPermissions = (index:number)=>{
        let auxAssigned:Permissions[] = [];
        let auxAvailables = availables
        assigned.forEach(async (a, i)=>{
            if(i === index){
                auxAvailables.push(a);  

                await permissionsToDesign({role_id:rol_id, permission_name: a.name});              
            }else{
                auxAssigned.push(a);
            }            
        });

        setAssigned(auxAssigned);
        setAvailable(auxAvailables);        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));


    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Asignar/Quitar Permisos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24}>
                        <Row>
                            <Col xs={12} className='text-center'>
                                <label style={{fontWeight:'bold'}}>Permisos no asignados</label>
                                <div className="container-fluid text-start">
                                    <ul className="permissions-container">
                                        {availables.map((a, i)=>
                                            <li key={i} onClick={()=>assignPermissions(i)} >{a.display_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </Col>
                            <Col xs={12} className='text-center'>
                                <label style={{fontWeight:'bold'}}>Permisos asignados</label>
                                <div className="container-fluid text-start">
                                    <ul className="permissions-container">
                                        {assigned.map((a, i)=>
                                            <li key={i} onClick={()=>designPermissions(i)} >{a.display_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Grid>
            </Modal.Body>
        </Modal>
    )
})

export default ModalPermissions;