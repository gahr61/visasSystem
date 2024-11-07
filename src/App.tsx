
import { useRef } from "react";
import AppRoutes from "./AppRoutes"
import { ILoader } from "./utils/interfaces/function";

const App = ()=>{
	const loader = useRef<ILoader>(null);

	return(
		<>
			<AppRoutes loader={loader} />
		
		</>
	)
}

export default App;