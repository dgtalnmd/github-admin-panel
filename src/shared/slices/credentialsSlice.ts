import { createSlice } from "@reduxjs/toolkit";

type CredentialsState = {
  login: string;
  token: string;
};

const initialState: CredentialsState = {
  login: "",
  token: "",
};

const credentialsSlice = createSlice({
  name: "credentials",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.login = action.payload.login;
      state.token = action.payload.token;
    },
  },
});

export const { setCredentials } = credentialsSlice.actions;
export default credentialsSlice.reducer;
