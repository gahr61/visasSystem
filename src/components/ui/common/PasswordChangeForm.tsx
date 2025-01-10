import { Col, Grid, Row } from "rsuite"
import Input from "../../common/Input"

const PasswordChangeForm = ({
    dataForm,
    setDataForm
}:{
    dataForm:any,
    setDataForm: (data: any) => void
})=>{

    const handleChange = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;

        setDataForm({
            ...dataForm,
            [name]: value
        });
    }

    return(
        <Grid fluid>
            <Row>
                <Col xs={24} >
                    <form className="reset-form">
                        <div className="grid gap-2">
                            <div>
                                <label>Contraseña</label>
                                <Input  
                                    type="password"
                                    id="password"
                                    value={dataForm.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirmar contraseña</label>
                                <Input  
                                    type="password"
                                    id="confirmPassword"
                                    value={dataForm.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </form>    
                </Col>
            </Row>
        </Grid>
    )
}

export default PasswordChangeForm;