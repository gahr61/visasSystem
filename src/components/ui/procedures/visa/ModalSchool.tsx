import { forwardRef, useImperativeHandle, useState } from "react";
import { Checkbox, Col, Grid, Modal, Row } from "rsuite";
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Button from "../../../common/Button";
import Toast from "../../../common/Toast";
import { isValidForm } from "../../../../utils/functions";
import AddressForm from "../AddressForm";

const DEGREE_LEVELS: ISelectOptions[] = [
    { value: 'Primaria', label: 'Primaria' },
    { value: 'Secundaria', label: 'Secundaria' },
    { value: 'Preparatoria', label: 'Preparatoria' },
    { value: 'Licenciatura', label: 'Licenciatura' },
    { value: 'Maestria', label: 'Maestría' },
    { value: 'Doctorado', label: 'Doctorado' },
];

const emptyForm = {
    name: '',
    degree_level: '',
    is_last_degree: false,
    period: '',
    address: {
        street: '', noInt: '', noExt: '', postCode: '', colony: '', country: 42, state: '', city: ''
    }
};

interface Props {
    onAdd: (school: any) => boolean
}

const ModalSchool = forwardRef(({ onAdd }: Props, ref) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<any>(emptyForm);

    const handleShow = () => {
        setForm(emptyForm);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm({ ...form, [name]: value.toUpperCase() });
    }

    const handleChangeAddress = (address: any) => {
        setForm({ ...form, address });
    }

    const handleSubmit = () => {
        if(!isValidForm('div.school-modal-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(onAdd(form)){
            setOpen(false);
        }
    }

    useImperativeHandle(ref, () => ({ handleShow }));

    return (
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Agregar escuela</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset'}}>
                <Grid fluid className="school-modal-form">
                    <Row>
                        <Col xs={24} lg={12}>
                            <label>Escuela</label>
                            <Input id="name" value={form.name} onChange={handleChange} required />
                        </Col>
                        <Col xs={24} lg={6}>
                            <label>Grado de estudios</label>
                            <SelectForm
                                id="degree_level"
                                options={DEGREE_LEVELS}
                                value={form.degree_level}
                                handleChange={(value) => setForm({ ...form, degree_level: value })}
                                required
                            />
                        </Col>
                        <Col xs={24} lg={6}>
                            <label>Generación</label>
                            <Input id="period" value={form.period} onChange={handleChange} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Checkbox
                                checked={form.is_last_degree}
                                onChange={(_v, checked)=>setForm({...form, is_last_degree: checked})}
                            >
                                Es tu último grado de estudios
                            </Checkbox>
                        </Col>
                    </Row>
                    <hr className="my-2" />
                    <AddressForm address={form.address} onChange={handleChangeAddress} size="compact" />
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

export default ModalSchool;
