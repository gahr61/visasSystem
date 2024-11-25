import { InputHTMLAttributes } from "react";
import { isEmail, isPhone, showCtrError } from "../../utils/functions";


interface IInput extends InputHTMLAttributes<HTMLInputElement>{
    setErrorEmail?: (e: any)=>void,
    customClass?:string,
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>)=>void
}

const Input = (props:IInput)=>{
    const { 
        id, 
        onChange, 
        type = 'text', 
        setErrorEmail,
        disabled = false,
        required = false,
        customClass = '',
        placeholder = '',
        onKeyPress = ()=>{},
        value = ''
    } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        let {id, value} = e.target;

         // if tyoe is tel, we apply number mask
        if (type === 'tel') {
            value = isPhone(value);
        }

        if(type === 'email'){
            if(setErrorEmail){
                if(!isEmail(value) && value !== ''){
                    setErrorEmail('Correo electrónico no valido');
                }else{
                    setErrorEmail('');
                }
            }            
        }

        if(value !== ''){
            showCtrError(id, value);
        }

         // call onChange function (if exist)
         if (onChange) {
            onChange({ ...e, currentTarget: { ...e.currentTarget, value, name:id } });
        }

    }



    return(
        <input 
            type={type}
            id={id}
            name={id}
            value={value}
            className={`
                ${customClass}
                py-1 px-2 block w-full border outline-0 rounded-lg text-sm 
                focus:border-blue-500 focus:ring-blue-500
                disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-no-drop
            `}
            onChange={handleChange}
            onKeyDown={onKeyPress}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete="off"
        />
    )
}

export default Input;