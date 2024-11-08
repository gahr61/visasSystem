import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar as NavbarContent } from "rsuite";
import moment from "moment";

import NavbarBrand from "rsuite/esm/Navbar/NavbarBrand";

import AdminIcon from '@rsuite/icons/Admin';
import MenuIcon from '@rsuite/icons/Menu';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';

import { decript } from "../../utils/functions";
import { IUser } from "../../utils/interfaces/function";



interface INavbar {
    expanded: boolean,
    showOpenSide: boolean,
    openSide: ()=>void
}

const Navbar = ({
    expanded,
    showOpenSide,
    openSide
}: INavbar)=>{
    const navigate = useNavigate();

    const user: IUser = decript('user') !== '' ? JSON.parse(decript('user')) : {id:0, name:''};

    const [ time, setTime ] = useState(moment().local().format('HH:mm:ss a'));

    /**
     * Get local time and call the same function each 1 second
     */
    const getTime = ()=>{
        setTimeout(()=>{
            setTime(moment().local().format('HH:mm:ss a'));
            getTime();
        }, 1000);
    };

    useEffect(()=>{
        getTime();
    },[]);

    return (
        <NavbarContent appearance="subtle" className="bg-white">
            
            <Nav>
                <Nav.Item onClick={openSide}>
                    {showOpenSide ?
                        expanded ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />
                    :
                        <MenuIcon />
                    }
                    
                </Nav.Item>
            </Nav>

            {!expanded && (
                <NavbarBrand onClick={()=>navigate('/admin/dashboard')} className="cursor-pointer">
                    Visas Premier
                </NavbarBrand>
            )}
            <Nav pullRight>
                <Nav.Item className="hidden sm:block">{time}</Nav.Item>
                <Nav.Menu title={user.name} icon={<AdminIcon />}>
                    <Nav.Item>Restablecer contraseña</Nav.Item>
                    <Nav.Item>Salir</Nav.Item>
                </Nav.Menu>
            </Nav>
        </NavbarContent>
    )
}

export default Navbar;