import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    team: []
}

export const teamSlice = createSlice({
    name: 'taam',
    initialState,
    reducers: {
        setTeamMembers: (state, action) => {
            state.team = action.payload
        },
        getTeamMember: (state, action) => {
            const { id } = action.payload
            const teamMember = state.team.find((member) => member._id === id)
            return teamMember
        },
        addTeamMember: (state, action) => {
            state.team.push(action.payload)
        },
        updateTeamMember: (state, action) => {
            const updatedMember = action.payload
            const index = state.team.findIndex((member) => member._id === updatedMember._id)
            if (index !== -1) {
                state.team[index] = { ...state.team[index], ...updatedMember }
            }
        }
    }
})

export const { setTeamMembers, getTeamMember, addTeamMember, updateTeamMember } = teamSlice.actions
export default teamSlice.reducer