import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { filters } from './filters/reducer';
import { userReducer } from './user/reducer';

const persistConfig = {
  key: 'g9',
  storage,
  whitelist: ['filters'],
};

const reducers = combineReducers({
  filters: filters.reducer,
  user: userReducer.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ serializableCheck: false })],
});

const persistor = persistStore(store);

const reduxData = { store, persistor };

export default reduxData;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
