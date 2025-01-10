import { forwardRef, useImperativeHandle, useState } from "react";
import { Message, Modal } from "rsuite";
import Button from "../../common/Button";
import { encript, isValidForm, setDataStorage } from "../../../utils/functions";
import Toast from "../../common/Toast";
import { usersReset } from "../../../utils/services/users";
import { PasswordReset } from "../../../utils/interfaces/auth";
import PasswordChangeForm from "../common/PasswordChangeForm";
import { logout } from "../../../utils/services/auth";

const ModalResetPassword = forwardRef(({loader}:{loader:any}, ref)=>{
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [dataForm, setDataForm] = useState({
        password:'',
        confirmPassword:''
    });
    const [message, setMessage] = useState('');
    const [data, setData] = useState<any>({});

    const handleShow = (id: string, type?: string, response = null)=>{
        setOpen(true);

        if(id){
            setUserId(id);
        }

        if(type){
            setMessage('Es necesario cambiar la contraseña por defecto');
        }

        if(response !== null){
            setData(response);
        }
        
    }

    const handleClose = ()=>{
        setOpen(false);
        setUserId('');
        setDataForm({password:'', confirmPassword:''});
        setMessage('');
		setData({});
    }

    const handleSubmit = async ()=>{

        if(!isValidForm('form.reset-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(dataForm.password !== dataForm.confirmPassword){
            Toast.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        loader.current.handleShow('Guardand...');

        let obj: PasswordReset = {            
            users_id: userId ? userId : null,
            password: dataForm.password,
            password_confirmation: dataForm.confirmPassword
        };

        let response = await usersReset(obj);

        loader.current.handleClose();

        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');

            if(message !== ''){
                encript('changePassword', '0');

                if(Object.keys(data).length > 0){
					setDataStorage(data);
					window.location.href = '/';
				}
            }

            handleClose();
            return;
        }

        Toast.fire('Error', response.message, 'error');

    }

    /** if modal is closed, session is ended */
	const sessionClose = async ()=>{
		let response = await logout();
		if(response){
			handleClose();

			window.location.reload();
		}

	}

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal 
            backdrop="static"
            open={open} 
            size={'xs'} 
            onClose={()=>message === '' ? handleClose() : sessionClose()}
            keyboard={message === ''}
        >
            <Modal.Header>
                <Modal.Title>Restablecer contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    {message !== '' && (
                        <Message type="info">{message}</Message>
                    )}
                    <PasswordChangeForm 
                        dataForm={dataForm}
                        setDataForm={setDataForm}
                    />
                </>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-2">
                    {message === '' && (
                        <Button onClick={handleClose} appearance="subtle" >Cancelar</Button>
                    )}
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalResetPassword;