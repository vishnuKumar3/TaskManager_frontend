import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../interceptor/interceptor"

let userReducer = createSlice({
    name:"tasks",
    initialState:{
        userData:{}
    },
    reducers:{
        setUser(state, action){
            state.userData = action.payload;
        }
    }
})

export default userReducer.reducer
export const {setUser} = userReducer.actions