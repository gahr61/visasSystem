import { ButtonHTMLAttributes, ReactElement, useRef } from "react";
import { Dropdown, IconButton, Popover, Tooltip, Whisper } from "rsuite"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
    placement?: 'top' | 'bottom' | 'bottomStart' | 'bottomEnd',
    controlId: string,
    title: string,
    size?: 'lg' | 'md' | 'sm' | 'xs',
    appearance?: 'default' | 'primary' | 'ghost',
    customClass?: string,
    icon: ReactElement,
    onClick?: (e: any)=>void,
    options?: any[],
    onSelect?: (e:any) => void
}

const ButtonTable = ({
    placement = 'top',
    controlId,
    title,
    size = 'sm',
    appearance = 'ghost',
    customClass = '',
    onClick = ()=>{},
    icon,
    options = [],
    onSelect = ()=>{}
}: Props)=>{
    const ref = useRef<any>(null);
    return(
        <Whisper 
            placement={placement} 
            controlId={controlId} 
            trigger={options.length === 0 ? 'hover' : 'click'}
            ref={ref}
            speaker={
                options.length === 0 ? 
                    <Tooltip>{title}</Tooltip>
                : 
                    <Popover>
                        <Dropdown.Menu onSelect={(e)=>{
                            onSelect(e);
                            ref.current?.close();
                        }}>
                            {options.map((option, index)=>
                                <Dropdown.Item key={index} eventKey={option.key}>{option.label}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Popover>
            }
        >
                <IconButton 
                    circle
                    size={size}
                    appearance={appearance}
                    className={customClass}
                    icon={icon}
                    title={options.length > 0 ? title : ''}
                    onClick={onClick}
                />
            
        </Whisper>
    )
}

export default ButtonTable;