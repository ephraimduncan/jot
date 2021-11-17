export function truncate(string, maxlength) {
  const noNewLineString =
    string.length > maxlength
      ? string.slice(0, maxlength).trim() + "..."
      : string;

  const newLineString = string.split("\n")[0];

  return string.includes("\n") ? newLineString : noNewLineString;
}

export function pushToArray(arr, obj) {
  const array = arr || [];
  const index = array.findIndex((e) => {
    return e.id === obj.id;
  });

  if (index === -1) {
    array.push(obj);
  } else {
    array[index] = obj;
  }
  return array;
}

export function removeFromArray(arr, id) {
  return arr.filter((e) => e.id !== id);
}
