
import { useRef } from "react";
import AppRoutes from "./AppRoutes"
import { ILoader } from "./utils/interfaces/function";
import Loader from "./components/common/Loader";

const App = ()=>{
	const loader = useRef<ILoader>(null);

	return(
		<>
			<AppRoutes loader={loader} />
		
			<Loader ref={loader} />
		</>
	)
}

export default App;