import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Grid, Panel, Row } from "rsuite"

import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import Input from "../../components/common/Input";

import { ILogin } from "../../utils/interfaces/auth";
import { IApp } from "../../utils/interfaces/function";

import { encript, isAuth, isValidForm, setDataStorage } from "../../utils/functions";

import { login } from "../../utils/services/auth";

import logo from '../../assets/images/logo.png';

const Login = ({loader}: IApp)=>{
    /** verify is session is stated */
    if(isAuth()){
        //window.location.href = '/';
    }

    const [ data, setData ] = useState<ILogin>({
        email: 'sistemas@visas-premier.com',
        password: 'qwer1234'
    });

    const [ errorEmail, setErrorEmail ] = useState('');

    const handleChange = (e: React.FormEvent<HTMLInputElement>)=>{
        const { name, value } = e.currentTarget;
        
        setData({
            ...data,
            [name]: value
        });
    }

    const onSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        
        
        if(!isValidForm('form.admin-login-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');

            return;
        }

        if(errorEmail !== ''){
            Toast.fire('Error', 'Verifique los campos', 'error');
            return;
        }

        loader.current?.handleShow('Cargando...');

        let response = await login(data);
       
        if(response){
            if(!response.success){
                Toast.fire('Error', response.message, 'error');
            }else{
                encript('token', response.data?.access_token ?? '');
                encript('changePassword', response.data?.user.change_password_required.toString() ?? '');


                if(response.data?.user?.change_password_required){

                }else{
                    setDataStorage(response.data);

                    window.location.href = '/';
                }
            }
        }

        loader.current?.handleClose();
    }

    return(
        <Grid fluid className="h-[100vh]">
            <Row className="h-full flex justify-center items-center">
                <Col xs={22} sm={20} md={12} lg={8} xxl={6}>
                    <Panel bordered>
                        <Row>
                            <Col xsOffset={5} xs={14} mdOffset={7} md={10} className="flex justify-center">
                                <img src={logo} className="img-fluid" />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} className="py-3">
                                <h1 className="text-xl text-center text-darkBlue-500">Servicios Premier</h1>
                            </Col>
                            <Col xs={24}>
                                <form className="admin-login-form border border-transparent grid">
                                    <Row className="grid gap-2">
                                        <Col xs={24}>
                                            <label htmlFor="username">
                                                Correo electrónico
                                                <span className="span-required text-red-600">
                                                    *
                                                    {<span className="text-sm text-red-400 ms-2">{errorEmail}</span>}
                                                </span>
                                            </label>
                                            <Input
                                                id="email"
                                                type='email'
                                                value={data.email}
                                                onChange={handleChange}
                                                setErrorEmail={setErrorEmail}
                                                required
                                            />
                                        </Col>

                                        <Col xs={24}>
                                            <label htmlFor="password">Contraseña <span className="span-required text-red-600">*</span></label>
                                            <Input 
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={handleChange}
                                                onKeyPress={(e)=>e.key === 'Enter' ? onSubmit(e) : {}}
                                                required
                                            />
                                        </Col>

                                        <Link to="" className="text-sm text-blue-500">Recuperar Contraseña</Link>

                                        <Col xs={24} className="py-3 flex justify-end">
                                            <Button onClick={(e)=>onSubmit(e)}>Ingresar</Button>
                                        </Col> 
                                    </Row>
                                </form>
                            </Col>
                        </Row>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    )

}

export default Login;