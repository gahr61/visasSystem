import React from "react";
import { Col, Grid, Row } from "rsuite";

import Input from "../../common/Input";
import SelectForm, { ISelectOptions } from "../../common/Select";

import { EditPaymentData } from "../../../utils/interfaces/sales";

const CONTACTS: ISelectOptions[] = [
    { value: 'Correo electrónico', label: 'Correo electrónico' },
    { value: 'Familiar/amistad', label: 'Familiar/amistad' },
    { value: 'Otro', label: 'Otro' },
    { value: 'Recomendación', label: 'Recomendación' },
    { value: 'Redes sociales', label: 'Redes sociales' },
    { value: 'Teléfono', label: 'Teléfono' },
    { value: 'Volante', label: 'Volante' },
    { value: 'Visita presencial', label: 'Visita presencial' },
];

interface Props {
    procedure: 'Visa' | 'Pasaporte';
    data: EditPaymentData;
    setData: (data: EditPaymentData) => void;
    errorEmail: string;
    setErrorEmail: (value: string) => void;
}

/**
 * Datos de quien realiza el trámite (sales_billing). Su teléfono es el número al que
 * se envía el mensaje de WhatsApp desde el listado.
 */
const BillingForm = ({ procedure, data, setData, errorEmail, setErrorEmail }: Props) => {
    const onBillingChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setData({ ...data, billing: { ...data.billing, [name]: value } });
    };

    return (
        <Grid fluid>
            <Row className="billing-form">
                <Col xs={24}>
                    <fieldset>
                        <legend className="text-lg">Datos de quien realiza el trámite</legend>
                        <Row>
                            <Col xs={24} lg={4}>
                                <label>Nombre(s)</label>
                                <Input id="names" value={data.billing.names} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Apellido paterno</label>
                                <Input id="lastname1" value={data.billing.lastname1} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Apellido materno</label>
                                <Input id="lastname2" value={data.billing.lastname2} onChange={onBillingChange} />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>
                                    Correo electrónico
                                    {procedure === 'Pasaporte' && <span className="text-xs text-gray-400"> (opcional)</span>}
                                </label>
                                <span className="text-xs text-red-400 ms-2">{errorEmail}</span>
                                <Input
                                    id="email" type="email" value={data.billing.email}
                                    onChange={onBillingChange} setErrorEmail={setErrorEmail}
                                    required={procedure === 'Visa'}
                                />
                            </Col>
                            <Col xs={24} lg={3}>
                                <label>Teléfono (WhatsApp)</label>
                                <Input id="phone" type="tel" value={data.billing.phone} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} lg={3}>
                                <label>Medio de contacto</label>
                                <SelectForm
                                    id="contact" options={CONTACTS} value={data.contact}
                                    handleChange={(v: string) => setData({ ...data, contact: v })} required
                                />
                            </Col>
                        </Row>
                    </fieldset>
                </Col>
            </Row>
        </Grid>
    );
};

export default BillingForm;
