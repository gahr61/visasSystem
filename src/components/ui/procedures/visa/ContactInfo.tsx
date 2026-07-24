import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { isValidForm } from "../../../../utils/functions";
import Toast from "../../../common/Toast";
import AddressForm from "../AddressForm";

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

    const [requiredPhones, setRequiredPhones] = useState(false);
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

    const onChangeAddress = (address:any)=>{
        handleChange({currentTarget:{name:'address', value:address}});
    }

    const handleAddPhone = async ()=>{
        setRequiredPhones(true);

        setTimeout(()=>{
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
            setRequiredPhones(false);
        },  300)
        
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

    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Dirección</legend>
                <div className="address-form">
                    <AddressForm address={contactInfo.address} onChange={onChangeAddress} />
                </div>
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
                            required={requiredPhones}
                        />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Número</label>
                        <Input 
                            type="tel"
                            id="phone"
                            value={phonesForm.number}
                            onChange={(e:any)=>setPhonesForm({...phonesForm, number: e.currentTarget.value})} 
                            required={requiredPhones}
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