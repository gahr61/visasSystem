import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";

type PhoneForm = {
    id: number,
    type: string,
    number: string
}

const ContactInfo = ()=>{
    const columns: Columns[] = [
        {key:'type', title:'Tipo', grow:1, render:(row: PhoneForm)=>row.type},
        {key:'number', title:'Número', grow:1, render:(row: PhoneForm)=>row.type},
        {key:'actions', title:'', grow:2, render:(row: PhoneForm) => {
            return(
                <>
                    <ButtonTable controlId="delete" title="Eliminar" icon={<FaTrashAlt />} />
                </>
            )
        }}
    ]
    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Dirección</legend>
                <Row>
                    <Col xs={24} lg={6}>
                        <label>Calle</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Int</label>
                        <Input type="number" />
                    </Col>
                    <Col xs={24} lg={3}>
                        <label>No. Ext.</label>
                        <Input type="number" />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Código postal</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Colonia</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>País</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Estado</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Ciudad</label>
                        <Input />
                    </Col>
                </Row>
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Teléfono</legend>
                <Row className="flex items-end">
                    <Col xs={4}>
                        <label>Tipo</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Número</label>
                        <Input type="tel" />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button>Agregar</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Table 
                            columns={columns}
                            data={[]}
                            height={150}
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default ContactInfo;