import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    requests: []
}

export const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        setAllTeam(state, action) {
            state.requests = action.payload
        },
        verifyTeam: (state, action) => {
            const { id } = action.payload
            const updatedRequests = state.requests.map((request) => {
                if (request._id === id) {
                    return { ...request, verification: "approved" }
                }
                return request
            })
            state.requests = updatedRequests
        },  
        declineTeam: (state, action) => {
            const { id } = action.payload
            const updatedRequests = state.requests.map((request) => {
                if (request._id === id) {
                    return { ...request, verification: "declined" }
                }
                return request
            })
            state.requests = updatedRequests
        },
    }

})

export const { setAllTeam, getPending, verifyTeam, declineTeam } = requestSlice.actions
export default requestSlice.reducer