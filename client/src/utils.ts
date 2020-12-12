export const getObjectWithoutNullProps = (object: any) => {
  const newObject: typeof object = {};
  for (let key in object) {
    if (object[key] !== null) {
      newObject[key] = object[key];
    }
  }
  return newObject;
}

interface ToString {
  toString: () => string
}

type ToStringProps = {
  [key: string]: ToString | null
}

export const buildQueryString = (params: ToStringProps): string => {
  const queryParams = new URLSearchParams();
  const newParams = getObjectWithoutNullProps(params);
  for (let key in newParams) {
    // @ts-ignore
    queryParams.append(key, newParams[key].toString());
  }
  return "?" + queryParams.toString();
}