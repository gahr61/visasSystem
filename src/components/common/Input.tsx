import { InputHTMLAttributes, useState } from "react";
import { isEmail, isPhone, showCtrError } from "../../utils/functions";


interface IInput extends InputHTMLAttributes<HTMLInputElement>{
    setErrorEmail?: (e: any)=>void;
    customClass?:string;
    isFocused?:boolean;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>)=>void;
}

const Input = (props:IInput)=>{
    const { 
        id, 
        name,
        onChange, 
        type = 'text', 
        setErrorEmail,
        disabled = false,
        required = false,
        customClass = '',
        placeholder = '',
        onKeyPress = ()=>{},
        value = '',
        maxLength,
        isFocused = false,
        onFocus = ()=>{},
        onBlur = ()=>{}
    } = props;

    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        let {id, name, value} = e.target;

         // if tyoe is tel, we apply number mask
        if (type === 'tel') {
            value = isPhone(value);
        }

        if(type === 'email'){
            if(setErrorEmail){
                if(!isEmail(value) && value !== ''){
                    setErrorEmail('Correo no valido');
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
            onChange({ ...e, currentTarget: { ...e.currentTarget, value, name } });
        }
    }

    const handleInputChange = (e:any)=>{
        setInputValue(e.currentTarget.value);
    }

    const handleBlur = (e:any)=>{
        onBlur(e);

        handleChange(e);
    }

    return(
        <input 
            type={type}
            id={id}
            name={name || id}
            value={isFocused ? inputValue : value}
            className={`
                ${customClass}                
                py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem]
                focus:border-blue-500 focus:ring-blue-500
                disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-no-drop
            `}
            onChange={isFocused  ? handleInputChange : handleChange}
            onKeyDown={onKeyPress}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete="off"
            maxLength={maxLength}
            onFocus={onFocus}
            onBlur={(e)=>handleBlur(e)}
        />
    )
}

export default Input;