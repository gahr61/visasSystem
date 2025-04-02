import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";

const TravelInfo = ()=>{
    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Hospedaje</legend>
                <Row>
                    <Col xs={24}>
                        <label>Nombre completo de quien lo hospeda</label>
                        <Input />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>Teléfono personal</label>
                        <Input type="tel" />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Teléfono trabajo</label>
                        <Input type="tel" />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Teléfono celular</label>
                        <Input type="tel" />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Visa</legend>
                <Row>
                    <Col xs={24} lg={9}>
                        <label>¿Has intentado tramitar visa ?</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Fecha de trámite</label>
                        <Input type="date" />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>Visa anterior</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Fecha expiración</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Fecha expedición</label>
                        <Input />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <label>¿Cuál será su dirección en los EEUU?</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={5}>
                        <label>¿Cuándo planea viajar a los EEUU?</label>
                        <Input type="date" />
                    </Col>
                    <Col xs={24} lg={8}>
                        <label>¿Cuanto tiempo planea permanecer en los EEUU?</label>
                        <Input />
                    </Col>                    
                </Row>
                <Row>
                    <Col xs={24} lg={9}>
                        <label>¿Cuál será el motivo de su viaje?</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={9}>
                        <label>¿Quién cubrirá los gasto de su viaje?</label>
                        <Input />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>¿Ha visitado los EEUU alguna vez?</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>¿Cuando?</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Por cuanto tiempo?</label>
                        <Input />
                    </Col>
                </Row>
                {/** agregar seccion de visita otros paises */}
                <Row>
                    <Col xs={24} lg={5}>
                        <label>Observaciones</label>
                        <Input />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>Usuario</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Contraseña</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Clave DS 160</label>
                        <Input />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default TravelInfo;