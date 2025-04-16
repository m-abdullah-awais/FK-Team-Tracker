import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    tasks: []
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload)
        }
    }
})