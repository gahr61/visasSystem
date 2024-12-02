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
import UsersEdit from "./pages/config/employees/Edit";

/** PERMISSIONS */
import PermissionsList from "./pages/config/permissions/List";

/** ROLES */
import RolesList from "./pages/config/roles/List";

/** SYSTEM */
import SystemLayout from "./components/ui/config/system/Layout";

/** COMISSIONS */
import Commissions from "./pages/config/system/Commissions";

/** BRANCH OFFICE */
import BranchOffices from "./pages/config/system/BrancOffice";

const AppRoutes = (props:IApp)=>{
    return(
        <Routes>
            
            <Route path="/login" element={<Login {...props} />} />   

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/config">
                        <Route path="employees/list" element={<UsersList {...props} />} />
                        <Route path="employees/new" element={<UsersNew {...props} />} />
                        <Route path="employees/edit/:id" element={<UsersEdit {...props} />} />

                        <Route path="permissions/list" element={<PermissionsList />} />

                        <Route path="roles/list" element={<RolesList {...props} />} />

                        <Route element={<SystemLayout />}>
                            <Route path="commissions/list" element={<Commissions {...props} />} />

                            <Route path="branch_offices/list" element={<BranchOffices {...props} />} />
                        </Route>
                    </Route>
                </Route>
                

            </Route>    
        </Routes>
    )
}

export default AppRoutes;