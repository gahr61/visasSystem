import React, { useState } from "react";
import { IApp } from "../../../../utils/interfaces/function";
import PersonalData from "./PersonalData";
import ContactInfo from "./ContactInfo";
import FamiliarInfo from "./FamiliarInfo";
import JobInfo from "./JobInfo";
import TravelInfo from "./TravelInfo";
import { ButtonGroup, Col, Grid, Row, Steps } from "rsuite";
import Button from "../../../common/Button";
import { isValidForm } from "../../../../utils/functions";
import Toast from "../../../common/Toast";

interface Props extends IApp{
    client: any,
    updateClient: (data:any, index:number)=>void,
    index: number
}
const DetailsForm = ({client, updateClient, index}: Props)=>{
    const [currentStep, setCurrentStep] = useState(0);

    const handleChange = (e: React.FormEvent<HTMLInputElement>, form:string)=>{
        const {name, value} = e.currentTarget;

        const data = {
            ...client, 
            [form]:{
                ...client[form],
                [name]: typeof value === 'object' ? value : typeof value === 'number' ? value : value.toUpperCase()
            }
        };


        updateClient(data, index);
    }

    const changeToNextStep = async ()=>{
        let valid:boolean | undefined = true;
        if(currentStep === 0){
            valid = await updatePersonalInfo();

            if(!valid){
                return;
            }
        }

        if(currentStep === 1){
            valid = await updateContactInfo();

            if(!valid){
                return;
            }
        }

        if(currentStep === 3){
            valid = await updateJobsSchools();

            if(!valid){
                return;
            }
        }

        if(currentStep === 4){

        }

        if(currentStep < steps.length - 1){
            setCurrentStep(currentStep+1);
        }
    }

    const changeToPrevStep = ()=>{
        if(currentStep > 0){
            setCurrentStep(currentStep-1);
        }
    }

    const updatePersonalInfo = async ()=>{
        let valid = true;
        if(!isValidForm('div.personal-form')){
            Toast.fire('Error', 'Campos requeridos', 'error');
            valid = false;
           
        }

        return valid;
    };

    const updateContactInfo = async ()=>{
        if(!isValidForm('div.address-form')){
            Toast.fire('Error', 'Campose requeridos', 'error');
            return false;
        }

        return true;

    }

    const updateJobsSchools = async ()=>{
        if(!isValidForm('div.jbb-form')){
            Toast.fire('Error', 'Campos incompletos', 'error');
            return false;
        }

        return true;
    }

    

    const steps = [
        {component:<PersonalData personalInfo={client.personalInformation} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'personalInformation')}   />},
        {component:<ContactInfo contactInfo={client.contactInformation} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'contactInformation')}/>},
        {component:<FamiliarInfo familiarInfo={client.familiarInformation} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'familiarInformation')} />},
        {component:<JobInfo jobsSchools={client.jobsSchools} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'jobsSchools')} />},
        {component:<TravelInfo generalInfo={client.generalInformation} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'generalInformation')} />},
    ];

    return(
        <Grid fluid >
            <Row className="relative h-full forms" >
                <Col xs={24} lg={4} className="h-full">
                    <Steps current={currentStep} vertical small>
                        <Steps.Item title="Datos personales" />
                        <Steps.Item title="Información de contacto" />
                        <Steps.Item title="Información familiar" />
                        <Steps.Item title="Información laboral y académica" />
                        <Steps.Item title="Información de estancia" />
                    </Steps>
                </Col>
                <Col xs={24} lg={20} className="h-full border-s-2">
                    <div className="h-full p-2">
                        {steps[currentStep].component}
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                        <ButtonGroup>
                            
                            {currentStep > 0 && (
                                <Button appearance="ghost" onClick={changeToPrevStep}>Atras</Button>
                            )}
                            
                            {currentStep < steps.length - 1 && (
                                <Button appearance="ghost" onClick={changeToNextStep}>Siguiente</Button>
                            )}
                            
                            {/*currentStep === steps.length - 1 && (
                                <Button color="red">Finalizar</Button>
                            )*/}
                        </ButtonGroup>
                        
                        
                    </div>
                </Col>

                
            </Row>
        </Grid>
    )
}

export default DetailsForm;