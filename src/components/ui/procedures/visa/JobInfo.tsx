import { Col, Grid, Row } from "rsuite"
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { occupationsList } from "../../../../utils/services/occupations";
import Toast from "../../../common/Toast";
import moment from "moment";
import ModalSchool from "./ModalSchool";
import AddressForm from "../AddressForm";

type EducationForm = {
    id: number,
    name: string,
    degree_level: string,
    is_last_degree: boolean,
    period: string,
    address: any
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
        {key:'degree_level', title:'Grado', grow:2, render:(row:EducationForm) => row.degree_level},
        {key:'is_last_degree', title:'Último grado', grow:1, render:(row:EducationForm) => row.is_last_degree ? 'Sí' : 'No'},
        {key:'address', title:'Dirección', grow:3, render:(row:EducationForm) =>
            [row.address?.street, row.address?.colony, row.address?.city].filter(Boolean).join(', ')
        },
        {key:'period', title:'Generación', grow:1, render:(row:EducationForm) => row.period},
        {key:'actions', title:'', grow:1, render:(row:EducationForm) =>
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

    const schoolModalRef = useRef<any>(null);

    const [occupations, setOccupations] = useState<ISelectOptions[]>([]);
    const [showOtherOccupation, setShowOtherOccupation] = useState(false);

    const calculateAntiquity = (hireDate: string)=>{
        if(!hireDate) return '';

        const years = moment().diff(hireDate, 'years');
        const months = moment().diff(moment(hireDate).add(years, 'years'), 'months');

        const parts = [];

        if(years > 0) parts.push(years+(years === 1 ? ' año' : ' años'));
        if(months > 0) parts.push(months+(months === 1 ? ' mes' : ' meses'));

        return parts.length > 0 ? parts.join(', ') : 'Menos de 1 mes';
    }

    const onChangeAddress = (address:any)=>{
        handleChange({currentTarget:{name:'address', value:address}});
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

    const handleAddSchool = (school:any)=>{
        const list = [...jobsSchools.schools];

        const exist = list.find((obj:any)=>obj.name === school.name);

        if(exist){
            Toast.fire('Error', 'El nombre que intenga agregar ya se encuentra en el listado', 'error');
            return false;
        }

        list.push(school);

        handleChange({
            currentTarget:{
                name:'schools',
                value: list
            }
        });

        return true;
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
                <AddressForm address={jobsSchools.address} onChange={onChangeAddress} />
                </div>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="w-full">
                    <span className="font-semibold">Educación</span>
                    <div className="float-right">
                        <Button size="sm" onClick={()=>schoolModalRef.current?.handleShow()}>Agregar</Button>
                    </div>
                </legend>
                <Row className="mt-3">
                    <Col xs={24}>
                        <Table
                            columns={columns}
                            data={jobsSchools.schools}
                            height={200}
                        />
                    </Col>
                </Row>
            </fieldset>
            <ModalSchool ref={schoolModalRef} onAdd={handleAddSchool} />
        </Grid>
    )
}

export default JobInfo;