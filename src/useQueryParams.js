import { useMemo, useCallback, useRef } from 'react'
import qs from 'query-string'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'
import useStableObject from './stableUseObject'

export default function useQueryParams(queryString, setQueryString, qpEncoder = false, options = {}) {
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const opts = useStableObject(options)

  const queryParams = useMemo(() => parser.decode(qs.parse(queryString)), [queryString, parser])
  const holder = useRef(queryParams)
  if (queryParams !== holder.current) {
    holder.current = queryParams
  }

  const setQueryParams = useCallback((newQueryParams, ...args) => {
    const currentQueryParams = holder.current
    const nextParams = {
      ...currentQueryParams,
      ...newQueryParams
    }
    const queryString = qs.stringify(parser.encode(nextParams), opts)
    setQueryString(queryString, ...args)
  }, [parser, opts, setQueryString])

  return [queryParams, setQueryParams]
}
