import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
  filter: any;
}

const initialState: FiltersState = {
  filter: {},
};

export const Filters = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, filter: action.payload };
    },
  },
});

export default Filters.reducer;

export const actions = Filters.actions;
