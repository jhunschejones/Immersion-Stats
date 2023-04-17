import { useQuery } from "react-query";
import { fetchImmersion } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

const QUERY_CACHE_KEY = "immersion";

export const prefetchImmersion = (queryClient) => {
  queryClient.prefetchQuery(QUERY_CACHE_KEY, fetchImmersion);
};

export const ImmersionContext = createContext({
  ankiData: undefined,
  ankiIsLoading: true,
});

ImmersionProvider.propTypes = {
  children: PropTypes.element,
};

export default function ImmersionProvider({ children }) {
  const { data: immersionData, isLoading: immersionIsLoading } = useQuery({ queryKey: [QUERY_CACHE_KEY], queryFn: fetchImmersion });

  return (
    <ImmersionContext.Provider value={{immersionData, immersionIsLoading}}>
      {children}
    </ImmersionContext.Provider>
  );
}
