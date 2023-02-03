/**
 * retrieves nested values from an object
 * @param {array} path - an array of strings specifying the path
 * @param {object} object - the object to retrieve the data from
 */
export const dig = (path, object) => {
  return path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object);
};
