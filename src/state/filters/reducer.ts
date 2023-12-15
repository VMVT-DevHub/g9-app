import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
  filter: any;
}

const initialState: FiltersState = {
  filter: {},
};

export const filters = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, filter: action.payload };
    },
  },
});

export default filters.reducer;

export const actions = filters.actions;
