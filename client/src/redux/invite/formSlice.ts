import { createSlice } from '@reduxjs/toolkit';
import { FormConfig } from './inviteApiSlice';

interface FormInitialState {
  formStructure: FormConfig[];
}

const formSlice = createSlice({
  name: 'form',
  initialState: {
    formStructure: [],
  } as FormInitialState,
  reducers: {
    addFormItem: (state, action) => {
      const data: FormConfig = action.payload;
      state.formStructure.push(data);
    },
    removeFormItem: (state, action) => {
      const { index } = action.payload;
      state.formStructure.splice(index, 1);
    },
    updateFormItem: (state, action) => {
      const { index, data, optionIndex } = action.payload;
      const options = state.formStructure[index].options;
      if (options && options?.length > 0) {
        options[optionIndex] = {
          ...options[optionIndex],
          ...data,
        };
      } else {
        state.formStructure[index] = {
          ...state.formStructure[index],
          ...data,
        };
      }
    },
    resetForm: (state) => {
      state.formStructure = [];
    },
  },
});

export const { addFormItem, removeFormItem, resetForm, updateFormItem } =
  formSlice.actions;

export default formSlice.reducer;
