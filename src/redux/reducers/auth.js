import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    id: null,
    name: null,
    email: null,
    role: null,
    allowedroutes: [],
    isTrial: false,
    isTrialEnded: false,
    isSubscribed: false,
    isSubscriptionEnded: false,
    account: undefined
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action)=>{
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.role = action.payload.role;
            state.allowedroutes = action.payload.allowedroutes;
            state.isTrial = action.payload.isTrial;
            state.isTrialEnded = action.payload.isTrialEnded;
            state.isSubscribed = action.payload.isSubscribed;
            state.isSubscriptionEnded = action.payload.isSubscriptionEnded;
            state.account = action.payload.account;
        },
        userNotExists: (state)=>{
            state.id = null;
            state.email = null;
            state.name = null;
            state.role = null;
            state.allowedroutes = [];
            state.isTrial = false;
            state.isTrialEnded = false;
            state.isSubscribed = false;
            state.isSubscriptionEnded = false;
            state.account = undefined;
        }
    }
})

export default authSlice;
export const {
    userExists,
    userNotExists
} = authSlice.actions;