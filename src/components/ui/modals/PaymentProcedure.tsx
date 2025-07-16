import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, InputGroup, Modal, Row } from "rsuite";
import SelectForm from "../../common/Select";
import Input from "../../common/Input";
import { FaDollarSign } from "react-icons/fa6";
import Button from "../../common/Button";
import { IApp } from "../../../utils/interfaces/function";
import { isValidForm } from "../../../utils/functions";
import Toast from "../../common/Toast";
import { visaSalesAddPayment } from "../../../utils/services/sales/visa";


interface Props extends IApp{
    id: number,
    onLoad: (id:number) => void
}

const ModalPaymentProcedure = forwardRef(({loader, id, onLoad}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        method_payment:'',
        reference:'',
        receipt:'',
        amount:0
    })
    const handleShow = ()=>{
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    const handleChange = (e:any)=>{
        const {name, value} = e.currentTarget;

        setForm({
            ...form,
            [name]: value
        });
    }

    const handleSubmit = async ()=>{
        if(!isValidForm('div.payment-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(form.amount === 0){
            Toast.fire('Error', 'La cantidad debe ser mayor a 50 pesos', 'error');
            return;
        }

        loader.current?.handleShow('Procesando...');

        const obj = {
            sales_id: id,
            method_payment: form.method_payment,
            amount: form.amount,
            receipt: form.receipt,
            reference: form.reference
        };

        const response = await visaSalesAddPayment(obj);

        loader.current?.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', 'El pago se realizo correctamente', 'success');
            onLoad(id);
            handleClose();
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return (
        <Modal size={'xs'} open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Realizar pago a trámite (abonar)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row className="payment-form">
                        <Col xs={24}>
                            <label>Método de pago</label>
                            <SelectForm
                                id="method_payment"
                                options={[
                                    {value:'Efectivo', label:'Efectivo'},
                                    {value:'Tarjeta', label:'Tarjeta'}
                                ]}
                                value={form.method_payment}
                                handleChange={(value:string)=>handleChange({
                                    currentTarget:{
                                        name:'method_payment',
                                        value: value
                                    }
                                })}
                                required
                            />
                        </Col>
                        {form.method_payment === 'Tarjeta' && (
                            <Col xs={24} >
                                <label>No. Referencia</label>
                                <Input
                                    id="reference"
                                    type="number"
                                    value={form.reference}
                                    onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e)}
                                    required
                                />
                            </Col>
                        )}
                        <Col xs={24}>
                            <label>No. Recibo</label>
                            <Input 
                                id="receipt"
                                type="number"
                                value={form.receipt}
                                onChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e)}
                                required
                            />
                        </Col>
                        <Col xs={24}>
                            <label>Cantidad</label>
                            <InputGroup inside>
                                <InputGroup.Button>
                                    <FaDollarSign />                                    
                                </InputGroup.Button>
                                <Input
                                    type="number"
                                    id="amount"
                                    value={form.amount}
                                    onChange={handleChange}                                    
                                    required
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalPaymentProcedure;