import React, { useState } from "react";
import { IApp } from "../../../../utils/interfaces/function";
import PersonalData from "./PersonalData";
import ContactInfo from "./ContactInfo";
import FamiliarInfo from "./FamiliarInfo";
import JobInfo from "./JobInfo";
import TravelInfo from "./TravelInfo";
import { ButtonGroup, Col, Grid, Row, Steps } from "rsuite";
import Button from "../../../common/Button";

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
                [name]: typeof value === 'object' ? value : value.toUpperCase()
            }
        };


        updateClient(data, index);

        console.log(name, value, form)
    }

    const changeToNextStep = ()=>{
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
        //
    };

    const steps = [
        {component:<PersonalData personalInfo={client.personalInformation} handleChange={(e:React.FormEvent<HTMLInputElement>)=>handleChange(e, 'personalInformation')}   />},
        {component:<ContactInfo />},
        {component:<FamiliarInfo />},
        {component:<JobInfo />},
        {component:<TravelInfo />},
    ];

    return(
        <Grid fluid >
            <Row className="relative h-full" >
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
                            <Button appearance="default">Cancelar</Button>
                            {currentStep > 0 && (
                                <Button appearance="ghost" onClick={changeToPrevStep}>Atras</Button>
                            )}
                            
                            {currentStep < steps.length - 1 && (
                                <Button appearance="ghost" onClick={changeToNextStep}>Siguiente</Button>
                            )}
                            
                            {currentStep === steps.length - 1 && (
                                <Button color="red">Finalizar</Button>
                            )}
                        </ButtonGroup>
                        
                        
                    </div>
                </Col>

                
            </Row>
        </Grid>
    )
}

export default DetailsForm;