import { useEffect, useState } from "react";
import { Col, Divider } from "rsuite";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import Select from '../../common/Select';
import Input from "../../common/Input";
import Button from "../../common/Button";
import Table from "../../common/Table";
import ButtonTable from "../../common/ButtonTable";

import { commissionsList } from "../../../utils/services/commisions";
import { Column} from "../../../utils/interfaces/system";
import { Employee, EmployeeCommission } from "../../../utils/interfaces/employee";
import Toast from "../../common/Toast";
import { formatPrice, isValidForm } from "../../../utils/functions";

type CommissionsSelect = {
    value: string | number,
    label: string
}

type EmployeeList = {
    id: number,
    name: string,
    commissions: EmployeeCommission[]
}


const CommissionsForm = ({
    employee,
    setEmployee
}:{
    employee: Employee | EmployeeList,
    setEmployee: (e: any)=>void
})=>{

    const columns:Column[]= [
        {key:'name', title:'Concepto', grow:2, render:(row: EmployeeCommission)=>row.concept},
        {key:'amount', title:'Comisión', grow:1, render:(row: EmployeeCommission)=>formatPrice(row.amount)},
        {key:'', title:'Acciones', grow:1, render:(row: EmployeeCommission)=>
            <div className="flex gap-2">
                <ButtonTable 
                    title="Eliminar"
                    controlId="delete"
                    icon={<FaTrashAlt />}
                    onClick={()=>onDeleteCommission(row)}
                />
            </div>
        },
    ]

    const [commissions, setCommissions] = useState<CommissionsSelect[]>([]);
    const [option, setOption] = useState<string>('new');
    const [commissionSelected, setCommissionSelected] = useState<string | number | null>('');
    const [commission, setCommission] = useState<EmployeeCommission>({
        id:null,
        concept:'',
        amount: 0
    })

    const getCommissions = async ()=>{
        let response = await commissionsList();
        if(response){
            if(response.success){
                if(response.data){
                    let items = response.data.map((data)=>{
                        let item  = {
                            value: data.id || '',
                            label: data.concept || '',
                        }
    
                        return item;
                    });

                    setCommissions(items);
                }
                
                return;
            }

            Toast.fire('Error', response.message, 'error');
        }
    }

    const onChangeOption = (e: any)=>{
        e.preventDefault();

        setCommissionSelected('');
        setCommission({concept:'', amount:0});
        setOption(option === 'new' ? 'select' : 'new')
    }

    const handleChangeCommission = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;

        setCommission({
            ...commission,
            [name]: value
        });
    }

    const onAddNewCommission = ()=>{
        if(!isValidForm('div.commissions-form')){
            Toast.fire('Error', 'Incomplete fields', 'error');

            return;
        }

        let list = employee.commissions;

        let exist = list.findIndex(obj => obj.concept === commission.concept);
        
        if(option === 'new'){
            exist = list.findIndex(obj => obj.id === commissionSelected);
        }

        if(exist !== -1){
            Toast.fire('Error', 'La comisión ya se agrego al listado.', 'error');
            return;
        }

        if(list){
            const item = commissions.find(obj => obj.value === commissionSelected);

            list.push({
                id: option === 'new' ? commissionSelected : null,
                concept: option === 'new' ? item?.label || '' : commission.concept,
                amount: commission.amount
            });
            
            setEmployee({
                ...employee, 
                commissions: list,
            });
        }

        setCommission({id:'',concept:'', amount:0});
        setCommissionSelected('');
        
    }

    const onDeleteCommission = (row: EmployeeCommission)=>{
        let list = employee.commissions;

        let index = list.findIndex(obj => obj.id === row.id && obj.concept === row.concept);

        list.splice(index, 1);

        setEmployee({
            ...employee,
            commissions: list
        });
    }

    useEffect(()=>{
        getCommissions();
    },[]);

    return(
        <fieldset>
            <legend className="text-lg font-semibold py-2">Comisiones</legend>
            <div className="flex items-end">
                <Col xs={14} className="commissions-form">
                    <Col xs={18}>
                        <label>Concepto</label>
                        {option === 'new' ?
                            <Select
                                id="commissions"
                                value={commissionSelected || ''}
                                options={commissions}
                                handleChange={(e: string | number | null)=>setCommissionSelected(e)}
                                required
                            />
                        :
                            <Input 
                                id="concept"
                                value={commission.concept}
                                onChange={handleChangeCommission}
                                required
                            />
                        }
                        
                    </Col>
                    <Col xs={6}>
                        <label>Comisión</label>
                        <Input 
                            id="amount"
                            value={commission.amount}
                            onChange={handleChangeCommission}
                            required
                        />
                    </Col>
                    
                </Col>
                <Col xs={10} className="flex flex-row gap-2">
                    <Button onClick={onAddNewCommission}>
                        <FaPlus />
                    </Button>
                    <Link to="" onClick={onChangeOption}>
                        {option === 'new' ? 'Nueva comisión': 'Seleccionar comisión'}
                    </Link>
                </Col> 
            </div>
            <Divider className="my-2" />
            <Col xs={24}>
                <Table 
                    columns={columns}
                    data={employee.commissions || []}
                    autoHeight
                />
            </Col>
        </fieldset>
    )
}

export default CommissionsForm;