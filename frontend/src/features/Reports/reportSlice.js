import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reports: []
}

export const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setAdminReports: (state, action) => {
            state.reports = action.payload;
        },
        addAdminReport: (state, action) => {
            state.reports.push(action.payload);
        },
        updateAdminReport: (state, action) => {
            const index = state.reports.findIndex(report => report._id === action.payload._id);
            if (index !== -1) {
                state.reports[index] = { ...state.reports[index], ...action.payload };
            }
        }
    }
})

export const { setAdminReports, addAdminReport, updateAdminReport } = reportSlice.actions;
export default reportSlice.reducer;