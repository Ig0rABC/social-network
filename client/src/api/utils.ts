interface ToString {
  toString: () => string
}

type ToStringProps = {
  [key: string]: ToString | null
}

export const buildQueryString = (params: ToStringProps): string => {
  const queryParams = new URLSearchParams();
  for (let key in params) {
    if (params[key] === null) { } else if (key === "page") {
      // @ts-ignore
      queryParams.append("offset", ((params.page - 1) * params.pageSize).toString());
    } else if (key === "pageSize") {
      // @ts-ignore
      queryParams.append("limit", params.pageSize.toString());
    } else {
      // @ts-ignore
      queryParams.append(key, params[key].toString());
    }
  }
  return "?" + queryParams.toString();
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}