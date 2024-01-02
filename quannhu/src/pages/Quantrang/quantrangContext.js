import { useState } from "react";
import { createContext } from "react";

const QuantrangContext = createContext()

function QuantrangProvider({children}) {
    const [state, setState] = useState()
    return <QuantrangContext.Provider value={[state, setState]}>
        {children}
    </QuantrangContext.Provider>
}
export {QuantrangContext}
export default QuantrangProvider;