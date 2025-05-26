import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, InputGroup, Modal, Row } from "rsuite";
import Button from "../../common/Button";
import Table, { Columns } from "../../common/Table";
import Input from "../../common/Input";
import { IApp } from "../../../utils/interfaces/function";
import { processAccountUpdate } from "../../../utils/services/process";
import Toast from "../../common/Toast";
import EyeCloseIcon from '@rsuite/icons/EyeClose';
import VisibleIcon from '@rsuite/icons/Visible';
import { encryptString } from "../../../utils/functions";

interface AccountTable {
    client_id: number,
    client:string,
    user: string,
    password: string,
    showPassword: boolean
}

interface Props extends IApp{
    id: number,
    onLoad: (id:number) => void
}

const ModalAccount = forwardRef(({loader, id, onLoad}:Props, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<AccountTable[]>([]);
    const columns:Columns[] = [
        {key:'client', title:'Nombre', grow:2, render:(row: AccountTable) => row.client},
        {key:'user', title:'Usuario', grow:2, render:(row: AccountTable) => 
            <Input name='user' value={row.user || ''} onChange={(e:any)=>handleChange(e, row.client_id)} />
        },
        {key:'user', title:'Contraseña', grow:2, render:(row: AccountTable) => 
            <InputGroup inside>
                <Input name='password' type={row.showPassword ? 'text' : 'password'} value={row.password || '' } onChange={(e:any)=>handleChange(e, row.client_id)} />

                <InputGroup.Button onClick={()=>handleShowPassword(row.client_id)}>
                    {row.showPassword ? <VisibleIcon /> : <EyeCloseIcon />}
                </InputGroup.Button>
            </InputGroup>
            
        },
    ]

    const handleShow = (list:any)=>{
        setOpen(true);
        setData(list);
    }

    const handleClose = ()=>{
        setOpen(false);
        setData([]);
    }

    const handleShowPassword = (id: number)=>{
        const items = data.map((item:AccountTable)=>{
            if(id === item.client_id){
                item = {
                    ...item,
                    showPassword: !item.showPassword
                }
            }

            return item;
        })

        setData(items);
    }

    const handleChange = (e:React.FormEvent<HTMLInputElement>, id:number)=>{
        const {value, name} = e.currentTarget;

        const items = data.map((item:AccountTable)=>{
            if(id === item.client_id){
                item = {
                    ...item,
                    [name]: value
                }
            }

            return item;
        })

        setData(items);
    }

    const handleSubmit = async ()=>{

        let items:any = [];

        data.forEach((item)=>{
            const element = {
                sales_id: id,
                clients_id: item.client_id,
                user: item.user,
                password: encryptString(item.password)
            };

            if(item.user !== '' && item.password !== ''){
                items.push(element);
            }
        });

        if(items.length > 0){
            
            loader.current?.handleShow('Actualizando...');

            const response = await processAccountUpdate(items);

            loader.current?.handleClose();
            
            if(response && response.success){
                Toast.fire('Correcto', response.message, 'success');
                handleClose();
                onLoad(id);
                return;
            }

            Toast.fire('Error', response.message, 'error');
        }

        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal size={'md'} open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Registrar Cuenta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24}>
                            <Table 
                                columns={columns}
                                data={data}
                                autoHeight
                            />
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-3">
                    <Button appearance="default" onClick={handleClose}>Cancelar</Button>
                    <Button appearance="primary" onClick={handleSubmit}>Guardar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalAccount;