import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  id: number;
  name: string;
  startDateTime: string;
  endDateTime: string;
};

const machineSessionSlice = createSlice({
  name: 'machineSession',
  initialState: {
    id: -1,
    name: "",
    startDateTime: (new Date("1971-01-01")).toLocaleString(),
    endDateTime: (new Date()).toLocaleString()
  } as SessionState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      const { id, name, startDateTime, endDateTime } = action.payload;
      state.id = id;
      state.name = name;
      state.startDateTime = startDateTime;
      state.endDateTime = endDateTime;
    }
  }
})


export const { setSession } = machineSessionSlice.actions;
export default machineSessionSlice.reducer;

export const selectCurrentMachineSession = (state: { machineSession: SessionState }) => state.machineSession;
