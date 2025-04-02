import { useEffect, useState } from "react"
import { Typeahead } from "react-bootstrap-typeahead"

import 'react-bootstrap-typeahead/css/Typeahead.css';

const Autocomplete = ({
    options,
    value
}:{
    options:any[],
    value: any
})=>{
    const [data, setData] = useState<any[]>([]);

    useEffect(()=>{
        let items = options.map((option, index)=>{
            let item = {
                ...option.client,
                id: index + 1
            }

            return item;
        });

        console.log(items)
        setData(items)
    },[]);

    return(
        <>
            <Typeahead inputProps={{
                className:`py-1 px-2 block w-full border outline-0 rounded-lg text-sm 
                        focus:border-blue-500 focus:ring-blue-500
                        disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-no-drop`
            }}
                labelKey={'name'}
                onChange={(selected) => console.log(selected)}
                options={[{id:'1', name:'1'}]}
                selected={value}
            />
        </>
    )
}

export default Autocomplete;