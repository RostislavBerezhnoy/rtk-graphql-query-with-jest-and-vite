/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyAction,
  combineReducers,
  configureStore,
  EnhancedStore,
  Middleware,
  Reducer,
} from '@reduxjs/toolkit'
import { beforeEach, afterEach } from 'vitest'

export function setupStore<
  A extends {
    reducer: Reducer<any, any>
    reducerPath: string
    middleware: Middleware
    util: { resetApiState(): any }
  },
  R extends Record<string, Reducer<any, any>> = Record<never, never>,
>(api: A, extraReducers?: R): { api: any; store: EnhancedStore } {
  const getStore = (): EnhancedStore =>
    configureStore({
      reducer: combineReducers({
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      }),
      middleware: gdm => [
        ...gdm({ serializableCheck: false, immutableCheck: false }),
        api.middleware,
      ],
    })

  type StoreType = EnhancedStore<
    {
      api: ReturnType<A['reducer']>
    } & {
      [K in keyof R]: ReturnType<R[K]>
    },
    AnyAction,
    ReturnType<typeof getStore> extends EnhancedStore<any, any, infer M> ? M : never
  >

  const initialStore = getStore() as StoreType
  const refObj = {
    api,
    store: initialStore,
  }

  beforeEach(() => {
    const store = getStore() as StoreType
    refObj.store = store
  })

  afterEach(() => {
    refObj.store.dispatch(api.util.resetApiState())
  })

  return refObj
}
