import { Col, Grid, Row } from "rsuite"
import Input from "../../../common/Input";
import SelectForm from "../../../common/Select";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";

type FamiliarForm = {
    id:number,
    name: string,
    parent: string,
    birthdate: string,
    hasVisa: boolean
}

const FamiliarInfo = ()=>{
    const columns: Columns[] = [
        {key:'name', title:'Nombre', grow:3, render:(row: FamiliarForm) => row.name},
        {key:'parent', title:'Parentesco', grow:1, render:(row: FamiliarForm) => row.parent},
        {key:'birtdate', title:'F. Nacimiento', grow:1, render:(row: FamiliarForm) => row.birthdate},
        {key:'hasVisa', title:'Tiene visa?', grow:1, render:(row: FamiliarForm) => row.hasVisa},
        {key:'actions', title:'', grow:1, render:(row: FamiliarForm) => 
            <>
                <ButtonTable controlId="delete" title="Eliminar" icon={<FaTrashAlt />} />
            </>
        }
    ]
    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Familia</legend>
                <Row className="flex items-end">
                    <Col xs={24} lg={10}>
                        <label>Nombre completo</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Parentesco</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>F. Nacimiento</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Parentesco</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button>Agregar</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={24}>
                        <Table
                            columns={columns}
                            data={[]}
                            height={200}
                        />
                    </Col>
                </Row>
            </fieldset>
        </Grid>
    )
}

export default FamiliarInfo;