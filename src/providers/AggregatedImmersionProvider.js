import { useQuery } from "react-query";
import { fetchAggregatedImmersion } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

const QUERY_CACHE_KEY = "aggregated-immersion";

export const prefetchAggregatedImmersion = (queryClient) => {
  queryClient.prefetchQuery(QUERY_CACHE_KEY, fetchAggregatedImmersion);
};

export const AggregatedImmersionContext = createContext({
  aggregatedImmersionData: undefined,
  aggregatedImmersionIsLoading: true,
});

AggregatedImmersionProvider.propTypes = {
  children: PropTypes.element,
};

export default function AggregatedImmersionProvider({ children }) {
  const { data: aggregatedImmersionData, isLoading: aggregatedImmersionIsLoading } = useQuery({ queryKey: [QUERY_CACHE_KEY], queryFn: fetchAggregatedImmersion });

  return (
    <AggregatedImmersionContext.Provider value={{aggregatedImmersionData, aggregatedImmersionIsLoading}}>
      {children}
    </AggregatedImmersionContext.Provider>
  );
}
