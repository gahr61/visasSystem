import { Col, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import Toast from "../../../common/Toast";
import Button from "../../../common/Button";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getStates } from "../../../../utils/services/countries";
import { useAddressStore } from "../../../../utils/stores/useAddressStore";

const LANGUAGES: ISelectOptions[] = [
    { value: 'Español',         label: 'Español' },
    { value: 'Inglés',          label: 'Inglés' },
    { value: 'Francés',         label: 'Francés' },
    { value: 'Alemán',          label: 'Alemán' },
    { value: 'Portugués',       label: 'Portugués' },
    { value: 'Italiano',        label: 'Italiano' },
    { value: 'Chino (Mandarín)',label: 'Chino (Mandarín)' },
    { value: 'Japonés',         label: 'Japonés' },
    { value: 'Árabe',           label: 'Árabe' },
    { value: 'Ruso',            label: 'Ruso' },
    { value: 'Coreano',         label: 'Coreano' },
    { value: 'Hindi',           label: 'Hindi' },
    { value: 'Otro',            label: 'Otro' },
];

type Props = {
    personalInfo: any,
    handleChange:(e:any) => void
}

const PersonalData = ({
    personalInfo,
    handleChange
}:Props)=>{

    const countries = useAddressStore(state => state.countries);

    const [states, setStates] = useState<ISelectOptions[]>([]);
    const [passportStates, setPassportStates] = useState<ISelectOptions[]>([]);
    const [spouseStates, setSpouseStates] = useState<ISelectOptions[]>([]);
    const [languageForm, setLanguageForm] = useState({ language: '', percentage: '' });

    const languageColumns: Columns[] = [
        { key: 'language',   title: 'Idioma',     grow: 3, render: (row: any) => row.language },
        { key: 'percentage', title: 'Porcentaje',  grow: 1, render: (row: any) => row.percentage + '%' },
        { key: 'actions',    title: '',            grow: 1, render: (row: any) =>
            <ButtonTable
                controlId="delete"
                title="Eliminar"
                icon={<FaTrashAlt />}
                onClick={() => handleDeleteLanguage(row.language)}
            />
        },
    ];

    const onLoad = async ()=>{
        onLoadStates(personalInfo.birthplace.country || 42, 'birthplace');
        onLoadStates(personalInfo.passport.country_expedition || 42, 'passport');

        if(personalInfo.spouse?.country){
            onLoadStates(personalInfo.spouse.country, 'spouse');
        }
    }

    const onChangeField = (name: string, value: string, field:string)=>{
        handleChange({
            currentTarget:{
                name:field,
                value:{
                    ...personalInfo[field],
                    [name]: value
                }
            }
        });

        if(name === 'country' && field === 'birthplace' && value !== ''){
            onLoadStates(parseInt(value), 'birtplace');
        }

        if(name === 'country' && field === 'passport' && value !== ''){
            onLoadStates(parseInt(value), 'passport');
        }

        if(name === 'country' && field === 'spouse' && value !== ''){
            onLoadStates(parseInt(value), 'spouse');
        }
    }

    const onLoadStates = async (country_id:number, field:string) => {
        const response = await getStates(country_id);

        if(response && response.success){
            if(field === 'birthplace'){
                setStates(response.data);
            }

            if(field === 'passport'){
                setPassportStates(response.data);
            }

            if(field === 'spouse'){
                setSpouseStates(response.data);
            }

        }
    }

    const handleAddLanguage = () => {
        if (!languageForm.language || !languageForm.percentage) {
            Toast.fire('Error', 'Seleccione un idioma e ingrese el porcentaje', 'error');
            return;
        }

        const list = [...(personalInfo.languages || [])];
        const exists = list.find((obj: any) => obj.language === languageForm.language);

        if (exists) {
            Toast.fire('Error', 'El idioma ya fue agregado', 'error');
            return;
        }

        list.push({ language: languageForm.language, percentage: parseInt(languageForm.percentage) });

        handleChange({ currentTarget: { name: 'languages', value: list } });
        setLanguageForm({ language: '', percentage: '' });
    };

    const handleDeleteLanguage = (language: string) => {
        const list = (personalInfo.languages || []).filter((obj: any) => obj.language !== language);
        handleChange({ currentTarget: { name: 'languages', value: list } });
    };

    useEffect(()=>{
        onLoad();
    },[]);


    return(
        <div className="personal-form">
            <fieldset>
                <legend className="font-semibold">Cliente</legend>
                <Row>
                    <Col xs={24} lg={6}>
                        <label>Nombre(s)</label>
                        <Input
                            id="names"
                            value={personalInfo.names}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Apellido paterno</label>
                        <Input
                            id="lastname1"
                            value={personalInfo.lastname1}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Apellido materno</label>
                        <Input
                            id="lastname2"
                            value={personalInfo.lastname2}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>F. Nacimiento</label>
                        <Input
                            type="date"
                            id="birthdate"
                            value={personalInfo.birthdate}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Género</label>
                        <SelectForm
                            id="sex"
                            options={[
                                {label:'Masculino', value:'M'},
                                {label:'Femenino', value:'F'},
                                {label:'Otro', value:'O'},
                            ]}
                            value={personalInfo.sex}
                            handleChange={(e)=>handleChange({currentTarget:{name:'sex', value: e}})}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>CURP</label>
                        <Input
                            id="curp"
                            value={personalInfo.curp}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Edo. Civil</label>
                        <SelectForm
                            id="civilStatus"
                            options={[
                                {label: "Soltero/a", value: "Soltero"},
                                {label: "Casado/a", value: "Casado"},
                                {label: "Divorciado/a", value: "Divorciado"},
                                {label: "Viudo/a", value: "Viudo"},
                                {label: "En unión libre", value: "Union libre"},
                                {label: "Separado/a", value: "Separado"},
                                {label: "Otro", value: "Otro"}
                            ]}
                            value={personalInfo.civilStatus}
                            handleChange={(e)=>handleChange({currentTarget:{name:'civilStatus', value: e}})}
                        />
                    </Col>
                </Row>
            </fieldset>
            {(personalInfo.civilStatus === 'Casado' || personalInfo.civilStatus === 'Union libre') && (
                <>
                    <hr className="my-2" />
                    <fieldset>
                        <legend className="font-semibold">Cónyuge</legend>
                        <Row>
                            <Col xs={24} lg={6}>
                                <label>Nombre(s)</label>
                                <Input
                                    id="spouse_names"
                                    value={personalInfo.spouse.names}
                                    onChange={(e:any)=>onChangeField('names', e.currentTarget.value.toUpperCase(), 'spouse')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>Apellido paterno</label>
                                <Input
                                    id="spouse_lastname1"
                                    value={personalInfo.spouse.lastname1}
                                    onChange={(e:any)=>onChangeField('lastname1', e.currentTarget.value.toUpperCase(), 'spouse')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>Apellido materno</label>
                                <Input
                                    id="spouse_lastname2"
                                    value={personalInfo.spouse.lastname2}
                                    onChange={(e:any)=>onChangeField('lastname2', e.currentTarget.value.toUpperCase(), 'spouse')}
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>F. Nacimiento</label>
                                <Input
                                    type="date"
                                    id="spouse_birthdate"
                                    value={personalInfo.spouse.birthdate}
                                    onChange={(e:any)=>onChangeField('birthdate', e.currentTarget.value, 'spouse')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>País de nacimiento</label>
                                <SelectForm
                                    id="spouse_country"
                                    options={countries}
                                    value={personalInfo.spouse.country}
                                    handleChange={(value)=>onChangeField('country', value, 'spouse')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>Estado de nacimiento</label>
                                <SelectForm
                                    id="spouse_state"
                                    options={spouseStates}
                                    value={personalInfo.spouse.state}
                                    handleChange={(value)=>onChangeField('state', value, 'spouse')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={6}>
                                <label>¿Cuenta con visa?</label>
                                <SelectForm
                                    id="spouse_has_visa"
                                    options={[
                                        {label:'No', value:'0'},
                                        {label:'Si', value:'1'}
                                    ]}
                                    value={personalInfo.spouse.hasVisa}
                                    handleChange={(value)=>onChangeField('hasVisa', value, 'spouse')}
                                    required
                                />
                            </Col>
                        </Row>
                    </fieldset>
                </>
            )}
            
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Lugar de nacimiento (como se muestra en el pasaporte)</legend>
                <Row>
                    <Col xs={24} lg={6}>
                        <label>País</label>
                        <SelectForm
                            id="country"
                            options={countries}
                            value={personalInfo.birthplace.country}
                            handleChange={(value)=>onChangeField('country', value, 'birthplace')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado</label>
                        <SelectForm
                            id="state"
                            options={states}
                            value={personalInfo.birthplace.state}
                            handleChange={(value)=>onChangeField('state', value, 'birthplace')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad/Municipio</label>
                        <Input
                            id="city"
                            value={personalInfo.birthplace.city}
                            onChange={(e:any)=>onChangeField('city', e.currentTarget.value.toUpperCase(), 'birthplace')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Nacionalidad</label>
                        <Input
                            id="nationality"
                            value={personalInfo.birthplace.nationality}
                            onChange={(e:any)=>onChangeField('nationality', e.currentTarget.value.toUpperCase(), 'birthplace')}
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Pasaporte</legend>
                <Row>
                    <Col xs={24} lg={6}>
                        <label>No. Pasaporte</label>
                        <Input
                            id="number"
                            value={personalInfo.passport.number}
                            onChange={(e:any)=>onChangeField('number', e.currentTarget.value, 'passport')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>F. expedición</label>
                        <Input
                            type="date"
                            id="expedition_date"
                            value={personalInfo.passport.expedition_date}
                            onChange={(e:any)=>onChangeField('expedition_date', e.currentTarget.value, 'passport')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>F caducidad</label>
                        <Input
                            type="date"
                            id="expiration_date"
                            value={personalInfo.passport.expiration_date}
                            onChange={(e:any)=>onChangeField('expiration_date', e.currentTarget.value, 'passport')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>País expedición</label>
                        <SelectForm
                            id="country_passport"
                            options={countries}
                            value={personalInfo.passport.country_expedition}
                            handleChange={(value)=>onChangeField('country_expedition', value, 'passport')}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado expedición</label>
                        <SelectForm
                            id="state_expedition"
                            options={passportStates}
                            value={personalInfo.passport.state_expedition}
                            handleChange={(value)=>onChangeField('state_expedition', value, 'passport')}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad expedición</label>
                        <Input
                            id="expedition_city"
                            value={personalInfo.passport.expedition_city}
                            onChange={(e:any)=>onChangeField('expedition_city', e.target.value.toUpperCase(), 'passport')}
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Idiomas</legend>
                <Row className="flex items-end mb-2">
                    <Col xs={24} lg={10}>
                        <label>Idioma</label>
                        <SelectForm
                            id="language_select"
                            options={LANGUAGES}
                            value={languageForm.language}
                            handleChange={(val) => setLanguageForm(prev => ({ ...prev, language: val as string }))}
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Porcentaje (%)</label>
                        <Input
                            type="number"
                            id="language_percentage"
                            value={languageForm.percentage}
                            onChange={(e: any) => {
                                const val = Math.min(100, Math.max(0, parseInt(e.currentTarget.value) || 0));
                                setLanguageForm(prev => ({ ...prev, percentage: val.toString() }));
                            }}
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <Button onClick={handleAddLanguage}>Agregar</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Table
                            columns={languageColumns}
                            data={personalInfo.languages || []}
                            height={150}
                        />
                    </Col>
                </Row>
            </fieldset>
        </div>
    )
}

export default PersonalData;
