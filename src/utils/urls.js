/** the getter on react-dom's `useSearchParams` hook doesn't work with the hash
 * router, so use this function instead to read search params from the URL
*/
export const getSearchParams = () => {
  return new URL(window.location.toString().replace("/#/", "/")).searchParams;
}
