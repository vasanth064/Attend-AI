import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from './sessionsApiSlice';

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [] as Session[],
  },
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
  },
});

export const { setSessions } = sessionsSlice.actions;

export default sessionsSlice.reducer;
