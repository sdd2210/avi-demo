import { createSlice } from "@reduxjs/toolkit";

const globalStateSlice = createSlice({
  name: "globalState",
  initialState: {
    participant: [],
    isWaiting: false,
    vote: [],
    runningVote: null as any,
  },
  reducers: {
    addParticipant: (state, action) =>{
      state.participant = action.payload;
    },
    addVote: (state, action) =>{
      state.vote = action.payload;
    },
    addRunningVote: (state, action) =>{
      state.runningVote = action.payload;
    },
    turnOnWaiting: (state) =>{
      state.isWaiting = true;
    },
    turnOffWaiting: (state) =>{
      state.isWaiting = false;
    },
  },
});

export const { addParticipant, addVote, addRunningVote, turnOnWaiting, turnOffWaiting } = globalStateSlice.actions;

export default globalStateSlice.reducer;
