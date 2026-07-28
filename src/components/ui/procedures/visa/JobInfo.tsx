import { Col, Grid, Row } from "rsuite"
import { ISelectOptions } from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { occupationsList } from "../../../../utils/services/occupations";
import { formatPrice } from "../../../../utils/functions";
import Toast from "../../../common/Toast";
import ModalSchool from "./ModalSchool";
import ModalOccupation from "./ModalOccupation";

type EducationForm = {
    id: number,
    name: string,
    degree_level: string,
    is_last_degree: boolean,
    period: string,
    address: any
}

type OccupationForm = {
    occupations_id: number | string,
    otherOccupation?: string,
    name: string,
    salary: string | number,
    hireDate: string,
    antiquity: string,
    activities_description: string,
    is_primary: boolean,
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
    const educationColumns: Columns[] = [
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
    const occupationModalRef = useRef<any>(null);

    const [occupations, setOccupations] = useState<ISelectOptions[]>([]);

    const occupationName = (occupations_id: number | string)=>
        occupations.find(obj => obj.value === occupations_id)?.label || '';

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

    const handleSaveOccupation = (occupation:any, index?:number)=>{
        const list = [...(jobsSchools.occupations || [])];

        const exist = list.find((obj:any, i:number)=> obj.name === occupation.name && i !== index);

        if(exist){
            Toast.fire('Error', 'El nombre que intenga agregar ya se encuentra en el listado', 'error');
            return false;
        }

        if(occupation.is_primary){
            list.forEach((obj:any, i:number)=> { if(i !== index) obj.is_primary = false; });
        }

        if(index !== undefined){
            list[index] = occupation;
        }else{
            list.push(occupation);
        }

        handleChange({
            currentTarget:{
                name:'occupations',
                value: list
            }
        });

        return true;
    }

    const handleDeleteOccupation = (name:string)=>{
        const list = (jobsSchools.occupations || []).filter((obj:any) => obj.name !== name);

        if(list.length > 0 && !list.some((obj:any)=>obj.is_primary)){
            list[0].is_primary = true;
        }

        handleChange({
            currentTarget:{
                name:'occupations',
                value: list
            }
        });
    }

    const handleSetPrimaryOccupation = (name:string)=>{
        const list = (jobsSchools.occupations || []).map((obj:any)=>({
            ...obj,
            is_primary: obj.name === name
        }));

        handleChange({
            currentTarget:{
                name:'occupations',
                value: list
            }
        });
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

    const hasPrimaryOccupation = (jobsSchools.occupations || []).some((obj:any)=>obj.is_primary);

    return(
        <Grid fluid>
            <fieldset>
                <legend className="w-full">
                    <span className="font-semibold">Ocupación</span>
                    <div className="float-right">
                        <Button size="sm" onClick={()=>occupationModalRef.current?.handleShow()}>Agregar</Button>
                    </div>
                </legend>
                <Row className="mt-3">
                    <Col xs={24}>
                        {(jobsSchools.occupations || []).length === 0 ? (
                            <div className="flex justify-center items-center h-24 border rounded-lg text-gray-500">
                                No se encontraron resultados
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {(jobsSchools.occupations || []).map((occupation:OccupationForm, index:number)=>
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-3 flex flex-col gap-1 ${occupation.is_primary ? 'border-blue-400 bg-blue-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-semibold break-words">{occupation.name}</span>
                                            {occupation.is_primary && (
                                                <span className="shrink-0 text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">Principal</span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600">{occupationName(occupation.occupations_id)}</span>
                                        <span className="text-sm">Ingreso mensual: {formatPrice(occupation.salary || 0)}</span>
                                        <span className="text-sm">Antigüedad: {occupation.antiquity}</span>
                                        <span className="text-xs text-gray-500 break-words">
                                            {[occupation.address?.street, occupation.address?.colony, occupation.address?.city].filter(Boolean).join(', ') || '—'}
                                        </span>
                                        <div className="flex gap-2 mt-2 justify-end">
                                            {!occupation.is_primary && (
                                                <ButtonTable
                                                    controlId="set-primary"
                                                    title="Marcar como principal"
                                                    icon={<FaCheck />}
                                                    onClick={()=>handleSetPrimaryOccupation(occupation.name)}
                                                />
                                            )}
                                            <ButtonTable
                                                controlId="edit"
                                                title="Editar"
                                                icon={<FaPen />}
                                                onClick={()=>occupationModalRef.current?.handleShow(occupation, index)}
                                            />
                                            <ButtonTable
                                                controlId="delete"
                                                title="Eliminar"
                                                icon={<FaTrashAlt />}
                                                onClick={()=>handleDeleteOccupation(occupation.name)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
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
                            columns={educationColumns}
                            data={jobsSchools.schools}
                            height={200}
                        />
                    </Col>
                </Row>
            </fieldset>
            <ModalSchool ref={schoolModalRef} onAdd={handleAddSchool} />
            <ModalOccupation ref={occupationModalRef} onSave={handleSaveOccupation} hasPrimary={hasPrimaryOccupation} />
        </Grid>
    )
}

export default JobInfo;