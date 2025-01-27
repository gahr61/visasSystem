import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";

type Props = {
    onChange: (value:boolean, id: number) => void
}

const ModalImage = forwardRef(({onChange}:Props, ref) => {

    const [open, setOpen] = useState(false);
    const [image, setImage] = useState('');
    const [id, setId] = useState(-1);

    const handleShow = (id: number, ticket: string) => {
        setImage(ticket);
        setId(id);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setImage('');
        setId(-1);
    }

    const onConfirm = ()=>{
        onChange(true, id);
        handleClose();
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24}>
                            <img src={image} className="w-full" />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cerrar</Button>
                    <Button onClick={onConfirm}>Confirmar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalImage;