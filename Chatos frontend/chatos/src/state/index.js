import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'; // You can use middleware like thunk if needed
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './Reducer';

const persistConfig = {
  key: "root",
  storage,
  version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Apply middleware here if needed
);

const persistor = persistStore(store);

export { store, persistor };
