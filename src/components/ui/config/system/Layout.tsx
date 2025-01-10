import { Outlet,  useNavigate } from "react-router-dom";
import { Col, Grid, Nav, Row, Sidenav } from "rsuite"
import Content from "../../../common/Content";

const SystemLayout = ()=>{
    const navigate = useNavigate();

    return (
        <Content
            url="/"
            page="Configuración"
            subpage="Sistema"
            title="Configuración de sistema"
        >
             <Grid fluid>
                <Row>
                    <Col xs={6}>
                        <Sidenav>
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item onClick={()=>navigate('/config/catalog/list')}>Catalogo</Nav.Item>
                                    <Nav.Item onClick={()=>navigate('/config/commissions/list')}>Comisiones</Nav.Item>
                                    <Nav.Item onClick={()=>navigate('/config/branch_offices/list')}>Sucursales</Nav.Item>
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </Col>
                    <Col xs={18}>
                        <Outlet />
                    </Col>
                </Row>            
            </Grid>
        </Content>
    )
}

export default SystemLayout;