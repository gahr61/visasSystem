import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Toast from "../../common/Toast";
import { IApp } from "../../../utils/interfaces/function";
import { PassportScheduleItem } from "../../../utils/interfaces/passportSales";
import { passportScheduleUpdate } from "../../../utils/services/sales/passport";

// Las 32 capitales estatales + ciudades fronterizas con presencia consular importante
const MEXICO_CITIES = [
    'Aguascalientes', 'Campeche', 'Chetumal', 'Chihuahua', 'Chilpancingo',
    'Ciudad de México', 'Ciudad Juárez', 'Ciudad Victoria', 'Colima', 'Culiacán',
    'Cuernavaca', 'Durango', 'Guadalajara', 'Guanajuato', 'Hermosillo', 'La Paz',
    'Matamoros', 'Mérida', 'Mexicali', 'Monterrey', 'Morelia', 'Nogales',
    'Nuevo Laredo', 'Oaxaca de Juárez', 'Pachuca', 'Puebla', 'Querétaro',
    'Saltillo', 'San Luis Potosí', 'Tepic', 'Tijuana', 'Tlaxcala', 'Toluca',
    'Tuxtla Gutiérrez', 'Villahermosa', 'Xalapa', 'Zacatecas',
];

const selectClass = "py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer";

type ModalItem = PassportScheduleItem & { clientName: string };

interface Props extends IApp {
    salesId: number;
    onSaved: () => void;
}

const PassportScheduleModal = forwardRef(({ loader, salesId, onSaved }: Props, ref) => {
    const [open, setOpen]   = useState(false);
    const [items, setItems] = useState<ModalItem[]>([]);

    const handleShow = (list: ModalItem[]) => {
        setItems(list);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setItems([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, clientsId: number) => {
        const { name, value } = e.currentTarget;
        setItems(prev => prev.map(item =>
            item.clients_id === clientsId ? { ...item, [name]: value } : item
        ));
    };

    const handleSubmit = async () => {
        const payload = items.filter(item => item.appointment_date !== '');

        if (payload.length === 0) {
            Toast.fire('Error', 'Ingrese al menos una fecha de cita', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');
        const response = await passportScheduleUpdate(salesId, payload);
        loader.current?.handleClose();

        if (response?.success) {
            Toast.fire('Correcto', response.message, 'success');
            handleClose();
            onSaved();
            return;
        }

        Toast.fire('Error', response.message, 'error');
    };

    useImperativeHandle(ref, () => ({ handleShow }));

    return (
        <Modal size="lg" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Agendar cita de pasaporte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    {items.map(item => (
                        <div key={item.clients_id} className="border border-gray-200 rounded-lg p-4 mb-3">
                            <p className="font-semibold text-sm mb-3 text-gray-800">{item.clientName}</p>
                            <Row>
                                <Col xs={24} md={12}>
                                    <label className="text-xs text-gray-500 mb-1 block">Oficina <span className="span-required text-red-600">*</span></label>
                                    <Input
                                        name="office"
                                        value={item.office}
                                        onChange={(e: any) => handleChange(e, item.clients_id)}
                                        placeholder="Nombre de la oficina"
                                        required
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <label className="text-xs text-gray-500 mb-1 block">Ciudad <span className="span-required text-red-600">*</span></label>
                                    <select
                                        name="city"
                                        value={item.city}
                                        onChange={(e) => handleChange(e, item.clients_id)}
                                        className={selectClass}
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        {MEXICO_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Col>
                                <Col xs={24} md={8} className="mt-2">
                                    <label className="text-xs text-gray-500 mb-1 block">Fecha de cita <span className="span-required text-red-600">*</span></label>
                                    <Input
                                        type="date"
                                        name="appointment_date"
                                        value={item.appointment_date}
                                        onChange={(e: any) => handleChange(e, item.clients_id)}
                                        required
                                    />
                                </Col>
                                <Col xs={24} md={8} className="mt-2">
                                    <label className="text-xs text-gray-500 mb-1 block">Horario <span className="span-required text-red-600">*</span></label>
                                    <Input
                                        type="time"
                                        name="schedule"
                                        value={item.schedule}
                                        onChange={(e: any) => handleChange(e, item.clients_id)}
                                        required
                                    />
                                </Col>
                                <Col xs={24} md={8} className="mt-2">
                                    <label className="text-xs text-gray-500 mb-1 block">Estatus</label>
                                    <select
                                        name="status"
                                        value={item.status}
                                        onChange={(e) => handleChange(e, item.clients_id)}
                                        className={selectClass}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Confirmado">Confirmado</option>
                                        <option value="Completado">Completado</option>
                                    </select>
                                </Col>
                                <Col xs={24} className="mt-2">
                                    <label className="text-xs text-gray-500 mb-1 block">Observaciones</label>
                                    <Input
                                        name="observations"
                                        value={item.observations}
                                        onChange={(e: any) => handleChange(e, item.clients_id)}
                                        placeholder="Observaciones"
                                    />
                                </Col>
                            </Row>
                        </div>
                    ))}
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-3">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
});

export default PassportScheduleModal;
