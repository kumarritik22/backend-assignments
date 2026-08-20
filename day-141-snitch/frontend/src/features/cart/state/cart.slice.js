import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalsByCurrency: [],
        items: []
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || []
            state.totalsByCurrency = action.payload?.totalsByCurrency || []
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        }
    }
});

export const { setCart, addItem } = cartSlice.actions;
export default cartSlice.reducer;