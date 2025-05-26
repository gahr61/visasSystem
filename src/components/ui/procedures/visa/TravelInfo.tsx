import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";

type Props = {
    generalInfo: any,
    handleChange:(e:any) => void
}

const TravelInfo = ({
    generalInfo,
    handleChange
}:Props)=>{

    const onChangeData = (e:any, field:string)=>{
        const {name, value} = e.currentTarget;

        handleChange({
            currentTarget:{
                name:field,
                value: {
                    ...generalInfo[field],
                    [name]:  value.toUpperCase()
                }
            }
        });

    }

    return(
        <Grid fluid className="general-form">
            <fieldset>
                <legend className="font-semibold">Hospedaje</legend>
                <Row>
                    <Col xs={24}>
                        <label>Nombre completo de quien lo hospeda</label>
                        <Input 
                            id="fullName"
                            value={generalInfo.residence.fullName}
                            onChange={(e)=>onChangeData(e, 'residence')}
                            required
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>Teléfono personal</label>
                        <Input 
                            type="tel" 
                            id="personalPhone"
                            value={generalInfo.residence.personalPhone}
                            onChange={(e)=>onChangeData(e, 'residence')}
                            required    
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Teléfono trabajo</label>
                        <Input type="tel" 
                            id="workPhone"
                            value={generalInfo.residence.workPhone}
                            onChange={(e)=>onChangeData(e, 'residence')}
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Teléfono celular</label>
                        <Input type="tel" 
                            id="celPhone"
                            value={generalInfo.residence.celPhone}
                            onChange={(e)=>onChangeData(e, 'residence')}
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Visa</legend>
                <Row>
                    <Col xs={24} lg={9}>
                        <label>¿Has intentado tramitar visa ?</label>
                        <SelectForm 
                            id="tryProcedureVisa" 
                            options={[
                                {value:'0', label:'No'},
                                {value:'1', label:'Si'}
                            ]} 
                            value={generalInfo.history.tryProcedureVisa} 
                            handleChange={(value)=>onChangeData({
                                currentTarget:{name:'tryProcedureVisa', value: value}
                            }, 'history')} 
                            required    
                        />
                    </Col>
                    {generalInfo.history.tryProcedureVisa === '1' && (
                        <Col xs={24} lg={4}>
                            <label>Fecha de trámite</label>
                            <Input type="date" 
                                id="procedureDate"
                                value={generalInfo.history.procedureDate}
                                onChange={(e)=>onChangeData(e, 'history')}
                                required
                            />
                        </Col>
                    )}
                    
                </Row>
                {generalInfo.history.tryProcedureVisa === '1' && (
                    <Row>
                        <Col xs={24} lg={5}>
                            <label>Visa anterior</label>
                            <Input 
                                id="lastVisa"
                                value={generalInfo.visa.lastVisa}
                                onChange={(e)=>onChangeData(e, 'visa')}
                                required
                            />
                        </Col>
                        <Col xs={24} lg={4}>
                            <label>Fecha expiración</label>
                            <Input 
                                type="date"
                                id="expirationDate"
                                value={generalInfo.visa.expirationDate}
                                onChange={(e)=>onChangeData(e, 'visa')}
                                required
                            />
                        </Col>
                        <Col xs={24} lg={4}>
                            <label>Fecha expedición</label>
                            <Input 
                                type="date"
                                id="expeditionDate"
                                value={generalInfo.visa.expeditionDate}
                                onChange={(e)=>onChangeData(e, 'visa')}
                                required
                            />
                        </Col>
                    </Row>
                )}
                
                <Row>
                    <Col xs={24}>
                        <label>¿Cuál será su dirección en los EEUU?</label>
                        <Input 
                            id="addressEEUU"
                            value={generalInfo.details.addressEEUU}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={5}>
                        <label>¿Cuándo planea viajar a los EEUU?</label>
                        <Input type="date" 
                            id="travelDateEEUU"
                            value={generalInfo.details.travelDateEEUU}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={8}>
                        <label>¿Cuanto tiempo planea permanecer en los EEUU?</label>
                        <Input 
                            id="timeEEUU"
                            value={generalInfo.details.timeEEUU}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>                    
                </Row>
                <Row>
                    <Col xs={24} lg={9}>
                        <label>¿Cuál será el motivo de su viaje?</label>
                        <Input 
                            id="travelReason"
                            value={generalInfo.details.travelReason}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <label>¿Quién cubrirá los gasto de su viaje?</label>
                        <Input 
                            id="coverExpenses"
                            value={generalInfo.details.coverExpenses}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={5}>
                        <label>¿Ha visitado los EEUU alguna vez?</label>
                        <SelectForm 
                            id="has_visit_eeuu" 
                            options={[
                                {value:'0', label:'No'},
                                {value:'1', label:'Si'}
                            ]} 
                            value={generalInfo.details.has_visit_eeuu} 
                            handleChange={(value)=>onChangeData({
                                currentTarget:{name:'has_visit_eeuu', value: value}
                            }, 'details')} 
                            required    
                        />
                    </Col>
                    {generalInfo.details.has_visit_eeuu === '1' && (
                        <>
                            <Col xs={24} lg={4}>
                                <label>¿Cuando?</label>
                                <Input 
                                    type="date"
                                    id="lastVisit"
                                    value={generalInfo.details.lastVisit}
                                    onChange={(e)=>onChangeData(e, 'details')}
                                    required
                                />
                            </Col>
                            <Col xs={24} lg={4}>
                                <label>Por cuanto tiempo?</label>
                                <Input 
                                    id="dateLastVisit"
                                    value={generalInfo.details.dateLastVisit}
                                    onChange={(e)=>onChangeData(e, 'details')}
                                    required
                                />
                            </Col>
                        </>
                    )}
                    
                </Row>
                {/** agregar seccion de visita otros paises */}
                <Row>
                    <Col xs={24}>
                        <label>Observaciones</label>
                        <Input 
                            id="observations"
                            value={generalInfo.details.observations}
                            onChange={(e)=>onChangeData(e, 'details')}
                            required
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default TravelInfo;