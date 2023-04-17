import { useQuery } from "react-query";
import { fetchBunpro } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

export const BunproContenxt = createContext({
  bunproData: undefined,
  bunproIsLoading: true,
});

BunproProvider.propTypes = {
  children: PropTypes.element,
};

export default function BunproProvider({ children }) {
  const { data: bunproData, isLoading: bunproIsLoading } = useQuery({ queryKey: ["bunpro"], queryFn: fetchBunpro });

  return (
    <BunproContenxt.Provider value={{bunproData, bunproIsLoading}}>
      {children}
    </BunproContenxt.Provider>
  );
}
