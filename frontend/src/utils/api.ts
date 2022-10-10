import config from '../config'

const baseUrl = 'http://localhost:8080'

const commonHeaders = {
  'Content-Type': 'application/json',
}

const authenticationHeaders = {
  Authorization: `Bearer ${localStorage.getItem(config.jwtStorageKey)}`,
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RelativeURLString = `/${string}`
type Params = Record<string, any>
type Headers = Record<string, any>

interface FetchArgs {
  method: Method
  url: RelativeURLString
  params?: Params
  headers?: Headers
  authenticated?: boolean
}

async function genericFetch<T>({
  method,
  url,
  params,
  headers = {},
  authenticated = true,
}: FetchArgs) {
  const endpointURL = new URL(url, baseUrl)

  ;['GET', 'DELETE'].includes(method) &&
    !!params &&
    (endpointURL.search = new URLSearchParams(params).toString())

  const response = await fetch(endpointURL, {
    method,
    headers: {
      ...commonHeaders,
      ...(authenticated && authenticationHeaders),
      ...headers,
    },
    ...(!['GET', 'DELETE'].includes(method) &&
      !!params && {
        body: JSON.stringify(params),
      }),
  })

  if (!response.ok) {
    throw await response.text()
  }

  return (await response.json()) as T
}

type Options = Pick<FetchArgs, 'headers' | 'authenticated'>

export const get = <T>(
  url: RelativeURLString,
  params: Params = {},
  options: Options = {}
) => genericFetch<T>({ method: 'GET', url, params, ...options })

export const post = <T>(
  url: RelativeURLString,
  body: Params,
  options: Options = {}
) => genericFetch<T>({ method: 'POST', url, params: body, ...options })

export const put = <T>(
  url: RelativeURLString,
  body: Params,
  options: Options = {}
) => genericFetch<T>({ method: 'PUT', url, params: body, ...options })

export const patch = <T>(
  url: RelativeURLString,
  body: Params,
  options: Options = {}
) => genericFetch<T>({ method: 'PATCH', url, params: body, ...options })

export const del = <T>(
  url: RelativeURLString,
  params: Params = {},
  options: Options = {}
) => genericFetch<T>({ method: 'DELETE', url, params, ...options })
