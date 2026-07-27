import { Col, Divider, Grid, Row } from "rsuite"

import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import { useEffect, useState } from "react";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrash } from "react-icons/fa6";
import { randomString } from "../../../../utils/functions";
import Toast from "../../../common/Toast";
import { getStates } from "../../../../utils/services/countries";
import { relationshipTypesList } from "../../../../utils/services/relationshipTypes";

const USA_COUNTRY_ID = 55;

type Props = {
    generalInfo: any,
    handleChange:(e:any) => void
}

const TravelInfo = ({
    generalInfo,
    handleChange
}:Props)=>{
    const networks = [
        {value:'Facebook', label:'Facebook'},
        {value:'Instagram', label:'Instagram'},
        {value:'X (Twitter)', label:'X (Twitter)'},
        {value:'Linkedin', label:'Linkedin'},
        {value:'Tiktok', label:'Tiktok'},
        {value:'Youtube', label:'Youtube'},
        {value:'Otra', label:'Otra'},
    ]
    const [socialForm, setSocialForm] = useState<any>({
        socialNetwork:'',
        username:'',
        email:''
    });
    const [usaStates, setUsaStates] = useState<ISelectOptions[]>([]);
    const [relationships, setRelationships] = useState<ISelectOptions[]>([]);
    const [showOtherRelationship, setShowOtherRelationship] = useState(false);

    const networkColumns:Columns[] = [
        {key:'network', title:'Red Social', grow:3, render:(row:any) => row.socialNetwork},
        {key:'username', title:'Nombre de usuario / Página', grow:3, render:(row:any) => row.username},
        {key:'email', title:'Correo', grow:3, render:(row:any) => row.email},
        {key:'actions', title:'', grow:1, render:(row:any) => <>
            <ButtonTable
                controlId="delete"
                title="Eliminar"
                icon={<FaTrash />}
                onClick={()=>handleDeleteSocial(row.id)}
            />
        </>}
    ]

    useEffect(()=>{
        getStates(USA_COUNTRY_ID).then((response)=>{
            if(response && response.success){
                setUsaStates(response.data);
            }
        });

        relationshipTypesList().then((response)=>{
            if(response && response.success){
                const list = response.data.map((item)=>({value: item.name, label: item.name}));
                setRelationships([...list, {value:'Otro', label:'Otro'}]);
            }
        });
    }, []);

    useEffect(()=>{
        if(relationships.length > 0 && generalInfo.residence.relationship){
            const known = relationships.some(r => r.value === generalInfo.residence.relationship);
            if(!known) setShowOtherRelationship(true);
        }
    }, [relationships]);

    const onChangeRelationship = (value:any)=>{
        if(value === 'Otro'){
            setShowOtherRelationship(true);
            onChangeData({currentTarget:{name:'relationship', value:''}}, 'residence');
        }else{
            setShowOtherRelationship(false);
            onChangeData({currentTarget:{name:'relationship', value}}, 'residence');
        }
    }

    const handleChangeSocialForm = (e:any)=>{
        const {name, value} = e.currentTarget;

        setSocialForm({
            ...socialForm,
            [name]: value
        });
    }

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

    const onChangeAddressEEUU = (name:string, value:any)=>{
        handleChange({
            currentTarget:{
                name:'details',
                value:{
                    ...generalInfo.details,
                    addressEEUU:{
                        ...generalInfo.details.addressEEUU,
                        [name]: typeof value === 'number' ? value : String(value).toUpperCase()
                    }
                }
            }
        });
    }

    const handleAddSocial = ()=>{
        let list = [...generalInfo.details.socialNetworks];

        var valid = true;

        Object.keys(socialForm).map((key)=>{
            if(socialForm[key] === ''){
                valid = false;
            }
        });

        if(valid){
            list.push({
                ...socialForm,
                id: randomString(4)
            });
            
            
            handleChange({
                currentTarget:{
                    name:'details',
                    value:{
                        ...generalInfo.details,
                        socialNetworks: list
                    }
                }
            });

            setSocialForm({
                socialNetwork:'',
                username:'',
                email:''
            });
        }else{
            Toast.fire('Alerta', 'Los campos red social, nombre de usuario y correo no deben estar vacios', 'error');
        }
    }

    const handleDeleteSocial = (id:any) => {
        let list = generalInfo.details.socialNetworks.filter((obj:any) => obj.id !== id);

        handleChange({
            currentTarget:{
                name:'details',
                value:{
                    ...generalInfo.details,
                    socialNetworks: list
                }
            }
        });
    }

    return(
        <Grid fluid className="general-form">
            <fieldset>
                <legend className="font-semibold">Hospedaje</legend>
                <Row>
                    <Col xs={24} lg={16}>
                        <label>Nombre completo de persona de referencia en Estados Unidos</label>
                        <Input
                            id="fullName"
                            value={generalInfo.residence.fullName}
                            onChange={(e)=>onChangeData(e, 'residence')}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={showOtherRelationship ? 4 : 8}>
                        <label>Parentesco</label>
                        <SelectForm
                            id="relationship"
                            options={relationships}
                            value={showOtherRelationship ? 'Otro' : generalInfo.residence.relationship}
                            handleChange={onChangeRelationship}
                            required
                        />
                    </Col>
                    {showOtherRelationship && (
                        <Col xs={24} lg={4}>
                            <label>¿Cuál?</label>
                            <Input
                                id="otherRelationship"
                                name="relationship"
                                value={generalInfo.residence.relationship}
                                onChange={(e)=>onChangeData(e, 'residence')}
                                required
                            />
                        </Col>
                    )}
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
                <legend className="font-semibold">Dirección en Estados Unidos</legend>
                <Row>
                    <Col xs={24} lg={8}>
                        <label>Calle</label>
                        <Input
                            id="addressStreet"
                            value={generalInfo.details.addressEEUU.street}
                            onChange={(e:any)=>onChangeAddressEEUU('street', e.currentTarget.value)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>No.</label>
                        <Input
                            id="addressNumber"
                            value={generalInfo.details.addressEEUU.number}
                            onChange={(e:any)=>onChangeAddressEEUU('number', e.currentTarget.value)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad</label>
                        <Input
                            id="addressCity"
                            value={generalInfo.details.addressEEUU.city}
                            onChange={(e:any)=>onChangeAddressEEUU('city', e.currentTarget.value)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado</label>
                        <SelectForm
                            id="addressState"
                            options={usaStates}
                            value={generalInfo.details.addressEEUU.state}
                            handleChange={(value)=>onChangeAddressEEUU('state', value)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Zip</label>
                        <Input
                            id="addressZip"
                            value={generalInfo.details.addressEEUU.zip}
                            onChange={(e:any)=>onChangeAddressEEUU('zip', e.currentTarget.value)}
                            required
                            maxLength={10}
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Datos de viaje</legend>
                <Row>
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
                <Row>
                    <Col xs={24} lg={9}>
                        <label>¿Ha viajado a otros países en los últimos 5 años?</label>
                        <SelectForm
                            id="other_countries"
                            options={[
                                {value:'0', label:'No'},
                                {value:'1', label:'Si'}
                            ]}
                            value={generalInfo.details.other_countries}
                            handleChange={(value)=>onChangeData({
                                currentTarget:{name:'other_countries', value: value}
                            }, 'details')}
                            required
                        />
                    </Col>
                    {generalInfo.details.other_countries === '1' && (
                        <>
                            <Col xs={24} lg={15}>
                                <label>Paises que ha visitado</label>
                                <Input
                                    id="travelCountries"
                                    value={generalInfo.details.travelCountries}
                                    onChange={(e)=>onChangeData(e, 'details')}
                                    required
                                    placeholder="Ingrese los paises que ha visitado ej. Colombia, España, etc..."
                                />
                            </Col>
                        </>
                    )}
                </Row>
                <Row>
                    <Col xs={24}>
                        <label>Observaciones</label>
                        <Input
                            id="observations"
                            value={generalInfo.details.observations}
                            onChange={(e)=>onChangeData(e, 'details')}
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Visa</legend>
                <Row>
                    <Col xs={24} lg={5}>
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
                        <>
                            <Col xs={24} lg={4}>
                                <label>Fecha de trámite</label>
                                <Input type="date" 
                                    id="procedureDate"
                                    value={generalInfo.history.procedureDate}
                                    onChange={(e)=>onChangeData(e, 'history')}
                                    required
                                />
                            </Col>

                            <Col xs={24} lg={4}>
                                <label>¿La visa fue aprobada?</label>
                                <SelectForm 
                                    id="visaApproved" 
                                    options={[
                                        {value:'0', label:'No'},
                                        {value:'1', label:'Si'}
                                    ]} 
                                    value={generalInfo.history.visaApproved} 
                                    handleChange={(value)=>onChangeData({
                                        currentTarget:{name:'visaApproved', value: value}
                                    }, 'history')} 
                                    required    
                                />
                            </Col>
                        </>
                        
                    )}

                    
                </Row>
                {generalInfo.history.visaApproved === '1' && (
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
                
            </fieldset>
             <Divider />
                <fieldset>
                    <legend className="font-semibold">Redes Sociales</legend>
                    <Row className="flex items-end">
                        <Col xs={24} md={5}>
                            <label>Red Social</label>
                            <SelectForm 
                                id="social_network"
                                options={networks}
                                value={socialForm.socialNetwork}
                                handleChange={(value)=>handleChangeSocialForm({currentTarget:{name:'socialNetwork', value: value}})}
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <label>Nombre de usuario / Página</label>
                            <Input 
                                id="username"
                                value={socialForm.username}
                                onChange={handleChangeSocialForm}
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <label>Correo del cliente con el que utiliza la red</label>
                            <Input
                                type="email"
                                id="email"
                                value={socialForm.email}
                                onChange={handleChangeSocialForm}
                            />
                        </Col>
                        <Col xs={24} md={3}>
                            <Button onClick={handleAddSocial}>Agregar</Button>
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Table 
                                columns={networkColumns}
                                data={generalInfo.details.socialNetworks}
                                height={220}
                            />
                        </Col>
                    </Row>
                </fieldset>
        </Grid>
    )
}

export default TravelInfo;