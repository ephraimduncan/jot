export function truncate(string, maxlength) {
  const str = string.replace(/(?:\r\n|\r|\n)/g, " ");
  return str.length > maxlength ? str.slice(0, maxlength).trim() + "..." : str;
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
