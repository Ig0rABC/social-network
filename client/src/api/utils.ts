interface ToString {
  toString: () => string
}

type ToStringProps = {
  [key: string]: ToString | null
}

export const buildQueryString = (params: ToStringProps): string => {
  const queryParams = new URLSearchParams();
  for (let key in params) {
    if (params[key] === null) {

    } else if (key === "page") {
      queryParams.append("offset", ((params.page as number - 1) * (params.pageSize as number)).toString());
    } else if (key === "pageSize") {
      queryParams.append("limit", (params.pageSize as number).toString());
    } else {
      // @ts-ignore
      queryParams.append(key, params[key].toString());
    }
  }
  return "?" + queryParams.toString();
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}