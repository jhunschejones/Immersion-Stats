import { useQuery } from "react-query";
import { fetchJpdb } from "../utils/csv-fetching";
import { createContext } from "react";
import PropTypes from "prop-types";

export const JpdbContext = createContext({
  jpdbData: undefined,
  jpdbIsLoading: true,
});

JpdbProvider.propTypes = {
  children: PropTypes.element,
};

export default function JpdbProvider({ children }) {
  const { data: jpdbData, isLoading: jpdbIsLoading } = useQuery({ queryKey: ["jpdb"], queryFn: fetchJpdb });

  return (
    <JpdbContext.Provider value={{jpdbData, jpdbIsLoading}}>
      {children}
    </JpdbContext.Provider>
  );
}
