import { useEffect, useRef, useState } from "react"
import { AsyncTypeahead } from "react-bootstrap-typeahead"

import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../../assets/css/autocomplete.css';

import { Col, Grid, Loader, Row } from "rsuite";

const Autocomplete = ({
    id = 'autocomplete',
    options,
    value = 0,
    placeholder = '',
    onSearch = ()=>{},
    onSelect = () => {}
}:{
    id:string;
    options:any[],
    value: any,
    placeholder?: string;
    onSearch?:(value:string)=>void;
    onSelect?:(value:number) => void;
})=>{
    const typeaheadRef = useRef<any>(null);

    const [showLoading, setShowLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSearch = async (query:string) => {
        setOpen(true);
        setShowLoading(true);

        await onSearch(query);

        setShowLoading(false);
    }

    const handleSelect = (value:number)=>{
        onSelect(value);
        setOpen(false);
    }

    useEffect(()=>{
        setTimeout(()=>{
            setShowLoading(false);
        }, 1500);

        const handleCloseOutside = ()=>{
            setTimeout(()=>{
                setOpen(false);
                setShowLoading(false);

                //typeaheadRef.current?.clear();
            }, 500);
        }

        document.addEventListener('mousedown', handleCloseOutside);
        
    },[options]);

    console.log(options)

    return(
        <>
            <AsyncTypeahead 
                id={id}
                ref={typeaheadRef}
                inputProps={{
                    className: `py-1 px-2 block w-full border outline-0 rounded-lg text-sm 
                        focus:border-blue-500 focus:ring-blue-500
                        disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-no-drop`
                }}
                labelKey={'label'}
                onChange={() => setOpen(true)}
                options={options}
                onSearch={(value) => handleSearch(value)}
                selected={value === 0 ? [] : [options.find(obj => obj.id === value)]} 
                isLoading={false}
                placeholder={placeholder}     
                delay={500}
                open={open}
                renderMenu={()=>
                    <div className="w-full shadow-md border border-gray-100 rounded-md p-1 !bg-white absolute z-10">
                        {options.length === 0 ?
                            <div className="p-3 flex justify-center items-center m-2">
                                {showLoading ?
                                    <Loader />
                                :
                                    <span>No se encontraron resultados</span>
                                }
                            </div>
                        : 
                            <Grid fluid className="relative">
                                <Row className="w-full">
                                    {options.map((option)=>
                                        <Col
                                            xs={24}
                                            key={option.id}
                                            className="mb-1 hover:bg-gray-100 p-1 hover:underline cursor-pointer"
                                            onClick={()=>handleSelect(option.id)}
                                        >
                                            {option.label}
                                        </Col>
                                    )}
                                </Row>
                            </Grid>
                        }
                    </div>
                }
            />
        </>
    )
}

export default Autocomplete;