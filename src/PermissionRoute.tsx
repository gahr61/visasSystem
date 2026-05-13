import { Navigate, Outlet } from "react-router-dom";
import { usePermissionsStore } from "./utils/stores/usePermissionsStore";

interface Props {
    permission: string;
}

const PermissionRoute = ({ permission }: Props) => {
    const hasPermission = usePermissionsStore(state => state.hasPermission);

    if (!hasPermission(permission)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PermissionRoute;
