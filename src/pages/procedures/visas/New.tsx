import { useState } from "react";
import Content from "../../../components/common/Content";
import { Col, Divider, Grid, Row} from "rsuite";
import Button from "../../../components/common/Button";
import { Visas } from "../../../utils/interfaces/procedure";
import ProcedureForm from "../../../components/ui/procedures/ProcedureForm";
import PaymentForm from "../../../components/ui/procedures/PaymentForm";
import { calculateAge, isValidForm } from "../../../utils/functions";
import Toast from "../../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { visaSalesStore } from "../../../utils/services/sales/visa";
import { IApp } from "../../../utils/interfaces/function";

const VisasNew = ({loader}:IApp)=>{
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Visas[]>([]);
    
    const [procedureType, setProcedureType] = useState('');

    const [showPayment, setShowPayment] = useState(false);

    const [dataPayment, setDataPayment] = useState<any>({
        payment:{
            branch_office_id:'',
            seller_id:'',
            contact:'',
            flyer_id:'',
            client:{
                names:"",
                lastname1:'',
                lastname2:'',
                email:'',
                phone:''
            },
            method_payment:'',
            receipt:'',
            reference:''
        },
        procedures:[],
        options:{
            minPayment:true,
            minPrice:0,
            otherPayment:false,
            otherPrice:0,
            totalProcedure:0,
            totalPay:0,
            totalPerPay:0
        }
    })
    
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPhone, setErrorPhone] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);


    const showPaymentForm = (value: boolean)=>{
        let errorsOptions:any[] = [];
        let errorForm:any[] = [];
        let errors:any[] = []

        if(!isValidForm('div.procedure-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(value === true){
            formData.forEach((form:any, index:number)=>{
                /**
                 * Verifica si se han seleccionado todas las opciones
                 */
                const options = Object.keys(form.options);
                let totalValid = form.options.option.renewal.value ? 0 : 1;
          
                options.forEach((key:string)=>{
                    const buttons = Object.keys(form.options[key]);
                    const validButton = buttons.find(obj => form.options[key][obj].value === true);

                    if(validButton ){
                        totalValid++;
                    }

                });

                if(totalValid !== options.length){
                    errorsOptions.push(form.title+' '+(index+1));
                }

                /**
                 * Validacion de formulario
                 */
                let error = false;
                if(!isValidForm('div.procedure-form-'+index)){
                    error = true;
                }

                if(errorEmail !== '' || errorPhone !== ''){
                    error = true;
                }

                if(error){
                    errorForm.push(form.title+' '+(index+1))
                }

                
            })

            if(errorsOptions.length > 0){
                errors.push(`Debe seleccionar todas las opciones (${errorsOptions.join(', ')})`)
            }
            
            if(errorForm.length > 0){
                errors.push(`Existen errores en los formularios  (${errorForm.join(', ')})`)
            }

            setErrors(errors);
        }

        if(errors.length === 0){
            const procedure = {
                procedure:'Visa',
                concept:'',
                amount:formData.length,
                price: 0,
                total:0
            }

            let payment = dataPayment.payment;

            payment = {
                ...payment,
                client:{
                    names: formData.length === 1 ? formData[0].client.names : '',
                    lastname1:formData.length === 1 ? formData[0].client.lastname1 : '',
                    lastname2:formData.length === 1 ? formData[0].client.lastname2 : '',
                    email:'',
                    phone:formData.length === 1 ? formData[0].client.phone : '',
                }
            }
            
            setDataPayment({
                ...dataPayment,
                payment: payment,
                procedures: [procedure]
            })


            setShowPayment(value)
        }

    }

    const handlePay = async ()=>{
        if(!isValidForm('div.payment-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            return;
        }

        if(errorEmail !== '' || errorPhone !== ''){
            Toast.fire('Error', 'Existen errores en los datos capturados, verifique la información', 'error');
            return;
        }

        loader.current?.handleShow('Guardando...');

        //valida si el pago es menor del pago total
        const perPay = parseInt(dataPayment.options.totalPerPay);
        if(perPay > dataPayment.options.totalProcedure){
            Toast.fire({title:'Error', text:'El total a pagar no puede ser mayor al total del trámite', icon:'error', timer:6000});
            return;
        }

        let commissions = [
            {users_id: dataPayment.payment.seller_id, commission:'Visa', type:'seller'}
        ];

        if(dataPayment.payment.flyer_id !== ''){
            commissions.push({
                users_id: dataPayment.payment.flyer_id, commission:'Volanteo', type:'flyer' //preguntar en esta parte como debe tomarse la comision
            });
        }

        let obj = {
            sales:{
                branch_office_id: dataPayment.payment.branch_office_id,
                date: moment().format('YYYY-MM-DD'),
                folio: 'PV'+moment().format('YYYYMMDDHHMMss'),
                total: dataPayment.options.totalProcedure,
                type: procedureType,
                from:'Sistema'
            },
            commissions: commissions,
            details: dataPayment.procedures.map((procedure:any)=>{
                let item = {
                    sales_concepts_id: procedure.concept,
                    amount: procedure.total,
                }

                return item;
            }),
            sale_process:{
                advance_payment: dataPayment.options.totalPerPay,
                payable: dataPayment.options.totalPay,
                contact: dataPayment.payment.contact
            },
            billing:{
                email: dataPayment.payment.client.email,
                names: dataPayment.payment.client.names,
                lastname1: dataPayment.payment.client.lastname1,
                lastname2: dataPayment.payment.client.lastname2,
                phone: dataPayment.payment.client.phone
            },
            payment:{
                method_payment: dataPayment.payment.method_payment,
                amount: dataPayment.options.totalPerPay,
                status:'Pagado',
                platform:'Sistema',
                receipt:dataPayment.payment.receipt,
                reference: dataPayment.payment.reference
            },
            clients: formData.map((data:any)=>{
                //obtener fecha de nacimiento para determinar si es menor o mayor de edad                    
                const age = calculateAge(data.client.birthdate);

                let optionType = '';

                Object.keys(data.options.renew).forEach((option:any)=>{
                    if(data.options.renew[option].value){
                        optionType = data.options.renew[option].title;
                    }
                })

                let item:any = {
                    client:{
                        names: data.client.names,
                        lastname1: data.client.lastname1,
                        lastname2: data.client.lastname2,
                        curp: data.client.curp,
                        birthdate: data.client.birthdate,
                        city: data.client.city,
                        country_birth_id: data.client.country,
                        state_birth_id: data.client.state,
                    },                    
                    phones:[
                        {number: data.client.phone, type:'Celular'}
                    ],
                    process:{
                        type:'Visa',
                        subtype: data.options.option.firstTime.value ? data.options.option.firstTime.title : data.options.option.renewal.title,
                        age_type: age >= 18 ? 'Mayor de edad' : 'Menor de edad',
                        option_type: optionType,
                        visa_type: data.options.type.work.value ? data.options.type.work.title : data.options.type.tourist.title,
                    },
                    passport:{
                        number: data.passport.passport_number,
                        expedition_date: data.passport.passport_expedition_date,
                        expiration_date: data.passport.passport_expiration_date
                    }
                }

                if(data.options.option.renewal.value){
                    item = {
                        ...item,
                        visa:{
                            number: data.visa.visa_number,
                            expedition_date: data.visa.visa_expedition_date,
                            expiration_date: data.visa.visa_expiration_date,
                            expedition_city: data.visa.visa_expedition_place
                        }
                    }
                }

                return item;
            })
        }

        let response = await visaSalesStore(obj);

        loader.current?.handleClose();
        
        if(response && response.success){
            Toast.fire('Correcto', response.message, 'success');
            navigate('/procedures/visa/list');
            return;
        }

        Toast.fire('Error', response.message, 'error');
    }
    

    return(
        <Content
            url="/procedures/visa/new"
            page="Visas"
            subpage="Nuevo"
            title="Nuevo trámite de visa"
            autoHeight
        >
        <>
            {showPayment ?
                <PaymentForm 
                    dataPayment={dataPayment}
                    setDataPayment={setDataPayment}
                    errorEmail={errorEmail}
                    errorPhone={errorPhone}
                    setErrorPhone={setErrorPhone}
                    formData={formData}
                    setErrorEmail={setErrorEmail}
                />
            :
                <ProcedureForm 
                    procedureType={procedureType}
                    setProcedureType={setProcedureType}
                    formData={formData}
                    setFormData={setFormData}
                    errorPhone={errorPhone}
                    setErrorPhone={setErrorPhone}
                    errors={errors}
                    setErrors={setErrors}
                />
            }
            

            <Grid fluid>
                <Divider className="mt-2" />
                <Row>
                    <Col xs={24}>
                        {showPayment ? 
                            <>
                                <Button onClick={()=>showPaymentForm(false)} customClass="me-2">Anterior</Button>
                                <Button color="red" customClass="me-2" onClick={handlePay}>Pagar</Button>
                            </>
                        :
                            <Button customClass="me-2" onClick={()=>showPaymentForm(true)}>Siguiente</Button>
                        }
                        
                        <Button appearance="default" onClick={()=>navigate('/procedures/visa/list')}>Cancelar</Button>
                    </Col>
                </Row>
            </Grid>
            
        </>
        </Content>
    )
}

export default VisasNew;