import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';
import type { RootState } from '../store';

export interface UserReducerProps {
  userData: User;
  loggedIn: boolean;
}

export const emptyUser: UserReducerProps = {
  userData: { id: '', firstName: '', lastName: '', email: '' },
  loggedIn: false,
};

const initialState: UserReducerProps = emptyUser;

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userData, loggedIn } = action.payload;
      return {
        ...state,
        userData: { ...userData },
        loggedIn: loggedIn,
        error: '',
      };
    },
  },
});

export const selectUser = (state: RootState) => state;

export const actions = userReducer.actions;

export default userReducer.reducer;
