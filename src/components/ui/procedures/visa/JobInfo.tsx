import { Col, Grid, Row } from "rsuite"
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { occupationsList } from "../../../../utils/services/occupations";
import Toast from "../../../common/Toast";
import { isValidForm } from "../../../../utils/functions";
import { useAddressStore } from "../../../../utils/stores/useAddressStore";
import { getStates } from "../../../../utils/services/countries";
import moment from "moment";

type EducationForm = {
    id: number,
    name: string,
    address: string,
    period: string
}

type Props = {
    jobsSchools: any,
    handleChange:(e:any) => void
}

const JobInfo = ({
    jobsSchools,
    handleChange
}:Props)=>{
    const columns: Columns[] = [
        {key:'school', title:'Escuela', grow:3, render:(row:EducationForm) => row.name},
        {key:'address', title:'Dirección', grow:3, render:(row:EducationForm) => row.address},
        {key:'period', title:'Periodo', grow:1, render:(row:EducationForm) => row.period},
        {key:'actions', title:'', grow:3, render:(row:EducationForm) => 
            <>
                <ButtonTable 
                    controlId="delete" 
                    title="Eliminar" 
                    icon={<FaTrashAlt />} 
                    onClick={()=>handleDeleteSchool(row.name)}    
                />
            </>
        },
    ]

    const countries = useAddressStore(state => state.countries);

    const [occupations, setOccupations] = useState<ISelectOptions[]>([]);
    const [showOtherOccupation, setShowOtherOccupation] = useState(false);
    const [jobStates, setJobStates] = useState<ISelectOptions[]>([]);

    const [schoolForm, setSchoolForm] = useState({
        name:'',
        address:'',
        period:''
    });
    const [requiredFormList, setRequiredFormList] = useState(false);

    const calculateAntiquity = (hireDate: string)=>{
        if(!hireDate) return '';

        const years = moment().diff(hireDate, 'years');
        const months = moment().diff(moment(hireDate).add(years, 'years'), 'months');

        const parts = [];

        if(years > 0) parts.push(years+(years === 1 ? ' año' : ' años'));
        if(months > 0) parts.push(months+(months === 1 ? ' mes' : ' meses'));

        return parts.length > 0 ? parts.join(', ') : 'Menos de 1 mes';
    }

    const onChangeAddress = (e:any)=>{
        const {name, value} = e.currentTarget;

        handleChange({
            currentTarget:{
                name:'address',
                value:{
                    ...jobsSchools.address,
                    [name]: typeof value === 'number' ? value : value.toUpperCase()
                }
            }
        });

        if(name === 'country'){
            if(value === ''){
                setJobStates([]);
            }else{
                onLoadJobStates(value);
            }
        }
    }

    const onLoadJobStates = async (country_id:number) => {
        const response = await getStates(country_id);

        if(response && response.success){
            setJobStates(response.data);
        }
    }

    const getOccupations = async ()=>{
        const response = await occupationsList();

        if(response && response.success){
            const list = response.data.map((data:any)=>{
                const item = {
                    value: data.id,
                    label: data.name
                };

                return item;
            });

            setOccupations(list);
        }
    }

    const handleChangeSchool = (e:any)=>{
        const {name, value} = e.currentTarget;

        setSchoolForm({
            ...schoolForm,
            [name]: value.toUpperCase()
        });
    }

    const handleAddSchool = ()=>{
        setRequiredFormList(true);

        setTimeout(()=>{
            if(!isValidForm('div.school-form')){
                Toast.fire('Error', 'Campos requeridos', 'error');
                return;
            }

            let list = [...jobsSchools.schools];

            const exist = list.find((obj:any)=>obj.name === schoolForm.name);

            if(exist){
                Toast.fire('Error', 'El nombre que intenga agregar ya se encuentra en el listado', 'error');
                return;
            }

            list.push(schoolForm);

            setSchoolForm({
                name:'',
                address:'',
                period:''
            });

            handleChange({
                currentTarget:{
                    name:'schools',
                    value: list
                }
            });

            setRequiredFormList(false);
        }, 200);
        
    }

    const handleDeleteSchool = (name:string)=>{
        const list = jobsSchools.schools.filter((obj:any) => obj.name !== name);

        handleChange({
            currentTarget:{
                name:'schools',
                value: list
            }
        });
    }

    useEffect(()=>{
        getOccupations();

        if(jobsSchools.address?.country){
            onLoadJobStates(jobsSchools.address.country);
        }
    },[]);

    useEffect(()=>{
        const item = occupations.find(obj => obj.value === jobsSchools.occupation);

        if(item){
            if(item.label === 'Otro'){
                setShowOtherOccupation(true);
            }else{
                setShowOtherOccupation(false);
            }
        }
    },[jobsSchools])

    useEffect(()=>{
        if(jobsSchools.hireDate){
            const antiquity = calculateAntiquity(jobsSchools.hireDate);

            if(antiquity !== jobsSchools.antiquity){
                handleChange({currentTarget:{name:'antiquity', value: antiquity}});
            }
        }
    },[jobsSchools.hireDate])

    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Ocupación</legend>
                <div className="job-form">
                <Row>
                    <Col xs={24} lg={8}>
                        <label>Ocupación actual</label>
                        <SelectForm 
                            id="occupation" 
                            options={occupations} 
                            value={jobsSchools.occupation} 
                            handleChange={(e)=>handleChange({currentTarget:{name:'occupation', value: e}})} 
                            required
                        />
                    </Col>
                    {showOtherOccupation && (
                        <Col xs={24} lg={6}>
                            <label>Nombre Ocupación</label>
                            <Input 
                                id="otherOcupation"
                                value={jobsSchools.otherOcupation}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    )}
                    
                    <Col xs={24} lg={4}>
                        <label>Ingreso mensual</label>
                        <Input
                            type="number"
                            id="salary"
                            value={jobsSchools.salary}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Fecha de ingreso</label>
                        <Input
                            type="date"
                            id="hireDate"
                            value={jobsSchools.hireDate}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Antiguedad</label>
                        <Input
                            id="antiquity"
                            value={jobsSchools.antiquity}
                            onChange={handleChange}
                            disabled
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={22}>
                        <label>Nombre de empleo o escuela</label>
                        <Input
                            id="occupationName"
                            value={jobsSchools.occupationName}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={22}>
                        <label>Descripción de actividades</label>
                        <Input
                            id="activitiesDescription"
                            value={jobsSchools.activitiesDescription}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={6}>
                        <label>Calle</label>
                        <Input
                            id="street"
                            value={jobsSchools.address?.street}
                            onChange={onChangeAddress}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Int</label>
                        <Input
                            type="number"
                            id="noInt"
                            value={jobsSchools.address?.noInt}
                            onChange={onChangeAddress}
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Ext.</label>
                        <Input
                            type="number"
                            id="noExt"
                            value={jobsSchools.address?.noExt}
                            onChange={onChangeAddress}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Código postal</label>
                        <Input
                            id="postCode"
                            value={jobsSchools.address?.postCode}
                            onChange={onChangeAddress}
                            required
                            maxLength={5}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Colonia</label>
                        <Input
                            id="colony"
                            value={jobsSchools.address?.colony}
                            onChange={onChangeAddress}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>País</label>
                        <SelectForm
                            id="jobCountry"
                            options={countries}
                            value={jobsSchools.address?.country}
                            handleChange={(value:any)=>onChangeAddress({currentTarget:{name:'country', value}})}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado</label>
                        <SelectForm
                            id="jobState"
                            options={jobStates}
                            value={jobsSchools.address?.state}
                            handleChange={(value:any)=>onChangeAddress({currentTarget:{name:'state', value}})}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad/Municipio</label>
                        <Input
                            id="jobCity"
                            name="city"
                            value={jobsSchools.address?.city}
                            onChange={onChangeAddress}
                            required
                        />
                    </Col>
                </Row>
                </div>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Educación</legend>
                <Row className="flex items-end school-form">
                    <Col xs={24} lg={10}>
                        <label>Escuela</label>
                        <Input 
                            id="name"
                            value={schoolForm.name}
                            onChange={handleChangeSchool}
                            required={requiredFormList}
                        />
                    </Col>
                    <Col xs={24} lg={10}>
                        <label>Dirección</label>
                        <Input 
                            id="address"
                            value={schoolForm.address}
                            onChange={handleChangeSchool}
                            required={requiredFormList}
                        />
                    </Col>
                    <Col xs={24} lg={2}>
                        <label>Periodo</label>
                        <Input 
                            id="period"
                            value={schoolForm.period}
                            onChange={handleChangeSchool}
                            required={requiredFormList}
                        />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button onClick={handleAddSchool}>Agregar</Button>
                    </Col>
                </Row>
                <Row className="nt-3">
                    <Col xs={24}>
                        <Table 
                            columns={columns}
                            data={jobsSchools.schools}
                            height={200}
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default JobInfo;