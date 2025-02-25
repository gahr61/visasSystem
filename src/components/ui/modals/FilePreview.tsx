import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import * as PDFObject from 'pdfobject';

import Button from "../../common/Button";

interface Props {
    showPreview?: (value: boolean) => void,
    onChange?: (value:boolean, id: number) => void
}

const ModalFilePreview = forwardRef(({
    showPreview,
    onChange
}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [id, setId] = useState(0);

    const handleShow = (file:string, isFile: boolean, file_id?:number)=>{
        setOpen(true);
        if(file_id){
            setId(file_id);
        }

        if(isFile){
            setTimeout(()=>{
                PDFObject.embed(file, '#pdf-container');
            }, 500)            
        }else{
            setFile(file);
            setIsImage(true);
        }
        
    }

    const handleClose = ()=>{
        setOpen(false);
        setIsImage(false);

        if(showPreview){
            showPreview(true);
        }        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    const onResize = ()=>{
        //window.addEventListener('resize', function(e){
            let container = document.getElementById('pdf-container');

            if(container){
                let height = window.innerHeight;

                container.style.height = (height - 200)+'px';
            }
            
        //})
    }

    const onConfirm = ()=>{
        if(onChange){console.log(id)
            onChange(true, id);
        }
        
        handleClose();
    }

    useEffect(()=>{
        if(open){
            onResize();
        }
    },[open])

    return(
        <Modal size={'md'} open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Vista previa de archivo</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset', maxHeight: 550}}>
                <Grid fluid>
                    <Row>
                        <Col xs={24} className="p-2">
                            {isImage ? 
                                <Col xs={24} md={12} mdOffset={6} lg={10} lgOffset={7}>
                                    <img src={file} className="w-full h-full" />
                                </Col>
                            :
                                <div id="pdf-container"></div>
                            }
                            
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center">
                    <Button appearance="default" onClick={handleClose}>Cerrar</Button>
                    {onChange && (
                        <Button appearance="primary" onClick={onConfirm}>Confirmar</Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalFilePreview;