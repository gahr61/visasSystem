import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Col, Drawer, Grid, Row } from "rsuite";
import Navbar from "./Navbar";
import SidebarAdmin from "./Sidebar";

const Layout = ()=>{
    const [ expanded, setExpanded ] = useState(false);
    const [ showSidebar, setShowSidebar ] = useState(false);

    /**
     * Open or close sidebar
     */
    const onOpenSidebar = ()=>{
        setExpanded(!expanded);
    }

    /**
     * Allow to show or hide sidebar in small screens
     */
    const onResizeWindow = ()=>{
        let width = window.innerWidth;

        setShowSidebar(width >= 1000);
    }

    useEffect(()=>{
        onResizeWindow();

        window.addEventListener('resize', ()=>{ onResizeWindow(); });
    },[])


    return (
        <Grid fluid className="h-[100vh] w-full">
            <Row className="h-full">
                {showSidebar ? 
                    <Col xsHidden lg={expanded ? 3 : 1} className="relative">
                        <SidebarAdmin expanded={expanded}/>
                    </Col>
                :
                    <Drawer placement="left" open={expanded} onClose={()=>setExpanded(false)} size={'70%'}>
                        <SidebarAdmin expanded={true} />
                    </Drawer>
                }
                <Col xs={24} lg={expanded ? 21 : 23} className="p-0 h-full">
                    <Col xs={24} id="header-content" className="p-0">
                        <Navbar 
                            expanded={expanded}
                            showOpenSide={showSidebar}
                            openSide={onOpenSidebar}
                        />
                    </Col>
                    <Col xs={24} style={{height: 'calc(100vh - '+document.getElementById('header-content')?.offsetHeight+'px)'}}>
                        <Outlet />
                    </Col>
                </Col>
            </Row>
        </Grid>
    )

}

export default Layout;