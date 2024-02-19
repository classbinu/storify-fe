// slices/textSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  value: string;
  texts: string[];
}

const initialState: TextState = {
  value: '',
  texts: [],
};

export const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    // 텍스트 입력 값을 설정합니다.
    setText: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    // 새로운 텍스트를 texts 배열에 추가합니다.
    addText: (state, action: PayloadAction<string>) => {
      state.texts.push(action.payload);
    },

    resetText: (state) => {
      state.value = '';
      state.texts = [];
    },
  },
});


export const { setText, addText, resetText } = textSlice.actions;

export default textSlice.reducer;
