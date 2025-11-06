import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";


import { customLogger } from "./customLogger";
import { persistConfig } from "../Config/persistConfig";
import rootSaga from "../Sagas/rootSaga";
import rootReducer from "../Reducers/rootReducer";

const createSagaMiddleware = require("redux-saga");
const sagaMiddleware = createSagaMiddleware.default();

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware).concat(customLogger),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
