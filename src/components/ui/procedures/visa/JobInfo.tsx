import { Col, Grid, Row } from "rsuite"
import SelectForm from "../../../common/Select";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Table, { Columns } from "../../../common/Table";
import ButtonTable from "../../../common/ButtonTable";
import { FaTrashAlt } from "react-icons/fa";

type EducationForm = {
    id: number,
    school: string,
    address: string,
    period: string
}

const JobInfo = ()=>{
    const columns: Columns[] = [
        {key:'school', title:'Escuela', grow:3, render:(row:EducationForm) => row.school},
        {key:'address', title:'Dirección', grow:3, render:(row:EducationForm) => row.address},
        {key:'period', title:'Periodo', grow:1, render:(row:EducationForm) => row.period},
        {key:'actions', title:'', grow:3, render:(row:EducationForm) => 
            <>
                <ButtonTable controlId="delete" title="Eliminar" icon={<FaTrashAlt />} />
            </>
        },
    ]
    return(
        <Grid fluid>
            <fieldset>
                <legend className="font-semibold">Ocupación</legend>
                <Row>
                    <Col xs={24} lg={8}>
                        <label>Ocupación actual</label>
                        <SelectForm id="" options={[]} value="" handleChange={()=>{}} />
                    </Col>
                    <Col xs={24} lg={6}>
                        <label>Nombre Ocupación</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Sueldo mensual</label>
                        <Input type="number" />
                    </Col>
                    <Col xs={24} lg={4}>
                        <label>Antiguedad</label>
                        <Input />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={22}>
                        <label>Nombre de empleo o escuela</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={22}>
                        <label>Dirección de empleo o escuela</label>
                        <Input />
                    </Col>
                </Row>
                
            </fieldset>
            <hr className="my-2" />
            <fieldset>
                <legend className="font-semibold">Educación</legend>
                <Row className="flex items-end">
                    <Col xs={24} lg={10}>
                        <label>Escuela</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={10}>
                        <label>Dirección</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={2}>
                        <label>Periodo</label>
                        <Input />
                    </Col>
                    <Col xs={24} lg={2}>
                        <Button>Agregar</Button>
                    </Col>
                </Row>
                <Row className="nt-3">
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

export default JobInfo;