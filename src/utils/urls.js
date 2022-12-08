/** the getter on react-dom's `useSearchParams` hook doesn't work with the hash
 * router, so use this function instead to read search params from the URL
*/
export const getSearchParams = () => {
  const cleanLocationString = window.location
    .toString()
    .replace("/#/", "/")
    .replace(`${window.location.pathname}#/`, `${window.location.pathname}/`);
  return new URL(cleanLocationString).searchParams;
};
