import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import React, { useState } from "react";
import { isValidForm } from "../../../../utils/functions";
import Toast from "../../../common/Toast";
import moment from "moment";

type FamiliarForm = {
    id:number,
    full_name: string,
    relationship_id:string,
    relationship:string,
    birthdate: string,
    hasVisa: boolean
}

type Props = {
    familiarInfo: any,
    handleChange:(e:any) => void
}

const relationships = [
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'hermano', label: 'Hermano' },
    { value: 'hermana', label: 'Hermana' },
    { value: 'hijo', label: 'Hijo' },
    { value: 'hija', label: 'Hija' },
    { value: 'esposo', label: 'Esposo' },
    { value: 'esposa', label: 'Esposa' },
    { value: 'abuelo', label: 'Abuelo' },
    { value: 'abuela', label: 'Abuela' },
    { value: 'nieto', label: 'Nieto' },
    { value: 'nieta', label: 'Nieta' },
    { value: 'tio', label: 'Tío' },
    { value: 'tia', label: 'Tía' },
    { value: 'sobrino', label: 'Sobrino' },
    { value: 'sobrina', label: 'Sobrina' },
    { value: 'primo', label: 'Primo' },
    { value: 'prima', label: 'Prima' },
    { value: 'cuñado', label: 'Cuñado' },
    { value: 'cuñada', label: 'Cuñada' },
    { value: 'yerno', label: 'Yerno' },
    { value: 'nuera', label: 'Nuera' },
    { value: 'suegro', label: 'Suegro' },
    { value: 'suegra', label: 'Suegra' },
    { value: 'padrastra', label: 'Padrastro' },
    { value: 'madrastra', label: 'Madrastra' },
    { value: 'hermanastro', label: 'Hermanastro' },
    { value: 'hermanastra', label: 'Hermanastra' },
    { value: 'primohermano', label: 'Primo hermano' },
    { value: 'primossegundos', label: 'Primos segundos' },
    { value: 'bautizo', label: 'Padrino/Madrina' },
    { value: 'ahijado', label: 'Ahijado' },
    { value: 'ahijada', label: 'Ahijada' }
];

const FamiliarInfo = ({
    familiarInfo,
    handleChange
}:Props)=>{
    const columns: Columns[] = [
        {key:'name', title:'Nombre', grow:3, render:(row: FamiliarForm) => row.full_name},
        {key:'parent', title:'Parentesco', grow:1, render:(row: FamiliarForm) => row.relationship},
        {key:'birtdate', title:'F. Nacimiento', grow:1, render:(row: FamiliarForm) => row.birthdate},
        {key:'hasVisa', title:'Tiene visa?', grow:1, render:(row: FamiliarForm) => row.hasVisa},
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

    const [familiarForm, setFamiliarForm] = useState({
        full_name:'',
        relationship:'',
        birthdate:'',
        has_visa:0
    })

    const onChangeForm = (e:React.FormEvent<HTMLInputElement | HTMLSelectElement>)=>{
        const {name, value} = e.currentTarget;

        setFamiliarForm({
            ...familiarForm,
            [name]: value.toUpperCase()
        });
    }

    const handleAddFamiliar = ()=>{
        if(!isValidForm('div.familiar-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        const exist = familiarInfo.relationships.find((obj:any) => obj.fullname === familiarForm.full_name);

        if(exist){
            Toast.fire('Error', 'El familiar que intenga ingresar ya se encuentra en el listado', 'error');
            return;
        }

        let list = [...familiarInfo.relationships];

        list.push({
            name: familiarForm.full_name,
            relationship: familiarForm.relationship.toUpperCase(),
            birthdate: moment(familiarInfo.birthdate).local().format('DD/MM/YYYY'),
            hasVisa: familiarForm.has_visa === 1 ? 'Si' : 'No'
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
            birthdate:'',
            has_visa:0
        });
    }

    const handleDeleteRelatioships = (name:string)=>{

        const list = familiarInfo.relationships.filter((obj:any)=> obj.name !== name);

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
                <legend className="font-semibold">Familia</legend>
                <Row className="flex items-end familiar-form">
                    <Col xs={24} lg={10}>
                        <label>Nombre completo</label>
                        <Input 
                            id="fullname"
                            value={familiarForm.full_name}
                            onChange={onChangeForm}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Parentesco</label>
                        <SelectForm 
                            id="relationship" 
                            options={relationships} 
                            value={familiarForm.relationship} 
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, relationship: value})} 
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>F. Nacimiento</label>
                        <Input 
                            id="birthdate"
                            type="date"
                            value={familiarForm.birthdate}
                            onChange={onChangeForm}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Tiene visa?</label>
                        <SelectForm 
                            id="has_visa" 
                            options={[
                                {value:0, label:'No'},
                                {value:1, label:'Si'}
                            ]} 
                            value={familiarForm.has_visa} 
                            handleChange={(value:any)=>setFamiliarForm({...familiarForm, has_visa: value})} 
                            required
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