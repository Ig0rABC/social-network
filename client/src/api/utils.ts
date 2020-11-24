interface ToString {
  toString: () => string
}

type ToStringProps = {
  [key: string]: ToString | null
}

export const buildQueryString = (params: ToStringProps): string => {
  const queryParams = new URLSearchParams();
  for (let key in params) {
    if (key !== null) {
      // @ts-ignore
      queryParams.append(key, params[key].toString());
    }
  }
  return "?" + queryParams.toString();
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}