import { createContext } from "react";
import PropTypes from "prop-types";

TotalsProvider.propTypes = {
  children: PropTypes.children,
};

export const TotalsContext = createContext([]);
TotalsContext.displayName = "TotalsContext";

export default function TotalsProvider({children}) {
  const newValue = ["something's in here"];
  return (
    <TotalsContext.Provider value={newValue}>
      {children}
    </TotalsContext.Provider>
  );
}
