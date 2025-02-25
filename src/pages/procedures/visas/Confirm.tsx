import { useEffect, useRef, useState } from "react";
import { Col, Grid, Row, Uploader } from "rsuite";
import { Link, useParams } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

import { FaUpload } from "react-icons/fa6";

import Input from "../../../components/common/Input";
import Table, { Columns } from "../../../components/common/Table";
import ButtonTable from "../../../components/common/ButtonTable";
import Button from "../../../components/common/Button";
import { ConfirmList } from "../../../components/ui/modals/ConfirmVisaPayment";

import logo from '../../../assets/images/logo.png';

import { IApp } from "../../../utils/interfaces/function";
import { validateToken } from "../../../utils/services/sales/token";
import Swal from "sweetalert2";
import ModalFilePreview from "../../../components/ui/modals/FilePreview";
import Toast from "../../../components/common/Toast";
import { salesClientsConfirm } from "../../../utils/services/clients";

const keySite = import.meta.env.VITE_GOOGLE_KEY;
const host_file = import.meta.env.VITE_FILES;

type ModalImageProps = {
    handleShow: (id:number, ticket: string) => void
}

interface ModalPreviewProps {
    handleShow: (file: any, isFile: boolean) => void
}

const VisaConfirm = ({loader}:IApp)=>{
    const captchaRef = useRef<any>(null);
    const imageModal = useRef<ModalImageProps>(null);
    const previewModal = useRef<ModalPreviewProps>(null);
    const {token} = useParams();

    const [data, setData] = useState<ConfirmList[]>([]);

    const columns: Columns[] = [
        {key:'client', title:'Cliente', grow:4, render:(row:ConfirmList)=> row.client},
        {key:'ticket', title:'Recibo', grow:2, render:(row:ConfirmList)=>
            <>
            {row.ticket !== null ? (
                <div className="w-14 h-12">
                    {row.ticket.indexOf('pdf') === -1 ?
                        <img src={row.ticket} className="w-full cursor-pointer" onClick={()=>onOpenModalImage(row.id, row.ticket)} />
                    :
                        <Link to="" onClick={(e)=>onOpenPreviewFile(e, row.ticket)}>Ticket</Link>
                    }                        
                </div>

            ): row.file.length > 0 ?
                <Link to="" onClick={(e)=>onOpenPreviewFile(e, row.file)} >{row.file[0].blobFile.name}</Link>
            :
                null
            }
        </>                
        },
        {key:'', title:'', grow:1, render:(row:ConfirmList)=>
            <>
                <Uploader fileList={row.file} action="" accept=".pdf, .jpg, .png, .jpeg" onChange={(e:any)=>onLoadFile(e, row.id)} autoUpload={false}>
                    <ButtonTable 
                        controlId="upload"
                        title="Cargar archivo"
                        icon={<FaUpload />}
                    />
                </Uploader>
            </>
        }
    ]

    const onLoad = async ()=>{
        if(token){
            getData(token);
        }
    }

    const getData = async (token: string) => {
        loader.current?.handleShow('Cargando...');

        const response = await validateToken({token:token});

        loader.current?.handleClose();

        if(response && response.success){
            let isConfirmed = 0;

            const items: ConfirmList[] = response.data.map((data: any)=>{
                const item = {
                    id: data.id,
                    client: data.names+' '+data.lastname1+(data.lastname2 !== null ? ' '+data.lastname2 : ''),
                    ticket: data.ticket !== null ? host_file + data.ticket : null,
                    confirm: data.is_confirmed,
                    is_confirmed: data.is_confirmed,
                    sales_id: data.sales_id,
                    clients_id: data.clients_id,
                    file:[]
                };

                if(data.is_confirmed){
                    isConfirmed++
                }

                return item;
            });

            setData(items);

            return;
        }

        if(response.data?.canShow === false){
            Swal.fire('Error', response.message, 'error').then((result)=>{
                if(result.isConfirmed){
                    window.location.href = 'http://www.visas-premier.com';
                }
            });            
        }
        
    }

    const onLoadFile = (e:any, id:number)=>{
        const dataList = data.map((item)=>{
            if(item.id === id){
                item = {...item, file: [e[e.length - 1]], confirm: true}
            }

            return item;
        });

        setData(dataList);
    }

    const onOpenModalImage = (id:number, image: string) => {
        imageModal.current?.handleShow(id, image);
    }

    const onOpenPreviewFile = (e:any, file:any)=>{
        e.preventDefault();

        const urlFile = URL.createObjectURL(file[0].blobFile);

        const isFile = file[0].name.indexOf('pdf') !== -1;

        previewModal.current?.handleShow(urlFile, isFile)
        
    } 

    const onSubmit = async ()=>{
        const token = captchaRef.current?.getValue();

        if(token === ''){
           // Toast.fire('Error', 'Debe realizar la verificación', 'error');
            //return;
        }

        let error = '';
        let countConfirm = 0;

        let obj = new FormData();
        
        data.forEach((item, index)=>{
            obj.append('salesPayment['+index+'][id]', item.id.toString());
            obj.append('salesPayment['+index+'][is_confirmed]', '0');
            obj.append('salesPayment['+index+'][clients_id]', item.clients_id.toString());
            obj.append('salesPayment['+index+'][sales_id]', item.sales_id.toString());

            if(item.file.length > 0){
                obj.append('salesPayment['+index+'][files][0]', item.file[0].blobFile);
                
                countConfirm++;
            }
            

            if(item.ticket === ''){
                if(item.file.length === 0){
                    error = 'No es posible confirmar los datos, debe cargar el archivo'
                }
            }

        });

        if(countConfirm < data.length - 1){
            Toast.fire('Error', 'No es posible confirmar, debe cargar los recibos de cada solicitante', 'error');
            return;
        }

        if(error !== ''){
            Toast.fire('Error', error, 'error');
            return;
        }
        loader.current?.handleShow('Confirmando...');

        const response = await salesClientsConfirm(obj);
        loader.current?.handleClose();

        if(response && response.success){
            Swal.fire('Correcto', response.message, 'success').then((result)=>{
                if(result.isConfirmed){
                    window.location.href = 'http://www.visas-premier.com';
                }
            });   
            return;
        }

        Toast.fire('ERror', response.message, 'error');
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return (
        <Grid fluid>
            <Row className="w-[100wh] h-[100vh] flex justify-center items-center">
                <Col xs={23} sm={20} md={18} lg={16} xl={10} className="border rounded-md shadow-md p-4">
                    <Row className="flex items-center">
                        <Col xs={4}>
                            <img src={logo} />
                        </Col>
                        <Col xs={20}>
                            <h3 className="text-center text-lg">Confirmación de pago de ficha</h3>
                        </Col>
                    </Row>
                    <hr className="my-3"/>

                    <Row>
                        <Col xs={24}>
                            <form encType="multipart/form-data">
                                <Row>
                                    <Col xs={24} lg={12}>
                                        <label>Folio</label>
                                        <Input />
                                    </Col>                                        
                                </Row>    
                                <hr className="my-2" />
                                <Row>
                                    <Col xs={24}>
                                        <Table 
                                            columns={columns}
                                            data={data}
                                            autoHeight
                                            height={200}                                            
                                        />
                                    </Col>
                                </Row>
                            </form>        
                        </Col>
                        <Col xs={24} className="my-2 flex justify-center">
                            <ReCAPTCHA 
                                sitekey={keySite}
                                ref={captchaRef}
                            />
                        </Col>
                        <Col xs={24}>
                            <div className="flex justify-center my-3">
                                <Button appearance="default" onClick={()=>window.location.href = 'http://www.vias-premier.com'}>Cancelar</Button>
                                <Button appearance="primary" onClick={onSubmit}>Confirmar</Button>
                            </div>
                        </Col>    
                    </Row>
                </Col>
            </Row>

            <ModalFilePreview  ref={previewModal} />
        </Grid>
    )
}

export default VisaConfirm;