import { Grid } from "rsuite";
import { useUserStore } from "../utils/stores/useUserStore";
import { Navigate } from "react-router-dom";

const Home = ()=>{
    const userData = useUserStore(store => store.user);
    
    if(userData.role === 'cliente'){
        <Navigate to="/procedure/visa/client/list" replace />
    }

    return(
        <Grid fluid>
            <h1>Dashboard</h1>
        </Grid>
    )
}

export default Home;