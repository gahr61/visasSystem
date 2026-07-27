import { Col, Row } from "rsuite";
import Input from "../../common/Input";
import { Passport } from "../../../utils/interfaces/procedure";
import SelectForm, { ISelectOptions } from "../../common/Select";
import { useEffect, useState } from "react";
import { useAddressStore } from "../../../utils/stores/useAddressStore";
import { getStates } from "../../../utils/services/countries";

interface Props {
    passport: Passport;
    changeData: (data: any) => void,
    index: number
}

const PassportForm = ({
    passport,
    changeData,
    index
}:Props)=>{

    const countries = useAddressStore(state => state.countries);
    const [states, setStates] = useState<ISelectOptions[]>([]);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;

        passport = {
            ...passport,
            [name]: value
        }

        changeData(passport)
    }

    const handleChangeSelect = (name:string, value:string)=>{
        passport = {
            ...passport,
            [name]: value
        };

        changeData(passport);

        if(name === 'passport_country_expedition'){
            onLoadStates(value);
        }
    }

    const onLoadStates = async (country_id:string|number) => {
        const response = await getStates(Number(country_id));

        if(response && response.success){
            setStates(response.data);
        }
    }

    useEffect(()=>{
        if(passport.passport_country_expedition){
            onLoadStates(passport.passport_country_expedition);
        }
    }, []);

    return(
        <fieldset>
            <legend className="text-lg">Datos de pasaporte</legend>
            <Row>
                <Col xs={24} md={8}>
                    <label>Numero</label>
                    <Input 
                        id={"passport_number"+index}
                        name={"passport_number"}
                        value={passport.passport_number}
                        onChange={handleChange}
                        placeholder="N. Pasaporte" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Fecha expedición</label>
                    <Input 
                        id={"passport_expedition_date"+index}
                        name={"passport_expedition_date"}
                        type="date"
                        value={passport.passport_expedition_date}
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Fecha vencimiento</label>
                    <Input
                        id={"passport_expiration_date"+index}
                        name={"passport_expiration_date"}
                        type="date"
                        value={passport.passport_expiration_date}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <label>País expedición</label>
                    <SelectForm
                        id="country_passport"
                        options={countries}
                        value={passport.passport_country_expedition}
                        handleChange={(value)=>handleChangeSelect('passport_country_expedition', value)}
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <label>Estado expedición</label>
                    <SelectForm
                        id="state_passport"
                        options={states}
                        value={passport.passport_state_expedition ?? ''}
                        handleChange={(value)=>handleChangeSelect('passport_state_expedition', value)}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Ciudad expedición</label>
                    <Input
                        id={"passport_city_expedition"+index}
                        name={"passport_city_expedition"}
                        value={passport.passport_city_expedition}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
        </fieldset>
    )
}

export default PassportForm;