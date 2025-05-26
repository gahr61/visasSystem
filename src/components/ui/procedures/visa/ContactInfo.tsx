import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm, { ISelectOptions } from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAddressStore } from "../../../../utils/stores/useAddressStore";
import { getStates } from "../../../../utils/services/countries";
import { isValidForm } from "../../../../utils/functions";
import Toast from "../../../common/Toast";

type PhoneForm = {
    id: number,
    type: string,
    number: string
}

type Props = {
    contactInfo: any,
    handleChange:(e:any) => void
}


const ContactInfo = ({
    contactInfo,
    handleChange
}:Props)=>{

    const countries = useAddressStore(state => state.countries);
    const [states, setStates] = useState<ISelectOptions[]>([]);
    const [phonesForm, setPhonesForm] = useState({
        number:'',
        type:''        
    })

    const columns: Columns[] = [
        {key:'type', title:'Tipo', grow:1, render:(row: PhoneForm)=>row.type},
        {key:'number', title:'Número', grow:1, render:(row: PhoneForm)=>row.number},
        {key:'actions', title:'', grow:2, render:(row: PhoneForm) => {
            return(
                <>
                    <ButtonTable 
                        controlId="delete" 
                        title="Eliminar" 
                        icon={<FaTrashAlt />} 
                        onClick={()=>handleDeletePhone(row.id)}
                    />
                </>
            )
        }}
    ]

    const onChange = (e:any)=>{
        const {name, value} = e.currentTarget;

        handleChange({
            currentTarget:{
                name:'address', 
                value:{
                    ...contactInfo.address,
                    [name]: value.toUpperCase()
                }
            }
        });

        if(name === 'country'){
            if(value === ''){
                setStates([]);
            }else{
                onLoadStates(value);
            }
        }
    }

    const onLoadStates = async (country_id:number) => {
        const response = await getStates(country_id);

        if(response && response.success){
            setStates(response.data);
        }
    }

    const handleAddPhone = ()=>{
        if(!isValidForm('div.phones-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(phonesForm.number.length < 12){
            Toast.fire('Error', 'El número de teléfono no tiene el formato correcto', 'error');
            return;
        }

        let list = [...contactInfo.phones];

        const exist = list.find((obj:any) => obj.number === phonesForm.number);

        if(exist){
            Toast.fire('Error', 'El número de teléfono que intenga registrar ya se encuentra en el listado', 'error');
            return;
        }

        list.push({
            id: Date.now(),
            number: phonesForm.number,
            type: phonesForm.type
        });

        handleChange({
            currentTarget:{
                name:'phones', 
                value:list
            }
        });
        
        setPhonesForm({type:'', number:''});
    }

    const handleDeletePhone = (id:number) => {
        const list = contactInfo.phones.filter((obj:any) => obj.id !== id);

        handleChange({
            currentTarget:{
                name:'phones', 
                value:list
            }
        });
    }

    useEffect(()=>{
        if(contactInfo.address.country){
            onLoadStates(contactInfo.address.country)
        }
    },[]);

    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Dirección</legend>
                <Row className="address-form">
                    <Col xs={24} lg={6}>
                        <label>Calle</label>
                        <Input 
                            id="street"
                            value={contactInfo.address.street}
                            onChange={(e:any)=>onChange(e)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Int</label>
                        <Input 
                            type="number" 
                            id="noInt"
                            value={contactInfo.address.noInt}
                            onChange={(e:any)=>onChange(e)}
                        />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Ext.</label>
                        <Input 
                            type="number" 
                            id="noExt"
                            value={contactInfo.address.noExt}
                            onChange={(e:any)=>onChange(e)}
                            required    
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Código postal</label>
                        <Input 
                            id="postCode"
                            value={contactInfo.address.postCode}
                            onChange={(e:any)=>onChange(e)}
                            required
                            maxLength={5}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Colonia</label>
                        <Input 
                            id="colony"
                            value={contactInfo.address.colony}
                            onChange={(e:any)=>onChange(e)}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>País</label>
                        <SelectForm 
                            id="country" 
                            options={countries} 
                            value={contactInfo.address.country} 
                            handleChange={(e:any)=>onChange({currentTarget:{name:'country', value: e}})}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado</label>
                        <SelectForm 
                            id="state" 
                            options={states} 
                            value={contactInfo.address.state} 
                            handleChange={(e:any)=>onChange({currentTarget:{name:'state', value: e}})}
                            required
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad</label>
                        <Input 
                            id="city"
                            value={contactInfo.address.city}
                            onChange={(e:any)=>onChange(e)}
                            required
                        />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Teléfono</legend>
                <Row className="flex items-end phones-form">
                    <Col xs={4}>
                        <label>Tipo</label>
                        <SelectForm 
                            id="type" 
                            options={[
                                {label:'Casa', value:'Casa'},
                                {label:'Trabajo', value:'Trabajo'},
                                {label:'Celular', value:'Celular'},
                                {label:'Otro', value:'Otro'},
                            ]} 
                            value={phonesForm.type}                             
                            handleChange={(value)=>setPhonesForm({...phonesForm, type: value})} 
                            required
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Número</label>
                        <Input 
                            type="tel"
                            id="phone"
                            value={phonesForm.number}
                            onChange={(e:any)=>setPhonesForm({...phonesForm, number: e.currentTarget.value})} 
                            required
                        />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button onClick={handleAddPhone}>Agregar</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Table 
                            columns={columns}
                            data={contactInfo.phones}
                            height={150}
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default ContactInfo;