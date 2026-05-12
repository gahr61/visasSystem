import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { IApp } from "../../../utils/interfaces/function";
import Toast from "../../common/Toast";
import { scheduleDetailsUpdate } from "../../../utils/services/schedule";

const MEXICO_CITIES = [
    'Ciudad de México',
    'Guadalajara',
    'Monterrey',
    'Ciudad Juárez',
    'Tijuana',
    'Mérida',
    'Hermosillo',
    'Matamoros',
    'Nogales',
    'Nuevo Laredo',
];

const selectClass = "py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer";

interface ScheduleTable {
    client_id: number,
    client: string,
    consulado: string,
    consulado_time: string,
    consulado_city: string,
    cas: string,
    cas_time: string,
    cas_city: string,
}

interface Props extends IApp {
    id: number,
    onLoad: (id: number) => void
}

const ModalSchedule = forwardRef(({ loader, id, onLoad }: Props, ref) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<ScheduleTable[]>([]);

    const handleShow = (list: any) => {
        setOpen(true);
        setData(list);
    }

    const handleClose = () => {
        setOpen(false);
        setData([]);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, clientId: number) => {
        const { name, value } = e.currentTarget;
        setData(prev => prev.map(item =>
            item.client_id === clientId ? { ...item, [name]: value } : item
        ));
    }

    const handleSubmit = async () => {
        const items = data
            .filter(item => item.consulado !== '' || item.cas !== '')
            .map(item => ({
                sales_id: id,
                clients_id: item.client_id,
                consulado: item.consulado,
                consulado_time: item.consulado_time,
                consulado_city: item.consulado_city,
                cas: item.cas,
                cas_time: item.cas_time,
                cas_city: item.cas_city,
            }));

        if (items.length > 0) {
            loader.current?.handleShow('Actualizando...');
            const response = await scheduleDetailsUpdate(items);
            loader.current?.handleClose();

            if (response && response.success) {
                Toast.fire('Correcto', response.message, 'success');
                handleClose();
                onLoad(id);
                return;
            }
            Toast.fire('Error', response.message, 'error');
        }
    }

    useImperativeHandle(ref, () => ({ handleShow }));

    return (
        <Modal size="lg" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Agendar citas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    {data.map((item) => (
                        <div key={item.client_id} className="border border-gray-200 rounded-lg p-4 mb-3">
                            <p className="font-semibold text-sm mb-3 text-gray-800">{item.client}</p>

                            <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Consulado</p>
                                <Row>
                                    <Col xs={24} md={10}>
                                        <label className="text-xs text-gray-500 mb-1 block">Ciudad</label>
                                        <select
                                            name="consulado_city"
                                            value={item.consulado_city}
                                            onChange={(e) => handleChange(e, item.client_id)}
                                            className={selectClass}
                                        >
                                            <option value="">Seleccione...</option>
                                            {MEXICO_CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
                                        <Input
                                            type="date"
                                            name="consulado"
                                            value={item.consulado}
                                            onChange={(e: any) => handleChange(e, item.client_id)}
                                        />
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <label className="text-xs text-gray-500 mb-1 block">Hora</label>
                                        <Input
                                            type="time"
                                            name="consulado_time"
                                            value={item.consulado_time}
                                            onChange={(e: any) => handleChange(e, item.client_id)}
                                        />
                                    </Col>
                                </Row>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">CAS</p>
                                <Row>
                                    <Col xs={24} md={10}>
                                        <label className="text-xs text-gray-500 mb-1 block">Ciudad</label>
                                        <select
                                            name="cas_city"
                                            value={item.cas_city}
                                            onChange={(e) => handleChange(e, item.client_id)}
                                            className={selectClass}
                                        >
                                            <option value="">Seleccione...</option>
                                            {MEXICO_CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
                                        <Input
                                            type="date"
                                            name="cas"
                                            value={item.cas}
                                            onChange={(e: any) => handleChange(e, item.client_id)}
                                        />
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <label className="text-xs text-gray-500 mb-1 block">Hora</label>
                                        <Input
                                            type="time"
                                            name="cas_time"
                                            value={item.cas_time}
                                            onChange={(e: any) => handleChange(e, item.client_id)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    ))}
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-3">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button appearance="primary" onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalSchedule;
