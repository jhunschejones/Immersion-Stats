import { useQuery } from "react-query";
import { fetchJpdb } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

const QUERY_CACHE_KEY = "jpdb";

export const prefetchJpdb = (queryClient) => {
  queryClient.prefetchQuery(QUERY_CACHE_KEY, fetchJpdb);
};

export const JpdbContext = createContext({
  jpdbData: undefined,
  jpdbIsLoading: true,
});

JpdbProvider.propTypes = {
  children: PropTypes.element,
};

export default function JpdbProvider({ children }) {
  const { data: jpdbData, isLoading: jpdbIsLoading } = useQuery({ queryKey: [QUERY_CACHE_KEY], queryFn: fetchJpdb });

  return (
    <JpdbContext.Provider value={{jpdbData, jpdbIsLoading}}>
      {children}
    </JpdbContext.Provider>
  );
}
