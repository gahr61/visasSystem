import { ReactElement } from "react";
import {Button as Btn} from 'rsuite';

interface IButton {
    appearance?: 'default' | 'primary' | 'subtle' | 'ghost',
    customClass?: string,
    size?: 'lg' | 'md' | 'sm' | 'xs',
    color?: 'red' | 'blue',
    disabled?: boolean,
    children: ReactElement | string
    onClick?: (e:any)=>void
}

const Button = (props: IButton)=>{
    const {
        appearance = 'primary',
        customClass = '',
        children,
        disabled = false,
        size = 'sm',
        color="blue",
        onClick
    } = props;

    return(
        <Btn
            appearance={appearance}
            size={size}
            className={`${customClass}`}
            disabled={disabled}
            color={color}
            onClick={onClick}
        >
            {children}
        </Btn>
    )
}

export default Button;