import { createSlice } from "@reduxjs/toolkit";

let tasksReducer = createSlice({
    name:"tasks",
    initialState:{
        tasks:[]
    },
    reducers:{

    }
})

export default tasksReducer.reducer;