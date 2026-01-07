import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar as NavbarContent } from "rsuite";
import moment from "moment";

import NavbarBrand from "rsuite/esm/Navbar/NavbarBrand";

import AdminIcon from '@rsuite/icons/Admin';
import MenuIcon from '@rsuite/icons/Menu';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';

import { IUser } from "../../utils/interfaces/function";
import { appContext } from "../../context/appContext";
import { logout } from "../../utils/services/auth";
import Toast from "./Toast";
import { useUserStore } from "../../utils/stores/useUserStore";

import logo from '../../assets/images/logo.png';

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

    const {resetPassword} = appContext();
 
    const user: IUser = useUserStore(state => state.user);
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


    const openResetPassword = ()=>{        
        resetPassword?.handleShow();
    }

    const handleLogout = async ()=>{
        
        const response =  await logout();

        if(response){
            localStorage.clear();
            sessionStorage.clear();

            navigate('/login');

            Toast.fire('Correcto', 'La sesión se funalizo correctamente', 'success');

            return;
        }
        
        Toast.fire('Error', 'Error al intentar cerrar sesión', 'error');
    }

    useEffect(()=>{
        getTime();
    },[]);

    return (
        <NavbarContent appearance="subtle" className="bg-white">
            
            <Nav>
                {user.role !== 'cliente' && (
                    <Nav.Item onClick={openSide}>
                        {showOpenSide ?
                            expanded ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />
                        :
                            <MenuIcon />
                        }
                        
                    </Nav.Item>
                )}
                
            </Nav>

            {!expanded && (
                <NavbarBrand onClick={()=>navigate('/admin/dashboard')} className="cursor-pointer flex flex-row">
                    {user.role === 'cliente' && (
                        <img src={logo} className="me-2 border" />
                    )}
                    <span className="">Visas Premier</span>
                </NavbarBrand>
            )}
            <Nav pullRight>
                <Nav.Item className="hidden sm:block">{time}</Nav.Item>
                <Nav.Menu title={user.name} icon={<AdminIcon />}>
                    <Nav.Item onClick={()=>openResetPassword()}>Restablecer contraseña</Nav.Item>
                    <Nav.Item onClick={()=>handleLogout()}>Salir</Nav.Item>
                </Nav.Menu>
            </Nav>
        </NavbarContent>
    )
}

export default Navbar;