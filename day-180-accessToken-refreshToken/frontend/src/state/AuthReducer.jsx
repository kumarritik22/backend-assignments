import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { addUser } = authSlice.actions;