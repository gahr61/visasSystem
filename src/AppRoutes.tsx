import { Route, Routes } from "react-router-dom";

import { IApp } from "./utils/interfaces/function";

import ProtectedRoute from "./ProtextedRoute";

import Layout from "./components/common/Layout";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";

/** CONFIG */
/** EMPLOYEES */
import UsersList from "./pages/config/employees/List";
import UsersNew from "./pages/config/employees/New";
import PermissionsList from "./pages/config/permissions/List";
import RolesList from "./pages/config/roles/List";

const AppRoutes = (props:IApp)=>{
    return(
        <Routes>
            
            <Route path="/login" element={<Login {...props} />} />   

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/config">
                        <Route path="employees/list" element={<UsersList />} />
                        <Route path="employees/new" element={<UsersNew />} />

                        <Route path="permissions/list" element={<PermissionsList />} />

                        <Route path="roles/list" element={<RolesList {...props} />} />
                    </Route>
                </Route>
                

            </Route>    
        </Routes>
    )
}

export default AppRoutes;