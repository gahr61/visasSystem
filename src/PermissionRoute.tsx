import { Navigate, Outlet } from "react-router-dom";
import { usePermissionsStore } from "./utils/stores/usePermissionsStore";
import { useUserStore } from "./utils/stores/useUserStore";

const CLIENT_HOME = "/procedures/visa/client/list";

interface Props {
    /** permiso requerido para empleados */
    permission?: string;
    /** el rol `cliente` también puede entrar (la pertenencia la valida el API) */
    allowClient?: boolean;
    /** solo el rol `cliente` puede entrar */
    clientOnly?: boolean;
}

/**
 * - Rol `cliente`: solo entra a rutas marcadas con `allowClient` o `clientOnly`;
 *   cualquier otra lo regresa a su listado de trámites.
 * - Empleados: necesitan `permission` y no entran a rutas `clientOnly`.
 */
const PermissionRoute = ({ permission, allowClient = false, clientOnly = false }: Props) => {
    const hasPermission = usePermissionsStore(state => state.hasPermission);
    const role = useUserStore(state => state.user.role);

    if (role === 'cliente') {
        return (allowClient || clientOnly) ? <Outlet /> : <Navigate to={CLIENT_HOME} replace />;
    }

    if (clientOnly || (permission && !hasPermission(permission))) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PermissionRoute;
