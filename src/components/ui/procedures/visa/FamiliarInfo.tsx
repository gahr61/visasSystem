import { Col, Grid, Row, Tooltip, Whisper } from "rsuite"
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { isValidForm } from "../../../../utils/functions";
import Toast from "../../../common/Toast";
import moment from "moment";
import { relationshipTypesList } from "../../../../utils/services/relationshipTypes";

type FamiliarForm = {
    id:number,
    full_name: string,
    relationship:string,
    birthdate: string,
    hasVisa: string,
    livesInUsa: string,
    citizenStatus: string,
    country_birth_id?: number | null,
    state_birth_id?: number | null
}

type Props = {
    familiarInfo: any,
    handleChange:(e:any) => void
}

const FamiliarInfo = ({
    familiarInfo,
    handleChange
}:Props)=>{
    const columns: Columns[] = [
        {key:'name', title:'Nombre', grow:3, render:(row: FamiliarForm) => row.full_name},
        {key:'parent', title:'Parentesco', grow:1, render:(row: FamiliarForm) => row.relationship},
        {key:'birtdate', title:'F. Nacimiento', grow:1, render:(row: FamiliarForm) => row.birthdate},
        {key:'hasVisa', title:'Tiene visa?', grow:1, render:(row: FamiliarForm) => row.hasVisa},
        {key:'livesInUsa', title:'Vive en EEUU?', grow:1, render:(row: any) => row.livesInUsa},
        {key:'citizenStatus', title:'Residente/Ciudadano', grow:1, render:(row: FamiliarForm) => row.citizenStatus || '—'},
        {key:'actions', title:'', grow:1, render:(row: FamiliarForm) =>
            <>
                <ButtonTable 
                    controlId="delete" 
                    title="Eliminar" 
                    icon={<FaTrashAlt />} 
                    onClick={()=>handleDeleteRelatioships(row.full_name)}
                />
            </>
        }
    ]

    const [requiredFamiliar, setRequiredFamiliar] = useState(false);
    const [relationships, setRelationships] = useState<ISelectOptions[]>([]);
    const [familiarForm, setFamiliarForm] = useState({
        full_name:'',
        relationship:'',
        otherRelationship:'',
        birthdate:'',
        has_visa:0,
        lives_in_usa:0,
        citizen_status:''
    })

    const loadRelationships = async ()=>{
        const response = await relationshipTypesList();

        if(response && response.success){
            const list = response.data.map((item)=>({value: item.name, label: item.name}));

            setRelationships([...list, {value:'Otro', label:'Otro'}]);
        }
    }

    useEffect(()=>{
        loadRelationships();
    }, []);

    const onChangeForm = (e:React.FormEvent<HTMLInputElement | HTMLSelectElement>)=>{
        const {name, value} = e.currentTarget;

        setFamiliarForm({
            ...familiarForm,
            [name]: value.toUpperCase()
        });
    }

    const handleAddFamiliar = ()=>{
        setRequiredFamiliar(true);

        setTimeout(()=>{
            if(!isValidForm('div.familiar-form')){
                Toast.fire('Error', 'Campos requeridos', 'error');
                return;
            }

            const exist = familiarInfo.relationships.find((obj:any) => obj.full_name === familiarForm.full_name);

            if(exist){
                Toast.fire('Error', 'El familiar que intenga ingresar ya se encuentra en el listado', 'error');
                return;
            }

            let list = [...familiarInfo.relationships];

            const relationship = familiarForm.relationship === 'Otro'
                ? familiarForm.otherRelationship.toUpperCase()
                : familiarForm.relationship.toUpperCase();

            list.push({
                full_name: familiarForm.full_name,
                relationship: relationship,
                birthdate: moment(familiarForm.birthdate).local().format('DD/MM/YYYY'),
                hasVisa: familiarForm.has_visa === 1 ? 'Si' : 'No',
                livesInUsa: familiarForm.lives_in_usa === 1 ? 'Si' : 'No',
                citizenStatus: familiarForm.citizen_status
            });

            handleChange({
                currentTarget:{
                    name:'relationships',
                    value:list
                }
            });

            setFamiliarForm({
                full_name:'',
                relationship:'',
                otherRelationship:'',
                birthdate:'',
                has_visa:0,
                lives_in_usa:0,
                citizen_status:''
            });
            setRequiredFamiliar(false);
        }, 300);
        
    }

    const handleDeleteRelatioships = (name:string)=>{

        const list = familiarInfo.relationships.filter((obj:any)=> obj.full_name !== name);

        handleChange({
            currentTarget:{
                name:'relationships',
                value:list
            }
        });
    }

    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold flex items-center gap-2">
                    <span>Familia directa</span>
                    <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>Familia directa: padre, madre, hermanos, hijos, cónyuge y otros familiares cercanos</Tooltip>}
                    >
                        <span className="cursor-help text-gray-400"><FaCircleInfo /></span>
                    </Whisper>
                </legend>
                <p className="text-xs text-red-500 mb-2">Los datos de papá y mamá son obligatorios.</p>
                <Row className="flex items-end familiar-form">
                    <Col xs={24} lg={8}>
                        <label>Nombre completo</label>
                        <Input
                            id="fullname"
                            name="full_name"
                            value={familiarForm.full_name}
                            onChange={onChangeForm}
                            required={requiredFamiliar}
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Parentesco</label>
                        <SelectForm
                            id="relationship"
                            options={relationships}
                            value={familiarForm.relationship}
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, relationship: value})}
                            required={requiredFamiliar}
                        />
                    </Col>
                    {familiarForm.relationship === 'Otro' && (
                        <Col xs={24} lg={4}>
                            <label>¿Cuál?</label>
                            <Input
                                id="otherRelationship"
                                value={familiarForm.otherRelationship}
                                onChange={onChangeForm}
                                required={requiredFamiliar}
                            />
                        </Col>
                    )}
                    <Col xs={24} lg={4}>
                        <label>F. Nacimiento</label>
                        <Input
                            id="birthdate"
                            type="date"
                            value={familiarForm.birthdate}
                            onChange={onChangeForm}
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>Tiene visa?</label>
                        <SelectForm
                            id="has_visa"
                            options={[
                                {value:0, label:'No'},
                                {value:1, label:'Si'}
                            ]}
                            value={familiarForm.has_visa}
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, has_visa: value})}
                            required={requiredFamiliar}
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>Vive en EEUU?</label>
                        <SelectForm
                            id="lives_in_usa"
                            options={[
                                {value:0, label:'No'},
                                {value:1, label:'Si'}
                            ]}
                            value={familiarForm.lives_in_usa}
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, lives_in_usa: value})}
                            required={requiredFamiliar}
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Residente/Ciudadano</label>
                        <SelectForm
                            id="citizen_status"
                            options={[
                                {value:'Residente', label:'Residente'},
                                {value:'Ciudadano', label:'Ciudadano'}
                            ]}
                            value={familiarForm.citizen_status}
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, citizen_status: value})}
                        />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button onClick={handleAddFamiliar}>Agregar</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={24}>
                        <Table
                            columns={columns}
                            data={familiarInfo.relationships}
                            height={200}
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default FamiliarInfo;