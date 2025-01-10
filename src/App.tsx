
import { useEffect, useRef } from "react";
import AppRoutes from "./AppRoutes"
import { ILoader, IModalResetPassword } from "./utils/interfaces/function";
import Loader from "./components/common/Loader";
import ModalResetPassword from "./components/ui/modals/ResetPassword";
import { appContext } from "./context/appContext";

const App = ()=>{
	const loader = useRef<ILoader>(null);
	const reset = useRef<IModalResetPassword>(null);

	const {resetPassword, setResetPassword} = appContext();

	useEffect(()=>{
		if(resetPassword === null && reset.current !== null){
			setResetPassword(reset.current);
		}
		
	},[reset]);

	return(
		<>
			<AppRoutes loader={loader} />
		
			<Loader ref={loader} />
			<ModalResetPassword ref={reset} loader={loader} />
		</>
	)
}

export default App;