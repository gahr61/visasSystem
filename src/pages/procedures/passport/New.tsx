import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Divider, Grid, Row } from "rsuite";
import moment from "moment";

import Content from "../../../components/common/Content";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";
import PassportProcedureForm from "../../../components/ui/procedures/passport/PassportProcedureForm";
import PaymentForm from "../../../components/ui/procedures/PaymentForm";

import { IApp } from "../../../utils/interfaces/function";
import { PassportEntry } from "../../../utils/interfaces/passportSales";
import { passportSalesStore } from "../../../utils/services/sales/passport";
import { calculateAge, isValidForm } from "../../../utils/functions";

const PassportNew = ({ loader }: IApp) => {
    const navigate = useNavigate();

    const [procedureType, setProcedureType] = useState('');
    const [formData, setFormData]           = useState<PassportEntry[]>([]);
    const [showPayment, setShowPayment]     = useState(false);
    const [errors, setErrors]               = useState<string[]>([]);
    const [errorPhone, setErrorPhone]       = useState('');
    const [errorEmail, setErrorEmail]       = useState('');

    const [dataPayment, setDataPayment] = useState<any>({
        payment: {
            branch_office_id: '',
            seller_id: '',
            contact: '',
            flyer_id: '',
            client: { names: '', lastname1: '', lastname2: '', email: '', phone: '' },
            method_payment: '',
            receipt: '',
            reference: ''
        },
        procedures: [],
        options: {
            minPayment: true,
            minPrice: 0,
            otherPayment: false,
            otherPrice: 0,
            totalProcedure: 0,
            totalPay: 0,
            totalPerPay: 0
        }
    });

    const showPaymentForm = (value: boolean) => {
        let errorsOptions: string[] = [];
        let errorForm: string[]     = [];
        const newErrors: string[]   = [];

        if (!isValidForm('div.procedure-form')) {
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if (value === true) {
            formData.forEach((form, index) => {
                const { firstTime, renewal } = form.options.option;
                if (!firstTime.value && !renewal.value) {
                    errorsOptions.push(form.title + ' ' + (index + 1));
                }

                if (!isValidForm('div.procedure-form-' + index) || errorPhone !== '') {
                    errorForm.push(form.title + ' ' + (index + 1));
                }
            });

            if (errorsOptions.length > 0)
                newErrors.push(`Debe seleccionar una opción (${errorsOptions.join(', ')})`);
            if (errorForm.length > 0)
                newErrors.push(`Existen errores en los formularios (${errorForm.join(', ')})`);

            setErrors(newErrors);
        }

        if (newErrors.length === 0) {
            const procedure = {
                procedure: 'Pasaporte',
                concept: '',
                amount: formData.length,
                price: 0,
                total: 0
            };

            const payment = {
                ...dataPayment.payment,
                client: {
                    names:     formData.length === 1 ? formData[0].client.names     : '',
                    lastname1: formData.length === 1 ? formData[0].client.lastname1 : '',
                    lastname2: formData.length === 1 ? formData[0].client.lastname2 : '',
                    email: '',
                    phone:     formData.length === 1 ? formData[0].client.phone     : ''
                }
            };

            setDataPayment({ ...dataPayment, payment, procedures: [procedure] });
            setShowPayment(value);
            setErrorPhone('');
        }
    };

    const handlePay = async () => {
        if (!isValidForm('div.payment-form')) {
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if (errorEmail !== '' || errorPhone !== '') {
            Toast.fire('Error', 'Existen errores en los datos capturados, verifique la información', 'error');
            return;
        }

        const perPay = parseInt(dataPayment.options.totalPerPay);
        
        if (perPay > dataPayment.options.totalProcedure) {
            Toast.fire({ title: 'Error', text: 'El total a pagar no puede ser mayor al total del trámite', icon: 'error', timer: 6000 });
            return;
        }

        loader.current?.handleShow('Guardando...');

        const commissions: any[] = [
            { users_id: dataPayment.payment.seller_id, commission: 'Pasaporte', type: 'seller' }
        ];
        if (dataPayment.payment.flyer_id !== '') {
            commissions.push({ users_id: dataPayment.payment.flyer_id, commission: 'Volanteo', type: 'flyer' });
        }

        const clients = formData.map((data) => {
            const age = calculateAge(data.client.birthdate);
            const isRenewal = data.options.option.renewal.value;

            let item: any = {
                client: {
                    names:            data.client.names,
                    lastname1:        data.client.lastname1,
                    lastname2:        data.client.lastname2,
                    curp:             data.client.curp,
                    birthdate:        data.client.birthdate,
                    city:             data.client.city,
                    country_birth_id: data.client.country,
                    state_birth_id:   data.client.state
                },
                phones: [
                    { id: (data.client as any).phone_id || null, number: data.client.phone, type: 'Celular' }
                ],
                process: {
                    subtype:     isRenewal ? 'Renovación' : 'Primera vez',
                    age_type:    age >= 18 ? 'Mayor de edad' : 'Menor de edad',
                    option_type: null,
                    observations: null
                }
            };

            if ((data.client as any).id) {
                item.client.id = (data.client as any).id;
            }

            if (isRenewal && data.passport.passport_number) {
                item.passport = {
                    number:               data.passport.passport_number,
                    expedition_date:      data.passport.passport_expedition_date || null,
                    expiration_date:      data.passport.passport_expiration_date || null,
                    expedition_country_id: data.passport.passport_country_expedition
                };
                if ((data.passport as any).id) {
                    item.passport.id = (data.passport as any).id;
                }
            }

            return item;
        });

        const obj = {
            sales: {
                branch_office_id: dataPayment.payment.branch_office_id,
                date:  moment().format('YYYY-MM-DD'),
                folio: 'PP' + moment().format('YYYYMMDDHHMMss'),
                total: dataPayment.options.totalProcedure,
                type:  procedureType as 'Individual' | 'Familiar' | 'Grupo'
            },
            billing: {
                email:     dataPayment.payment.client.email,
                names:     dataPayment.payment.client.names,
                lastname1: dataPayment.payment.client.lastname1,
                lastname2: dataPayment.payment.client.lastname2,
                phone:     dataPayment.payment.client.phone
            },
            sale_process: {
                advance_payment: dataPayment.options.totalPerPay,
                payable:         dataPayment.options.totalPay,
                contact:         dataPayment.payment.contact
            },
            payment: {
                method_payment: dataPayment.payment.method_payment,
                amount:         dataPayment.options.totalPerPay,
                platform:       'Sistema',
                receipt:        dataPayment.payment.receipt,
                reference:      dataPayment.payment.reference || null
            },
            commissions,
            details: dataPayment.procedures.map((p: any) => ({
                sales_concepts_id: p.concept,
                amount: p.total
            })),
            clients
        };

        const response = await passportSalesStore(obj);
        loader.current?.handleClose();

        if (response?.success) {
            Toast.fire('Correcto', response.message, 'success');
            navigate('/procedures/passport/list');
            return;
        }

        Toast.fire('Error', response.message, 'error');
    };

    return (
        <Content
            url="/procedures/passport/new"
            page="Pasaporte"
            subpage="Nuevo"
            title="Nuevo trámite de pasaporte"
            autoHeight
        >
            <>
                {showPayment ? (
                    <PaymentForm
                        dataPayment={dataPayment}
                        setDataPayment={setDataPayment}
                        formData={formData}
                        errorEmail={errorEmail}
                        setErrorEmail={setErrorEmail}
                        errorPhone={errorPhone}
                        setErrorPhone={setErrorPhone}
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
                    />
                )}

                <Grid fluid>
                    <Divider className="mt-2" />
                    <Row>
                        <Col xs={24}>
                            {showPayment ? (
                                <>
                                    <Button onClick={() => showPaymentForm(false)} customClass="me-2">Anterior</Button>
                                    <Button color="red" customClass="me-2" onClick={handlePay}>Pagar</Button>
                                </>
                            ) : (
                                <Button customClass="me-2" onClick={() => showPaymentForm(true)}>Siguiente</Button>
                            )}
                            <Button appearance="default" onClick={() => navigate('/procedures/passport/list')}>Cancelar</Button>
                        </Col>
                    </Row>
                </Grid>
            </>
        </Content>
    );
};

export default PassportNew;
