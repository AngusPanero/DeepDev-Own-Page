import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice"

const store = configureStore({
    reducer: {
        productSelector: productSlice
    }
})

export type AppDispatch = typeof store.dispatch;

export default store