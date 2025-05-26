import { Col, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import { useEffect, useState } from "react";
import { getStates } from "../../../../utils/services/countries";
import { useAddressStore } from "../../../../utils/stores/useAddressStore";

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

    const onLoad = async ()=>{
        onLoadStates(personalInfo.birthplace.country || 42, 'birthplace');
        onLoadStates(personalInfo.passport.country_expedition || 42, 'passport');
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
            
        }
    }

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
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Lugar de nacimiento</legend>
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
                        <label>Ciudad</label>
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
                    {/*<Col xs={24} lg={6}>
                        <label>País emisor</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>*/}
                </Row>
            </fieldset>
        </div> 
    )
}

export default PersonalData;