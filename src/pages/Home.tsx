import { useEffect } from "react";
import { Grid } from "rsuite";
import { useAddressStore } from "../utils/stores/useAddressStore";
import { getCountries } from "../utils/services/countries";

const Home = ()=>{
    const countries = useAddressStore(state => state.countries);
    const updateCountries = useAddressStore(state => state.setCountries);

    const onLoad = async ()=>{
        const response = await getCountries();

        if(response && response.success){
            updateCountries(response.data);
        }
    }

    useEffect(()=>{
        if(countries.length === 0){
            onLoad();
        }
    },[]);


    return(
        <Grid fluid>
            <h1>Dashboard</h1>
        </Grid>
    )
}

export default Home;