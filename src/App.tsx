
import { useEffect, useRef } from "react";
import AppRoutes from "./AppRoutes"
import { ILoader, IModalResetPassword } from "./utils/interfaces/function";
import Loader from "./components/common/Loader";
import ModalResetPassword from "./components/ui/modals/ResetPassword";
import { appContext } from "./context/appContext";
import { useAddressStore } from "./utils/stores/useAddressStore";
import { getCountries } from "./utils/services/countries";

const App = ()=>{
	const loader = useRef<ILoader>(null);
	const reset = useRef<IModalResetPassword>(null);

	const {resetPassword, setResetPassword} = appContext();

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