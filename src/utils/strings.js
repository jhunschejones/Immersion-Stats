export const titleCase = (string) => {
  let splitStringArray = string.toLowerCase().split(" ");
  for (let i = 0; i < splitStringArray.length; i++) {
    splitStringArray[i] = splitStringArray[i].charAt(0).toUpperCase() + splitStringArray[i].slice(1);
  }
  return splitStringArray.join(" ");
}
