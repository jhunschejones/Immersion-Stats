import { useQuery } from "react-query";
import { fetchBunpro } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

const QUERY_CACHE_KEY = "bunpro";

export const prefetchBunpro = (queryClient) => {
  queryClient.prefetchQuery(QUERY_CACHE_KEY, fetchBunpro);
};

export const BunproContenxt = createContext({
  bunproData: undefined,
  bunproIsLoading: true,
});

BunproProvider.propTypes = {
  children: PropTypes.element,
};

export default function BunproProvider({ children }) {
  const { data: bunproData, isLoading: bunproIsLoading } = useQuery({ queryKey: [QUERY_CACHE_KEY], queryFn: fetchBunpro });

  return (
    <BunproContenxt.Provider value={{bunproData, bunproIsLoading}}>
      {children}
    </BunproContenxt.Provider>
  );
}
