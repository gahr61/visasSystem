import { ButtonHTMLAttributes, ReactElement } from "react";
import { IconButton, Tooltip, Whisper } from "rsuite"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
    placement?: 'top' | 'bottom',
    controlId: string,
    title: string,
    size?: 'lg' | 'md' | 'sm' | 'xs',
    appearance?: 'default' | 'primary' | 'ghost',
    customClass?: string,
    icon: ReactElement,
    onClick: (e: any)=>void
}
const ButtonTable = ({
    placement = 'top',
    controlId,
    title,
    size = 'sm',
    appearance = 'ghost',
    customClass = '',
    onClick,
    icon,
}: Props)=>{
    return(
        <Whisper placement={placement} controlId={controlId} speaker={
            <Tooltip>{title}</Tooltip>
        }>
            <IconButton 
                circle
                size={size}
                appearance={appearance}
                className={customClass}
                icon={icon}
                onClick={onClick}
            />
        </Whisper>
    )
}

export default ButtonTable;