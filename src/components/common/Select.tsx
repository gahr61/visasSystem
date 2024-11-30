import Select from 'react-select';
import { addErrorToSelectedField } from "../../utils/functions";

const customStyles = {
    container:  (provided: any) => ({
        ...provided,
        padding: '0',
        border: '0',
        fontSize: '0.85rem',
    }),
    control:  (provided:any, state:any) => ({
        ...provided,
        height: 'calc(1.5em + 0.5rem + 2.6px)',
        minHeight: 'calc(1.5em + 0.5rem + 2.5px)',
        fontSize: '0.75rem',
        borderColor: '#d8dbe0',
        boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        ':hover': {
            borderColor: state.isFocused ? '#66afe9' : '#d8dbe0',
            boxShadow: state.isFocused ? 
            'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)' : 
            'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
        }
    }),
    valueContainer: (provided:any) => ({
        ...provided,
        marginTop: '0',
        marginLeft: '6px',
        padding: '0',
        border: '0',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        marginTop: '0',
        padding: '0',
        border: '0',
        width: '16px',
    }),
    clearIndicator: (provided:any) => ({
        ...provided,
        marginTop: '0',
        padding: '0',
        border: '0',
        width: '16px',
    }),
    indicatorsContainer: (provided:any) => ({
        ...provided,
        paddingRight: '4px',
        border: '0',
    }),
    menu:(provided:any)=>({
        ...provided,
        zIndex:999
    })
}

export interface ISelectOptions {
    value: string | number;
    label: string;
}

interface Props {
    value: string | number | null,
    handleChange: (e: any) => void,
    required?: boolean,
    disabled?: boolean,
    id: string,
    options: ISelectOptions[],
    multiple?: boolean
}

const SelectForm = ({
    value = null,
    handleChange = ()=>{},
    required = false,
    disabled = false,
    id = '',
    options = [],
    multiple = false
}: Props)=>{

    const onChangeValue = (e: ISelectOptions)=>{
        handleChange(e === null ? '' : e.value);

        let value = e === null ? '' : e.value
        if(value !== ''){
            addErrorToSelectedField(id, value);
        }
    }

    return (
        <Select    
            styles={customStyles} 
            id={id}
            name={id}
            inputId={'select_'+id}
            options={options}
            required={required}
            isDisabled={disabled}
            isMulti={multiple}
            value={value === null || value === ''? '' : options.find(obj => obj.value.toString() === value.toString())}
            placeholder="Select..."
            isClearable={true}
            onChange={(e: any)=>onChangeValue(e)}
        />
    )
}

export default SelectForm;

