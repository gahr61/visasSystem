import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Col, Grid, Row } from "rsuite";
import Navbar from "./Navbar";

const Layout = ()=>{
    const [ expanded, setExpanded ] = useState(false);
    const [ showSidebar, setShowSidebar ] = useState(false);

    /**
     * Open or close sidebar
     */
    const onOpenSidebar = ()=>{
        setExpanded(!open);
    }

    /**
     * Allow to show or hide sidebar in small screens
     */
    const onResizeWindow = ()=>{
        let width = window.innerWidth;
        
        setShowSidebar(width >= 800);
    }

    useEffect(()=>{
        onResizeWindow();

        window.addEventListener('resize', ()=>{ onResizeWindow(); });
    },[])

    return (
        <Grid fluid>
            <Row>
                <Col xs={24} lg={expanded ? 21 : 23}>
                    <Col xs={24}>
                        <Navbar 
                            expanded={expanded}
                            showOpenSide={showSidebar}
                            openSide={onOpenSidebar}
                        />
                    </Col>
                </Col>
            </Row>
            <Outlet />
        </Grid>
    )
}

export default Layout;