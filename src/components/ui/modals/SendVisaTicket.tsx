import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Uploader } from "rsuite";
import { IApp } from "../../../utils/interfaces/function";
import Button from "../../common/Button";
import Toast from "../../common/Toast";
import { visaSalesPaymentSend } from "../../../utils/services/sales/visa";

interface Props extends IApp{
    getList: ()=>void
}

const ModalSendVisaTicket = forwardRef(({loader, getList}:Props, ref)=>{
    const [open, setOpen] = useState(false); 
    const [dataFile, setDataFile] = useState([]);
    const [id, setId] = useState<number>(-1);
    const [type, setType] = useState('');
    const [option, setOption] = useState('');

    const handleShow = async (id: number, type: string, option:string)=>{
        await setOption(option);

        if(option === 'send'){
            await setOpen(true);
        }
        
        await setId(id);
        await setType(type);

        if(option === 'deliver'){
            await onSend(null, id, type, option);
        }
    }

    const handleClose = ()=>{
        setOpen(false);
        setId(-1);
        setType('');
        setDataFile([]);
    }

    const handleChange = (e: any)=>{        
        let value = e;

        setDataFile(value);
        
        
    }

    const onSend = async (e:any, id: number, type: string, option: string)=>{
        if(e !== null){
            e.preventDefault();
            console.log(type)
        }

        if(option === 'send'){
            if(dataFile.length === 0){
                Toast.fire('Error', 'Debe agregar por lo menos una ficha', 'error');
                return;
            }
        }

        let obj = new FormData();
        obj.append('sales_id', id.toString());
        obj.append('option', option);
        
        dataFile.forEach((file:any, index)=>{
            obj.append('files['+index+']', file.blobFile);
        });

        await loader.current?.handleShow('Enviando...');

        let response = await visaSalesPaymentSend(obj);

        await loader.current?.handleClose();

        if(response && response.success){
            handleClose();
            getList();
            Toast.fire('Correcto', response.message, 'success');
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open}>
            <Modal.Header>
                <Modal.Title>Ficha de pago de visa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24}>
                        <form encType="multipart/form-data">  
                            <Uploader fileList={dataFile} action="" draggable autoUpload={false} multiple accept=".pdf" onChange={handleChange}>
                                <div>
                                    <div className="flex items-center justify-center h-[200px]">
                                        <span>Haga clic o arrastre archivos a esta área para cargarlos</span>
                                    </div>
                                </div>
                                
                            </Uploader> 
                        </form>
                    </Col>
                    
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={(e:any)=>onSend(e, id, type, option)}>Enviar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalSendVisaTicket;