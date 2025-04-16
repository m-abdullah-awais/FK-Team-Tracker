import { configureStore } from '@reduxjs/toolkit';
import requestReducer from '../features/Requests/requestSlice';
import teamReducer from '../features/Team/teamSlice';
import reportReducer from '../features/Reports/reportSlice';

const store = configureStore({
    reducer: {
        requests: requestReducer,
        team: teamReducer,
        reports: reportReducer
    }
})

export default store;