import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

let tasksReducer = createSlice({
    name:"tasks",
    initialState:{
        tasks:[]
    },
    reducers:{

    }
})

export const createTask = createAsyncThunk("tasks/create",async function(data,thunkApi){
    try{
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/add-task`,data,{
            headers:{
                "Content-Type":"application/json"
            }
        });
        if(res?.data?.status?.toLowerCase() === "success"){
            return thunkApi.fulfillWithValue(res?.data)
        }
        else{
            return thunkApi.rejectWithValue(res?.data)
        }
    }
    catch(err){
        return thunkApi.rejectWithValue({
            status:"error",
            message:"Error occurred while creating task",
            error:err
        })
    }
})

export const fetchTasks = createAsyncThunk("tasks/fetch",async function(data,thunkApi){
    try{
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/fetch-tasks`,data,{
            headers:{
                "Content-Type":'application/json'
            }
        });
        if(res?.data?.status?.toLowerCase() === "success"){
            return thunkApi.fulfillWithValue(res?.data)
        }
        else{
            return thunkApi.rejectWithValue(res?.data)
        }
    }
    catch(err){
        return thunkApi.rejectWithValue({
            status:"error",
            message:"Error occurred while fetching tasks",
            error:err
        })
    }
})

export const updateTaskById = createAsyncThunk("tasks/update",async function(data,thunkApi){
    try{
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/update-task-by-id`,data,{
            headers:{
                "Content-Type":'application/json'
            }
        });
        if(res?.data?.status?.toLowerCase() === "success"){
            return thunkApi.fulfillWithValue(res?.data)
        }
        else{
            return thunkApi.rejectWithValue(res?.data)
        }
    }
    catch(err){
        return thunkApi.rejectWithValue({
            status:"error",
            message:"Error occurred while updating task",
            error:err
        })
    }
})

export default tasksReducer.reducer;