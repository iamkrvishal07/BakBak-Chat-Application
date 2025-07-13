import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./messageSlice"
export const store=configureStore({
    reducer:{
        user:userSlice,
        message:messageSlice
    }
})