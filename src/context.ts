import React, { useContext } from "react";
import { KingSongProtocol } from "./ks/service";

const BLEContext = React.createContext<KingSongProtocol | null>(null);

export const useBLE = () => useContext(BLEContext);

export const BLEContextProvider = BLEContext.Provider;
