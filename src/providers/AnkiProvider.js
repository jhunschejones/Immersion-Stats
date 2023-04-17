import { useQuery } from "react-query";
import { fetchAnki } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

const QUERY_CACHE_KEY = "anki";

export const prefetchAnki = (queryClient) => {
  queryClient.prefetchQuery(QUERY_CACHE_KEY, fetchAnki);
};

export const AnkiContext = createContext({
  ankiData: undefined,
  ankiIsLoading: true,
});

AnkiProvider.propTypes = {
  children: PropTypes.element,
};

export default function AnkiProvider({ children }) {
  const { data: ankiData, isLoading: ankiIsLoading } = useQuery({ queryKey: [QUERY_CACHE_KEY], queryFn: fetchAnki });

  return (
    <AnkiContext.Provider value={{ankiData, ankiIsLoading}}>
      {children}
    </AnkiContext.Provider>
  );
}
