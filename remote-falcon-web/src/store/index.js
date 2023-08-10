import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistStore } from 'redux-persist';

import Reactotron from 'ReactotronConfig';

import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  enhancers: process?.env?.REACT_APP_HOST_ENV === 'local' ? Reactotron.createEnhancer() : null
});

const persister = persistStore(store);

const { dispatch } = store;

if (process?.env?.REACT_APP_HOST_ENV === 'local') {
  Reactotron.setReduxStore(store);
}

const useDispatch = () => useAppDispatch();
const useSelector = useAppSelector;

export { store, persister, dispatch, useSelector, useDispatch };
