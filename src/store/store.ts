import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ReposQueries } from 'api'

const rootReducer = combineReducers({
  [ReposQueries.reducerPath]: ReposQueries.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
    ReposQueries.middleware,
  ],
})

export type RootState = ReturnType<typeof store.getState>
