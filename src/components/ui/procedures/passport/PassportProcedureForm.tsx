import { useEffect, useState } from "react";
import { Col, Divider, Grid, Message, Row, Tabs } from "rsuite";
import { FaTrashAlt } from "react-icons/fa";


import Button from "../../../common/Button";
import Toast from "../../../common/Toast";
import ClientForm from "../ClientForm";
import PassportForm from "../PassportForm";

import { Client, Passport } from "../../../../utils/interfaces/procedure";
import { PassportEntry } from "../../../../utils/interfaces/passportSales";
import { swalConfirm } from "../../../../utils/functions";
import SelectForm from "../../../common/Select";

interface Props {
    procedureType: string;
    setProcedureType: (value: string) => void;
    formData: PassportEntry[];
    setFormData: (list: PassportEntry[]) => void;
    errorPhone: string;
    setErrorPhone: (value: string) => void;
    errors: string[];
    setErrors: (value: string[]) => void;
}

const defaultEntry = (): PassportEntry => ({
    title: 'Solicitante',
    options: {
        option: {
            firstTime: { title: 'Primera vez', value: false },
            renewal:   { title: 'Renovación',  value: false }
        }
    },
    client: {
        names: '', lastname1: '', lastname2: '', curp: '', birthdate: '',
        country: 42, state: -1, city: '', phone: ''
    },
    passport: {
        passport_number: '', passport_expedition_date: '', passport_expiration_date: '',
        passport_country_expedition: 42, expirations: { time: '', complete: '', discount: '' }
    }
});

const PassportProcedureForm = ({
    procedureType, setProcedureType,
    formData, setFormData,
    errorPhone, setErrorPhone,
    errors, setErrors
}: Props) => {
    const typeOptions = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Familiar',   label: 'Familiar'   },
        { value: 'Grupo',      label: 'Grupo'       }
    ];

    const [activeKey, setActiveKey] = useState('client_0');

    const onSelectOption = (index: number, key: 'firstTime' | 'renewal') => {
        const other = key === 'firstTime' ? 'renewal' : 'firstTime';
        const list = formData.map((item, i) => {
            if (i !== index) return item;
            const already = item.options.option[key].value;
            return {
                ...item,
                options: {
                    option: {
                        ...item.options.option,
                        [key]:  { ...item.options.option[key],  value: !already },
                        [other]:{ ...item.options.option[other], value: false    }
                    }
                }
            };
        });
        setFormData(list);
        setErrors([]);
    };

    const handleChange = (field: string, value: any, index: number) => {
        setFormData(formData.map((form, i) => i === index ? { ...form, [field]: value } : form));
        setErrors([]);
    };

    const handleUpdateAfterSelect = (element: any, index: number) => {
        setFormData(formData.map((form, i) =>
            i === index ? { ...form, client: element.client, passport: element.passport } : form
        ));
    };

    const onAddClient = () => {
        if (formData.length < 10) {
            setFormData([...formData, defaultEntry()]);
            setActiveKey('client_' + formData.length);
            return;
        }
        Toast.fire('Error', 'Ha alcanzado el número máximo de solicitantes', 'error');
    };

    const onDeleteClient = (index: number) => {
        swalConfirm({
            title: 'Alerta',
            text: '¿Desea eliminar al solicitante?',
            confirmText: 'Sí, eliminar',
            confirmFunction: () => {
                setActiveKey('client_0');
                setFormData(formData.filter((_, i) => i !== index));
            }
        });
    };

    const onTypeChange = (value: string) => {
        if (value === 'Individual' && formData.length > 1) {
            swalConfirm({
                title: 'Alerta',
                text: 'Si selecciona esta opción se eliminarán los solicitantes adicionales, ¿desea continuar?',
                confirmText: 'Sí, continuar',
                confirmFunction: () => setFormData([formData[0]])
            });
        }
        setProcedureType(value);
        if (value === '') setFormData([defaultEntry()]);
        setActiveKey('client_0');
    };

    useEffect(() => {
        if (formData.length === 0) setFormData([defaultEntry()]);
    }, []);

    return (
        <Grid fluid className="flex flex-col gap-2">
            <Row className="flex items-end procedure-form">
                <Col xs={4}>
                    <label>Tipo de trámite</label>
                    <SelectForm
                        id="type"
                        value={procedureType}
                        options={typeOptions}
                        handleChange={(e: any) => onTypeChange(e)}
                        required
                    />
                </Col>
                {procedureType !== 'Individual' && procedureType !== '' && (
                    <Col xs={4}>
                        <Button size="sm" appearance="ghost" onClick={onAddClient}>
                            Agregar solicitante
                        </Button>
                    </Col>
                )}
            </Row>

            {procedureType !== '' && (
                <>
                    <Divider className="my-2" />
                    <Row>
                        <Col xs={24}>
                            {errors.length > 0 && (
                                <Message type="error" className="mb-2">
                                    <ul className="m-0">
                                        {errors.map((err, i) => <li key={i}><label>{err}</label></li>)}
                                    </ul>
                                </Message>
                            )}
                        </Col>
                        <Col xs={24}>
                            <Tabs activeKey={activeKey} onSelect={(k: any) => setActiveKey(k)}>
                                {formData.map((item, index) =>
                                    <Tabs.Tab
                                        key={index}
                                        eventKey={'client_' + index}
                                        title={
                                            <div className="flex items-center">
                                                <span className="inline-block p-1">{item.title + ' ' + (index + 1)}</span>
                                                {index > 0 && (
                                                    <FaTrashAlt className="ml-3 cursor-pointer" onClick={() => onDeleteClient(index)} />
                                                )}
                                            </div>
                                        }
                                    >
                                        <Grid fluid className={'procedure-form-' + index}>
                                            <Row>
                                                <Col xs={24} lg={8} className="p-2 flex flex-col gap-2">
                                                    <label>Opciones</label>
                                                    {(Object.keys(item.options.option) as ('firstTime' | 'renewal')[]).map(key => {
                                                        const opt = item.options.option[key];
                                                        return (
                                                            <Button
                                                                key={key}
                                                                size="md"
                                                                onClick={() => onSelectOption(index, key)}
                                                                color={opt.value ? 'blue' : 'red'}
                                                                appearance={opt.value ? 'primary' : 'ghost'}
                                                                customClass="w-full"
                                                            >
                                                                {opt.title}
                                                            </Button>
                                                        );
                                                    })}
                                                </Col>
                                                <Col xs={24} lg={16}>
                                                    <ClientForm
                                                        client={item.client}
                                                        changeData={(c: Client) => handleChange('client', c, index)}
                                                        passport={item.passport as any}
                                                        handleUpdateAfterSelect={(el: any) => handleUpdateAfterSelect(el, index)}
                                                        index={index}
                                                        errorPhone={errorPhone}
                                                        setErrorPhone={setErrorPhone}
                                                    />
                                                </Col>
                                            </Row>

                                            {item.options.option.renewal.value && (
                                                <>
                                                    <Divider />
                                                    <Row>
                                                        <Col xs={24} lg={16} lgOffset={8}>
                                                            <PassportForm
                                                                passport={item.passport}
                                                                changeData={(p: Passport) => handleChange('passport', p, index)}
                                                                index={index}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}
                                        </Grid>
                                    </Tabs.Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </>
            )}
        </Grid>
    );
};

export default PassportProcedureForm;
