import { Col, Row } from "rsuite";
import Input from "../../common/Input";
import { Passport } from "../../../utils/interfaces/procedure";
import SelectForm from "../../common/Select";
import { useAddressStore } from "../../../utils/stores/useAddressStore";

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
    }

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
            </Row>
        </fieldset>
    )
}

export default PassportForm;