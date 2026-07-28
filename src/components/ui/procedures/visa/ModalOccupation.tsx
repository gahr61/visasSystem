import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Checkbox, Col, Grid, Modal, Row } from "rsuite";
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Button from "../../../common/Button";
import Toast from "../../../common/Toast";
import { isValidForm } from "../../../../utils/functions";
import { occupationsList } from "../../../../utils/services/occupations";
import AddressForm from "../AddressForm";
import moment from "moment";

const calculateAntiquity = (hireDate: string)=>{
    if(!hireDate) return '';

    const years = moment().diff(hireDate, 'years');
    const months = moment().diff(moment(hireDate).add(years, 'years'), 'months');

    const parts = [];

    if(years > 0) parts.push(years+(years === 1 ? ' año' : ' años'));
    if(months > 0) parts.push(months+(months === 1 ? ' mes' : ' meses'));

    return parts.length > 0 ? parts.join(', ') : 'Menos de 1 mes';
}

const emptyForm = {
    occupations_id: '',
    otherOccupation: '',
    name: '',
    salary: '',
    hireDate: '',
    antiquity: '',
    activities_description: '',
    is_primary: false,
    address: {
        street: '', noInt: '', noExt: '', postCode: '', colony: '', country: 42, state: '', city: ''
    }
};

interface Props {
    onSave: (occupation: any, index?: number) => boolean,
    hasPrimary: boolean
}

const ModalOccupation = forwardRef(({ onSave, hasPrimary }: Props, ref) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<any>(emptyForm);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
    const [occupations, setOccupations] = useState<ISelectOptions[]>([]);
    const [showOtherOccupation, setShowOtherOccupation] = useState(false);

    const getOccupations = async ()=>{
        const response = await occupationsList();

        if(response && response.success){
            const list = response.data.map((data:any)=>({ value: data.id, label: data.name }));

            setOccupations(list);
        }
    }

    const handleShow = (occupation?: any, index?: number) => {
        if(occupation){
            setForm(occupation);
            setEditIndex(index);
            setShowOtherOccupation(occupations.find(obj => obj.value === occupation.occupations_id)?.label === 'Otro');
        }else{
            setForm({ ...emptyForm, is_primary: !hasPrimary });
            setEditIndex(undefined);
            setShowOtherOccupation(false);
        }

        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm({ ...form, [name]: value.toUpperCase() });
    }

    const handleChangeOccupation = (value:any)=>{
        const item = occupations.find(obj => obj.value === value);

        setShowOtherOccupation(item?.label === 'Otro');
        setForm({ ...form, occupations_id: value });
    }

    const handleChangeAddress = (address: any) => {
        setForm({ ...form, address });
    }

    const handleSubmit = () => {
        if(!isValidForm('div.occupation-modal-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(onSave(form, editIndex)){
            setOpen(false);
        }
    }

    useEffect(()=>{
        getOccupations();
    },[]);

    useEffect(()=>{
        if(form.hireDate){
            const antiquity = calculateAntiquity(form.hireDate);

            if(antiquity !== form.antiquity){
                setForm((prev:any)=>({...prev, antiquity}));
            }
        }
    },[form.hireDate]);

    useImperativeHandle(ref, () => ({ handleShow }));

    return (
        <Modal open={open} size={'lg'} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>{editIndex !== undefined ? 'Editar ocupación' : 'Agregar ocupación'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset'}}>
                <Grid fluid className="occupation-modal-form">
                    <Row>
                        <Col xs={24} lg={showOtherOccupation ? 8 : 12}>
                            <label>Ocupación</label>
                            <SelectForm
                                id="occupations_id"
                                options={occupations}
                                value={form.occupations_id}
                                handleChange={handleChangeOccupation}
                                required
                            />
                        </Col>
                        {showOtherOccupation && (
                            <Col xs={24} lg={4}>
                                <label>Nombre Ocupación</label>
                                <Input id="otherOccupation" value={form.otherOccupation} onChange={handleChange} required />
                            </Col>
                        )}
                        <Col xs={24} lg={4}>
                            <label>Ingreso mensual</label>
                            <Input type="number" id="salary" value={form.salary} onChange={handleChange} required />
                        </Col>
                        <Col xs={24} lg={4}>
                            <label>Fecha de ingreso</label>
                            <Input type="date" id="hireDate" value={form.hireDate} onChange={handleChange} required />
                        </Col>
                        <Col xs={24} lg={4}>
                            <label>Antigüedad</label>
                            <Input id="antiquity" value={form.antiquity} onChange={handleChange} disabled />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} lg={12}>
                            <label>Nombre de empleo o negocio</label>
                            <Input id="name" value={form.name} onChange={handleChange} required />
                        </Col>
                        <Col xs={24} lg={12}>
                            <label>Descripción de actividades</label>
                            <Input id="activities_description" value={form.activities_description} onChange={handleChange} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Checkbox
                                checked={form.is_primary}
                                onChange={(_v, checked)=>setForm({...form, is_primary: checked})}
                            >
                                Es mi ocupación principal
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

export default ModalOccupation;
