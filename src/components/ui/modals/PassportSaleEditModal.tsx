import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Divider, Grid, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Toast from "../../common/Toast";
import { IApp } from "../../../utils/interfaces/function";
import { PassportSalesInfo } from "../../../utils/interfaces/passportSales";
import { passportSalesUpdate } from "../../../utils/services/sales/passport";

const selectClass = "py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer";

const CONTACTS = [
    'Correo electrónico', 'Familiar/amistad', 'Otro', 'Recomendación',
    'Redes sociales', 'Teléfono', 'Volante', 'Visita presencial',
];

const STATUSES = ['Activo', 'Finalizado'];

type EditForm = {
    billing: {
        names: string; lastname1: string; lastname2: string; email: string; phone: string;
    };
    sale_process: {
        advance_payment: number; payable: number; contact: string;
    };
    status: string;
};

interface Props extends IApp {
    salesId: number;
    onSaved: () => void;
}

const PassportSaleEditModal = forwardRef(({ loader, salesId, onSaved }: Props, ref) => {
    const [open, setOpen]   = useState(false);
    const [form, setForm]   = useState<EditForm>({
        billing:      { names: '', lastname1: '', lastname2: '', email: '', phone: '' },
        sale_process: { advance_payment: 0, payable: 0, contact: '' },
        status:       ''
    });

    const handleShow = (info: PassportSalesInfo) => {
        setForm({
            billing: {
                names:     info.names,
                lastname1: info.lastname1,
                lastname2: info.lastname2 || '',
                email:     info.email || '',
                phone:     info.phone
            },
            sale_process: {
                advance_payment: parseFloat(info.advance_payment),
                payable:         parseFloat(info.payable),
                contact:         info.contact
            },
            status: info.status
        });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const onBillingChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm(prev => ({ ...prev, billing: { ...prev.billing, [name]: value } }));
    };

    const onProcessChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm(prev => ({
            ...prev,
            sale_process: { ...prev.sale_process, [name]: name === 'contact' ? value : parseFloat(value) || 0 }
        }));
    };

    const handleSubmit = async () => {
        loader.current?.handleShow('Guardando...');
        const response = await passportSalesUpdate(salesId, {
            billing:      form.billing,
            sale_process: form.sale_process,
            status:       form.status
        });
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
        <Modal size="md" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Editar datos de venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <fieldset>
                        <legend className="text-sm font-semibold mb-2">Datos de contacto / facturación</legend>
                        <Row>
                            <Col xs={24} md={12}>
                                <label className="text-xs text-gray-500 mb-1 block">Nombre(s)</label>
                                <Input name="names" value={form.billing.names} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="text-xs text-gray-500 mb-1 block">Apellido paterno</label>
                                <Input name="lastname1" value={form.billing.lastname1} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} md={12} className="mt-2">
                                <label className="text-xs text-gray-500 mb-1 block">Apellido materno</label>
                                <Input name="lastname2" value={form.billing.lastname2} onChange={onBillingChange} />
                            </Col>
                            <Col xs={24} md={12} className="mt-2">
                                <label className="text-xs text-gray-500 mb-1 block">Correo electrónico</label>
                                <Input name="email" type="email" value={form.billing.email} onChange={onBillingChange} />
                            </Col>
                            <Col xs={24} md={12} className="mt-2">
                                <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
                                <Input name="phone" type="tel" value={form.billing.phone} onChange={onBillingChange} required />
                            </Col>
                        </Row>
                    </fieldset>

                    <Divider className="my-3" />

                    <fieldset>
                        <legend className="text-sm font-semibold mb-2">Datos de pago</legend>
                        <Row>
                            <Col xs={24} md={8}>
                                <label className="text-xs text-gray-500 mb-1 block">Abono inicial</label>
                                <Input name="advance_payment" type="number" value={form.sale_process.advance_payment.toString()} onChange={onProcessChange} required />
                            </Col>
                            <Col xs={24} md={8}>
                                <label className="text-xs text-gray-500 mb-1 block">Por pagar</label>
                                <Input name="payable" type="number" value={form.sale_process.payable.toString()} onChange={onProcessChange} required />
                            </Col>
                            <Col xs={24} md={8}>
                                <label className="text-xs text-gray-500 mb-1 block">Medio de contacto</label>
                                <select
                                    value={form.sale_process.contact}
                                    onChange={(e) => setForm(prev => ({ ...prev, sale_process: { ...prev.sale_process, contact: e.target.value } }))}
                                    className={selectClass}
                                >
                                    <option value="">Seleccione...</option>
                                    {CONTACTS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </Col>
                        </Row>
                    </fieldset>

                    <Divider className="my-3" />

                    <fieldset>
                        <legend className="text-sm font-semibold mb-2">Estatus de la venta</legend>
                        <Row>
                            <Col xs={24} md={12}>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                    className={selectClass}
                                >
                                    <option value="">Seleccione...</option>
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Col>
                        </Row>
                    </fieldset>
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

export default PassportSaleEditModal;
