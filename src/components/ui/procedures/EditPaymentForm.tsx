import React, { useEffect, useState } from "react";
import { Col, Divider, Grid, Row } from "rsuite";

import Input from "../../common/Input";
import SelectForm, { ISelectOptions } from "../../common/Select";

import { formatPrice } from "../../../utils/functions";
import { EditPaymentData } from "../../../utils/interfaces/sales";
import {
    conceptsPassportMinimumPayment, conceptsPassportPrices, conceptsVisaPrices
} from "../../../utils/services/concepts";

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

const PAYMENT_METHODS: ISelectOptions[] = [
    { value: 'Depósito Bancario', label: 'Depósito Bancario' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia Electroníca', label: 'Transferencia Electroníca' }
];

type Concept = ISelectOptions & { price: string };

interface Props {
    procedure: 'Visa' | 'Pasaporte';
    /** número de solicitantes después de la edición */
    applicants: number;
    /** pagado a la fecha */
    paid: number;
    data: EditPaymentData;
    setData: (data: EditPaymentData) => void;
    errorEmail: string;
    setErrorEmail: (value: string) => void;
}

const num = (value: string | number) => {
    const n = parseFloat(String(value));
    return isNaN(n) ? 0 : n;
};

/**
 * Paso de pago de la edición de una venta (mismo flujo que el alta): datos de quien
 * realiza el trámite, concepto y total recalculado, pagado a la fecha y abono adicional
 */
const EditPaymentForm = ({ procedure, applicants, paid, data, setData, errorEmail, setErrorEmail }: Props) => {
    const [concepts, setConcepts] = useState<Concept[]>([]);

    const priceOf = (list: Concept[], id: string) => num(list.find(c => String(c.value) === String(id))?.price ?? 0);

    const onLoad = async () => {
        let list: Concept[] = [];

        if (procedure === 'Visa') {
            const response = await conceptsVisaPrices();
            if (response?.success) list = response.data;
        } else {
            const [minimum, prices] = await Promise.all([conceptsPassportMinimumPayment(), conceptsPassportPrices()]);
            if (minimum?.success && minimum.data) {
                list.push({ value: minimum.data.id, label: minimum.data.name, price: minimum.data.price });
            }
            if (prices?.success) {
                list = [...list, ...prices.data.filter((c: Concept) => !list.some(l => String(l.value) === String(c.value)))];
            }
        }

        setConcepts(list);

        // precio vigente del concepto de la venta por el número de solicitantes
        const concept = data.concept !== '' && list.some(c => String(c.value) === String(data.concept))
            ? data.concept
            : (list[0] ? String(list[0].value) : '');
        const price = priceOf(list, concept);

        setData({ ...data, concept, price, total: String(Math.round(price * applicants * 100) / 100) });
    };

    useEffect(() => { onLoad(); }, []);

    const onConceptChange = (value: string) => {
        const price = priceOf(concepts, value);
        setData({ ...data, concept: value, price, total: String(Math.round(price * applicants * 100) / 100) });
    };

    const onBillingChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setData({ ...data, billing: { ...data.billing, [name]: value } });
    };

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setData({ ...data, [name]: value });
    };

    const onSelect = (name: keyof EditPaymentData, value: string) => {
        const next = { ...data, [name]: value };
        if (name === 'method_payment' && value === 'Efectivo') next.reference = '';
        setData(next);
    };

    const total    = num(data.total);
    const amount   = num(data.amount);
    const pending  = Math.round((total - paid - amount) * 100) / 100;
    const needsRef = ['Depósito Bancario', 'Transferencia Electroníca', 'Tarjeta'].includes(data.method_payment);

    const td = "px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-800";

    return (
        <Grid fluid>
            <Row className="edit-payment-form">
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
                                <label>Teléfono</label>
                                <Input id="phone" type="tel" value={data.billing.phone} onChange={onBillingChange} required />
                            </Col>
                            <Col xs={24} lg={3}>
                                <label>Medio de contacto</label>
                                <SelectForm id="contact" options={CONTACTS} value={data.contact} handleChange={(v: string) => onSelect('contact', v)} required />
                            </Col>
                        </Row>
                    </fieldset>

                    <Divider />

                    <fieldset>
                        <legend className="text-lg">Pago</legend>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    {['Trámite', 'Concepto', 'Cantidad', 'Precio', 'Total'].map(c =>
                                        <th key={c} scope="col" className="text-start px-6 py-2 font-medium text-gray-500">{c}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className={td}>{procedure}</td>
                                    <td className={td + " min-w-56"}>
                                        <SelectForm id="concept" options={concepts} value={data.concept} handleChange={onConceptChange} required />
                                    </td>
                                    <td className={td}>{applicants}</td>
                                    <td className={td}>{data.price > 0 && formatPrice(data.price)}</td>
                                    <td className={td + " text-end w-40"}>
                                        <Input id="total" type="number" value={data.total} onChange={onChange} customClass="text-end" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={td + " text-end"}>Pagado a la fecha</td>
                                    <td className={td + " text-end"}>{formatPrice(paid)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={td + " text-end"}>Abono adicional</td>
                                    <td className={td + " text-end"}>
                                        <Input id="amount" type="number" value={data.amount} onChange={onChange} customClass="text-end" placeholder="0.00" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={td + " text-end"}>Total restante</td>
                                    <td className={td + " text-end " + (pending < 0 ? 'text-red-600' : '')}>{formatPrice(pending)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {amount > 0 && (
                            <Row className="mt-3">
                                <Col xs={24} lg={6}>
                                    <label>Método de pago del abono</label>
                                    <SelectForm id="method_payment" options={PAYMENT_METHODS} value={data.method_payment} handleChange={(v: string) => onSelect('method_payment', v)} required />
                                </Col>
                                {needsRef && (
                                    <Col xs={24} lg={4}>
                                        <label>No. Referencia</label>
                                        <Input id="reference" type="number" value={data.reference} onChange={onChange} required />
                                    </Col>
                                )}
                                <Col xs={24} lg={4}>
                                    <label>No. Recibo</label>
                                    <Input id="receipt" type="number" value={data.receipt} onChange={onChange} required />
                                </Col>
                            </Row>
                        )}
                    </fieldset>
                </Col>
            </Row>
        </Grid>
    );
};

export default EditPaymentForm;
