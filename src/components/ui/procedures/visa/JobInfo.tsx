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

    const [occupations, setOccupations] = useState<ISelectOptions[]>([]);
    const [showOtherOccupation, setShowOtherOccupation] = useState(false);

    const [schoolForm, setSchoolForm] = useState({
        name:'',
        address:'',
        period:''
    })

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
                        <label>Sueldo mensual</label>
                        <Input 
                            type="number" 
                            id="salary"
                            value={jobsSchools.salary}
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
                            required
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
                        <label>Dirección de empleo o escuela</label>
                        <Input 
                            id="occupationAddress"
                            value={jobsSchools.occupationAddress}
                            onChange={handleChange}
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
                            required
                        />
                    </Col>
                    <Col xs={24} lg={10}>
                        <label>Dirección</label>
                        <Input 
                            id="address"
                            value={schoolForm.address}
                            onChange={handleChangeSchool}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={2}>
                        <label>Periodo</label>
                        <Input 
                            id="period"
                            value={schoolForm.period}
                            onChange={handleChangeSchool}
                            required
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