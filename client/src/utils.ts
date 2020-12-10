export const getObjectWithoutNullProps = (object: any) => {
  const newObject: typeof object = {};
  for (let key in object) {
    if (key !== null) {
      newObject[key] = object[key];
    }
  }
  return newObject;
}