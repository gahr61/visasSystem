import { Outlet, useLocation } from "react-router-dom";
import { Col, Grid, Nav, Row, Sidenav } from "rsuite"
import Content from "../../../common/Content";

const SystemLayout = ()=>{
    const location = useLocation();

    console.log(location);

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
                                    <Nav.Item active>Comisiones</Nav.Item>
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