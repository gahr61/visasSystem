import { Col, Row } from "rsuite";
import Input from "../../common/Input";
import { Visa } from "../../../utils/interfaces/procedure";

interface Props {
    visa: Visa;
    changeData: (data: any) => void,
    index: number
}


const VisaForm = ({
    visa,
    changeData,
    index
}:Props)=>{

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;

        visa = {
            ...visa,
            [name]: value
        }

        changeData(visa)
    }

    return(
        <fieldset>
            <legend className="text-lg">Datos de visa</legend>
            <Row>
                <Col xs={24} md={8}>
                    <label>Numero</label>
                    <Input 
                        id={"visa_number"+index}
                        name="visa_number"
                        value={visa.visa_number}
                        onChange={handleChange}
                        placeholder="N. Visa" 
                        required
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Fecha expedición</label>
                    <Input 
                        id={"visa_expedition_date"+index}
                        name="visa_expedition_date"
                        type="date"
                        value={visa.visa_expedition_date}
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <label>Fecha vencimiento</label>
                    <Input 
                        id={"visa_expiration_date"+index}
                        name="visa_expiration_date"
                        type="date"
                        value={visa.visa_expiration_date}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={24} md={16}>
                    <label>Lugar de expedición</label>
                    <Input 
                        id={"visa_expedition_place"+index}
                        name="visa_expedition_place"
                        value={visa.visa_expedition_place}
                        onChange={handleChange}
                        placeholder="Lugar de expedición de visa" />
                </Col>
            </Row>
        </fieldset>
    )
}

export default VisaForm;