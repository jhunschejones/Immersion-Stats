import { useQuery } from "react-query";
import { fetchAnki } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

export const AnkiContext = createContext({
  ankiData: undefined,
  ankiIsLoading: true,
});

AnkiProvider.propTypes = {
  children: PropTypes.element,
};

export default function AnkiProvider({ children }) {
  const { data: ankiData, isLoading: ankiIsLoading } = useQuery({ queryKey: ["anki"], queryFn: fetchAnki });

  return (
    <AnkiContext.Provider value={{ankiData, ankiIsLoading}}>
      {children}
    </AnkiContext.Provider>
  );
}
