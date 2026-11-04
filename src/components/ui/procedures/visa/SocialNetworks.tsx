import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrash } from "react-icons/fa6";
import { useState } from "react";
import { randomString } from "../../../../utils/functions";
import Toast from "../../../common/Toast";

const networks = [
    {value:'Facebook', label:'Facebook'},
    {value:'Instagram', label:'Instagram'},
    {value:'X (Twitter)', label:'X (Twitter)'},
    {value:'Linkedin', label:'Linkedin'},
    {value:'Tiktok', label:'Tiktok'},
    {value:'Youtube', label:'Youtube'},
    {value:'Otra', label:'Otra'},
]

type Props = {
    generalInfo: any,
    handleChange:(e:any) => void
}

const SocialNetworks = ({
    generalInfo,
    handleChange
}:Props)=>{
    const [socialForm, setSocialForm] = useState<any>({
        socialNetwork:'',
        username:'',
        email:''
    });

    const networkColumns:Columns[] = [
        {key:'network', title:'Red Social', grow:3, render:(row:any) => row.socialNetwork},
        {key:'username', title:'Nombre de usuario / Página', grow:3, render:(row:any) => row.username},
        {key:'email', title:'Correo', grow:3, render:(row:any) => row.email || '—'},
        {key:'actions', title:'', grow:1, render:(row:any) => <>
            <ButtonTable
                controlId="delete"
                title="Eliminar"
                icon={<FaTrash />}
                onClick={()=>handleDeleteSocial(row.id)}
            />
        </>}
    ]

    const handleChangeSocialForm = (e:any)=>{
        const {name, value} = e.currentTarget;

        setSocialForm({
            ...socialForm,
            [name]: value
        });
    }

    const handleAddSocial = ()=>{
        let list = [...generalInfo.details.socialNetworks];

        var valid = true;

        /** El correo es opcional; red social y usuario son obligatorios */
        if(socialForm.socialNetwork === '' || socialForm.username === ''){
            valid = false;
        }

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
            Toast.fire('Alerta', 'Los campos red social y nombre de usuario no deben estar vacios', 'error');
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
        <Grid fluid>
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

export default SocialNetworks;
