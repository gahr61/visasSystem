import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import { IApp } from "./utils/interfaces/function";
import ProtectedRoute from "./ProtextedRoute";
import Layout from "./components/common/Layout";

const AppRoutes = (props:IApp)=>{
    return(
        <Routes>

            <Route path="/login" element={<Login {...props} />} />   

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                

            </Route>    
        </Routes>
    )
}

export default AppRoutes;