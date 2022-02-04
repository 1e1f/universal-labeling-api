const { getKeyPaths } = require("./functions/keypath");

const isFlatCompatible = (obj) => {
  const columnHeaders = getKeyPaths(obj);
  return columnHeaders;
};

export default function (targetVal) {
  try {
    console.log("is flat-compatible?", targetVal);
    const headers = isFlatCompatible(targetVal);
    console.log(headers);
  } catch (e) {
    return [e];
  }
}
