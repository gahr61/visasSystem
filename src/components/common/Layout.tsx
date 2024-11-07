import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Col, Grid, Row } from "rsuite";

const Layout = ()=>{
    const [ expanded, setExpanded ] = useState(false)
    return (
        <Grid fluid>
            <Row>
                <Col xs={24} lg={expanded ? 21 : 23}>
                </Col>
            </Row>
            <Outlet />
        </Grid>
    )
}

export default Layout;