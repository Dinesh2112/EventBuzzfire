import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userFetched:0,
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser(state, action) {
            state.userID = action.payload;
        },
        clearUser(state, action){
            state.userID = false
        },
        updateUserFetched(state, action) {
            state.userFetched = action.payload;
        }
    },
});

export const {addUser, clearUser} = userSlice.actions;
export default userSlice.reducer;

