import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "./utils/functions";

const ProtectedRoute = ()=>{
    var auth = isAuth();

    if(!auth){
        return <Navigate to="login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;