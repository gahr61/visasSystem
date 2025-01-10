import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Divider, Grid, Nav, Row, Sidenav } from "rsuite";

import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GearIcon from '@rsuite/icons/Gear';
import DocPassIcon from '@rsuite/icons/DocPass';

import logo from '../../assets/images/logo.png';

interface ISubmenuItem {
    title: string;
    show: boolean;
    url: string;
    active: boolean;
}

interface IMenuItem {
    key: string;
    title: string;
    show: boolean;
    active: boolean;
    icon: ReactElement;
    url?: string;
    submenus: ISubmenuItem[],
    alignIcon: boolean
}

interface ISidebar {
    expanded: boolean,
    setExpanded?: (value: boolean)=>void
} 

const SidebarAdmin = ({expanded, setExpanded}:ISidebar)=>{
    const navigate = useNavigate();

    const [ activeKey, setActiveKey ] = useState('dashboard');

    const [ menus, setMenus ] = useState<IMenuItem[]>([
        {key:'dashboard', show:true, title:'Dashboard', active:false, alignIcon:false, icon:<DashboardIcon />, url:'/', submenus:[]},
        {key:'procedures', show:true, title:'Trámites', active:false, alignIcon:true, icon:<DocPassIcon />, submenus:[
            {title:'Pasaporte', show:true, url:'/procedures/passport/list', active:false},
            {title:'Visa', show:true, url:'/procedures/visa/list', active:false}
        ]},
        {key:'config', show:true, title:'Configuración', active:false, alignIcon:false, icon:<GearIcon />, submenus:[
            {title:'Sistema', show:true, url:'/config/commissions/list', active:false},
            {title:'Empleados', show:true, url:'/config/employees/list', active:false},
            {title:'Permisos', show:true, url:'/config/permissions/list', active:false},
            {title:'Roles', show:true, url:'/config/roles/list', active:false},
        ]}
    ]);

    const updateMenu = ()=>{
        let menuList = menus.map((m)=>{
            if(m.submenus.length === 0){
                if(m.url === location.pathname){
                    m.active = true;
                }else{
                    m.active = false;
                }
            }else{
                m.submenus.forEach((s)=>{
                    if(s.url === location.pathname){
                        
                        s.active = true;
                    }else{
                        s.active = false;
                    }
                });
            }
            

            return m;
        });

        setMenus(menuList);
    }

    /**
     * Navegate into url selected
     * @param url 
     */
    const onSelectMenu = (url: string)=>{
        navigate(url);

        updateMenu();

        if(setExpanded){
            setExpanded(false);
        }
        
    }
 
    return (
        <Grid fluid className="h-[100%]]">
           <Row className="flex flex-col gap-2 justify-center">
                <Col xs={12} xsOffset={6} md={expanded ? 12 : 22} mdOffset={expanded ? 6 : 1} className="flex justify-center">
                    <img src={logo} className="size-[100%] md:size-[30%] lg:w-full" />
                </Col>
                <Col xs={24} lgHidden={!expanded} xlHidden={!expanded} xxlHidden={!expanded} lg={24}>
                    <h3 className="text-center text-xl">Visas Premier</h3>
                </Col>
            </Row>
            <Divider className="m-0" />
            <Sidenav expanded={expanded} appearance="subtle" className="relative h-full">
                    <Sidenav.Body>
                        <Nav activeKey={activeKey} onSelect={setActiveKey}>
                            {menus.map((menu: IMenuItem, index: number)=>
                                menu.show ? 
                                    menu.submenus.length === 0 ?
                                        <Nav.Item  key={index} eventKey={menu.key} onClick={()=>onSelectMenu(menu.url ?? '')} icon={menu.icon}>
                                            {menu.title}
                                        </Nav.Item>
                                    : 
                                        <Nav.Menu key={index} className={menu.alignIcon ? 'icon-align' : ''}  placement="rightStart" eventKey={menu.key} title={menu.title} icon={menu.icon}>
                                            {menu.submenus.map((submenu, j)=>
                                                submenu.show &&
                                                    <Nav.Item key={j} eventKey={j} onClick={()=>onSelectMenu(submenu.url)}>
                                                        {submenu.title}
                                                    </Nav.Item>
                                            )}
                                        </Nav.Menu>
                                : null
                            )}
                        </Nav>
                    </Sidenav.Body>
                    
                </Sidenav>
        </Grid>
    )
}

export default SidebarAdmin;