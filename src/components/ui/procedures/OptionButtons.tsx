import { Col,  Row } from "rsuite";
import Button from "../../common/Button";

type Props = {
    client: any,
    onSelectOptions: (item: string, option: string) => void
}

const OptionButtons = ({client, onSelectOptions}: Props)=>{
    return(
        <>
            <label>Selecciones las opciones</label>
            {Object.keys(client.options).map((key, index)=>
                <Row key={index}>
                    {Object.keys(client.options[key]).map((item, index1)=>
                        ((key === 'renew' && client.options.option.renewal.value) || key !== 'renew') && 
                            <Col xs={24 / Object.keys(client.options[key]).length} key={index1}>
                                <Button
                                    size="md"
                                    onClick={()=>onSelectOptions(key, item)} 
                                    color={client.options[key][item].value ? "blue" : "red"}  
                                    appearance={client.options[key][item].value ? "primary" : "ghost"} 
                                    customClass="w-full"
                                >{client.options[key][item].title}</Button>
                            </Col>
                    )}
                </Row>
            )}
        </>
    )
}

export default OptionButtons;