import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Divider, Grid, Message, Row } from "rsuite";

import Content from "../../components/common/Content";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import ProcedureForm from "../../components/ui/procedures/ProcedureForm";
import PassportProcedureForm from "../../components/ui/procedures/passport/PassportProcedureForm";
import EditPaymentForm from "../../components/ui/procedures/EditPaymentForm";

import { IApp } from "../../utils/interfaces/function";
import { EditPaymentData, SaleEditApplicant, SaleEditClient, SaleEditData, SaleEditPayload } from "../../utils/interfaces/sales";
import { salesEditData, salesEditUpdate } from "../../utils/services/sales/visa";
import { calculateAge, isValidForm } from "../../utils/functions";

type Procedure = 'Visa' | 'Pasaporte';

interface Props extends IApp {
    procedure: Procedure;
}

/** formulario del alta con el process_id del trámite existente (nuevos: sin process_id) */
type Entry = any;

const dateOnly = (value: string | null | undefined) => (value || '').slice(0, 10);

const opt = (title: string, value: boolean) => ({ title, value });

/** solicitante existente → formato del formulario de alta */
const toEntry = (c: SaleEditClient, procedure: Procedure): Entry => {
    const client = {
        id:        c.client.id,
        names:     c.client.names || '',
        lastname1: c.client.lastname1 || '',
        lastname2: c.client.lastname2 || '',
        curp:      c.client.curp || '',
        birthdate: dateOnly(c.client.birthdate),
        country:   c.client.country || 42,
        state:     c.client.state || -1,
        city:      c.client.city || '',
        phone:     c.client.phone || ''
    };

    const passport = {
        passport_number:             c.passport?.number || '',
        passport_expedition_date:    dateOnly(c.passport?.expedition_date),
        passport_expiration_date:    dateOnly(c.passport?.expiration_date),
        passport_country_expedition: c.passport?.country_expedition || 42,
        passport_state_expedition:   c.passport?.state_expedition || '',
        passport_city_expedition:    c.passport?.city_expedition || '',
        expirations: { time: '', complete: '', discount: '' }
    };

    const option = {
        firstTime: opt('Primera vez', c.subtype === 'Primera vez'),
        renewal:   opt('Renovación', c.subtype === 'Renovación')
    };

    if (procedure === 'Pasaporte') {
        return { title: 'Solicitante', process_id: c.process_id, option_type: c.option_type, age_type: c.age_type, options: { option }, client, passport };
    }

    return {
        title: 'Solicitante',
        process_id: c.process_id,
        age_type: c.age_type,
        options: {
            type: {
                tourist: opt('Turista', c.visa_type === 'Turista'),
                work:    opt('Trabajo', c.visa_type === 'Trabajo')
            },
            option,
            renew: {
                expired:      opt('Vencida o por vencer', c.option_type === 'Vencida o por vencer'),
                lost:         opt('Extraviado', c.option_type === 'Extraviado'),
                expiredYears: opt('Vencido +4 años', c.option_type === 'Vencido +4 años')
            }
        },
        client,
        passport,
        visa: {
            visa_number:           c.visa?.number || '',
            visa_expedition_date:  dateOnly(c.visa?.expedition_date),
            visa_expiration_date:  dateOnly(c.visa?.expiration_date),
            visa_expedition_place: c.visa?.expedition_city || ''
        }
    };
};

const subtypeOf = (entry: Entry) =>
    entry.options.option.renewal.value ? 'Renovación' : entry.options.option.firstTime.value ? 'Primera vez' : '';

/** formulario → payload del API */
const toApplicant = (data: Entry, procedure: Procedure): SaleEditApplicant => {
    const subtype  = subtypeOf(data);
    const age_type = data.client.birthdate
        ? (calculateAge(data.client.birthdate) >= 18 ? 'Mayor de edad' : 'Menor de edad')
        : (data.age_type || 'Mayor de edad');

    const client = {
        names:            data.client.names,
        lastname1:        data.client.lastname1,
        lastname2:        data.client.lastname2,
        curp:             data.client.curp,
        birthdate:        data.client.birthdate,
        city:             data.client.city,
        country_birth_id: data.client.country,
        state_birth_id:   data.client.state,
        phone:            data.client.phone
    };

    const item: SaleEditApplicant = { client, process: {} };

    if (data.process_id) item.process_id = data.process_id;

    if (procedure === 'Visa') {
        const renew = Object.values(data.options.renew) as { title: string, value: boolean }[];

        item.process = {
            subtype,
            age_type,
            option_type: renew.find(o => o.value)?.title || null,
            visa_type:   data.options.type.work.value ? 'Trabajo' : 'Turista'
        };
        item.passport = {
            number:             data.passport.passport_number,
            expedition_date:    data.passport.passport_expedition_date || null,
            expiration_date:    data.passport.passport_expiration_date || null,
            country_expedition: data.passport.passport_country_expedition,
            state_expedition:   data.passport.passport_state_expedition,
            city_expedition:    data.passport.passport_city_expedition
        };
        item.visa = subtype === 'Renovación' ? {
            number:          data.visa.visa_number,
            expedition_date: data.visa.visa_expedition_date || null,
            expiration_date: data.visa.visa_expiration_date || null,
            expedition_city: data.visa.visa_expedition_place
        } : null;

        return item;
    }

    // pasaporte: la opción de renovación no se captura en el formulario, se conserva la registrada
    item.process = {
        subtype,
        age_type,
        option_type: subtype === 'Renovación' ? (data.option_type || null) : null
    };

    if (subtype === 'Renovación' && data.passport.passport_number) {
        item.passport = {
            number:             data.passport.passport_number,
            expedition_date:    data.passport.passport_expedition_date || null,
            expiration_date:    data.passport.passport_expiration_date || null,
            country_expedition: data.passport.passport_country_expedition
        };
    }

    return item;
};

const emptyPayment: EditPaymentData = {
    contact: '',
    billing: { names: '', lastname1: '', lastname2: '', email: '', phone: '' },
    concept: '', price: 0, total: '0',
    amount: '', method_payment: '', receipt: '', reference: ''
};

/**
 * Edición de una venta (visa o pasaporte) con el mismo formulario del alta.
 * Si se agrega un solicitante o cambia primera vez/renovación, se pasa al paso de
 * pago para verificar el total y registrar un abono; si no, solo se guarda.
 */
const SaleEdit = ({ loader, procedure }: Props) => {
    const navigate = useNavigate();
    const { id }   = useParams<{ id: string }>();
    const listUrl  = procedure === 'Visa' ? '/procedures/visa/list' : '/procedures/passport/list';

    const [sale, setSale]                   = useState<SaleEditData | null>(null);
    const [formData, setFormData]           = useState<Entry[]>([]);
    const [procedureType, setProcedureType] = useState('');
    const [showPayment, setShowPayment]     = useState(false);
    const [payment, setPayment]             = useState<EditPaymentData>(emptyPayment);
    const [errors, setErrors]               = useState<string[]>([]);
    const [errorPhone, setErrorPhone]       = useState('');
    const [errorEmail, setErrorEmail]       = useState('');

    const onLoad = async () => {
        loader.current?.handleShow('Cargando...');
        const response = await salesEditData(Number(id));
        loader.current?.handleClose();

        if (!response?.success || response.data.procedure !== procedure) {
            Toast.fire('Error', response?.message || 'No se encontró el trámite', 'error');
            navigate(listUrl);
            return;
        }

        const data = response.data;
        setSale(data);
        setProcedureType(data.type === 'Venta General' ? 'Individual' : data.type);
        setFormData(data.clients.map(c => toEntry(c, procedure)));
        setPayment({
            ...emptyPayment,
            contact: data.contact || '',
            concept: data.concept_id ? String(data.concept_id) : '',
            billing: {
                names:     data.billing?.names || '',
                lastname1: data.billing?.lastname1 || '',
                lastname2: data.billing?.lastname2 || '',
                email:     data.billing?.email || '',
                phone:     data.billing?.phone || ''
            }
        });
    };

    useEffect(() => { onLoad(); }, []);

    const originalCount = sale?.clients.length || 0;

    /** solicitantes nuevos o cambio de primera vez/renovación → hay que verificar el pago */
    const pricingChanged = useMemo(() => {
        if (!sale) return false;
        if (formData.length > originalCount) return true;
        return formData.some((entry, i) => i < originalCount && subtypeOf(entry) !== sale.clients[i].subtype);
    }, [formData, sale]);

    /** misma validación que el alta */
    const validateApplicants = (): boolean => {
        if (!isValidForm('div.procedure-form')) {
            Toast.fire('Error', 'Campos requeridos', 'error');
            return false;
        }

        const errorsOptions: string[] = [];
        const errorForm: string[]     = [];

        formData.forEach((form, index) => {
            const label = form.title + ' ' + (index + 1);

            if (procedure === 'Visa') {
                const groups  = Object.keys(form.options);
                let totalValid = form.options.option.renewal.value ? 0 : 1;
                groups.forEach(key => {
                    if (Object.values(form.options[key]).some((o: any) => o.value)) totalValid++;
                });
                if (totalValid !== groups.length) errorsOptions.push(label);
            } else if (!subtypeOf(form)) {
                errorsOptions.push(label);
            }

            if (!isValidForm('div.procedure-form-' + index) || errorPhone !== '') {
                errorForm.push(label);
            }
        });

        const list: string[] = [];
        if (errorsOptions.length > 0) list.push(`Debe seleccionar todas las opciones (${errorsOptions.join(', ')})`);
        if (errorForm.length > 0)     list.push(`Existen errores en los formularios (${errorForm.join(', ')})`);
        setErrors(list);

        return list.length === 0;
    };

    const buildPayload = (withPayment: boolean): SaleEditPayload => {
        const applicants = formData.map(entry => toApplicant(entry, procedure));

        const payload: SaleEditPayload = {
            type:        procedureType,
            clients:     applicants.filter(a => a.process_id),
            new_clients: applicants.filter(a => !a.process_id)
        };

        if (withPayment) {
            payload.billing = payment.billing;
            payload.contact = payment.contact;
            payload.pricing = { sales_concepts_id: payment.concept, total: parseFloat(payment.total) || 0 };

            const amount = parseFloat(payment.amount) || 0;
            if (amount > 0) {
                payload.payment = {
                    method_payment: payment.method_payment,
                    amount,
                    receipt:   payment.receipt,
                    reference: payment.reference || null
                };
            }
        }

        return payload;
    };

    const save = async (withPayment: boolean) => {
        loader.current?.handleShow('Guardando...');
        const response = await salesEditUpdate(procedure, Number(id), buildPayload(withPayment));
        loader.current?.handleClose();

        if (response?.success) {
            Toast.fire('Correcto', response.message, 'success');
            navigate(listUrl);
            return;
        }

        Toast.fire('Error', response?.message || 'No se pudo guardar', 'error');
    };

    /** sin cambios de precio: guardar directo */
    const onSave = () => {
        if (validateApplicants()) save(false);
    };

    /** con cambios de precio: pasar a verificar el pago */
    const onNext = () => {
        if (!validateApplicants()) return;
        setErrorPhone('');
        setShowPayment(true);
    };

    const onSavePayment = () => {
        if (!isValidForm('div.edit-payment-form')) {
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if (errorEmail !== '') {
            Toast.fire('Error', 'Existen errores en los datos capturados, verifique la información', 'error');
            return;
        }

        const total  = parseFloat(payment.total) || 0;
        const amount = parseFloat(payment.amount) || 0;
        const paid   = sale?.paid || 0;

        if (amount < 0) {
            Toast.fire('Error', 'El abono no es válido', 'error');
            return;
        }

        if (paid + amount > total) {
            Toast.fire({ title: 'Error', text: 'Lo pagado más el abono no puede ser mayor al total del trámite', icon: 'error', timer: 6000 });
            return;
        }

        save(true);
    };

    const isVisa = procedure === 'Visa';

    return (
        <Content
            url={isVisa ? '/procedures/visa/list' : '/procedures/passport/list'}
            page={isVisa ? 'Visas' : 'Pasaporte'}
            subpage="Editar"
            title={`Editar trámite de ${isVisa ? 'visa' : 'pasaporte'}${sale ? ' - ' + sale.folio : ''}`}
            autoHeight
        >
            <>
                {sale && (showPayment ? (
                    <EditPaymentForm
                        procedure={procedure}
                        applicants={formData.length}
                        paid={sale.paid}
                        data={payment}
                        setData={setPayment}
                        errorEmail={errorEmail}
                        setErrorEmail={setErrorEmail}
                    />
                ) : isVisa ? (
                    <ProcedureForm
                        procedureType={procedureType}
                        setProcedureType={setProcedureType}
                        formData={formData}
                        setFormData={setFormData}
                        errorPhone={errorPhone}
                        setErrorPhone={setErrorPhone}
                        errors={errors}
                        setErrors={setErrors}
                        lockedCount={originalCount}
                    />
                ) : (
                    <PassportProcedureForm
                        procedureType={procedureType}
                        setProcedureType={setProcedureType}
                        formData={formData}
                        setFormData={setFormData}
                        errorPhone={errorPhone}
                        setErrorPhone={setErrorPhone}
                        errors={errors}
                        setErrors={setErrors}
                        lockedCount={originalCount}
                    />
                ))}

                <Grid fluid>
                    {!showPayment && pricingChanged && (
                        <Message type="info" className="mt-2">
                            Agregó solicitantes o cambió primera vez / renovación: continúe para verificar el pago.
                        </Message>
                    )}
                    <Divider className="mt-2" />
                    <Row>
                        <Col xs={24}>
                            {showPayment ? (
                                <>
                                    <Button onClick={() => setShowPayment(false)} customClass="me-2">Anterior</Button>
                                    <Button color="red" customClass="me-2" onClick={onSavePayment}>Guardar</Button>
                                </>
                            ) : pricingChanged ? (
                                <Button customClass="me-2" onClick={onNext}>Siguiente</Button>
                            ) : (
                                <Button customClass="me-2" onClick={onSave}>Guardar</Button>
                            )}
                            <Button appearance="default" onClick={() => navigate(listUrl)}>Cancelar</Button>
                        </Col>
                    </Row>
                </Grid>
            </>
        </Content>
    );
};

export default SaleEdit;
