import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from '@/utils/storage-persist'
import api from './api'
import { uiSlice } from './slices/uiSlice'
import { userSlice } from './slices/userSlice'

const persistConfig = {
  key: 'clLosbucmSInZsTtfixdI',
  storage,
  blacklist: ['api']
}

const reducers = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [uiSlice.name]: uiSlice.reducer,
  [api.reducerPath]: api.reducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: false
    }).concat(api.middleware)
})

export const persistor = persistStore(store)
