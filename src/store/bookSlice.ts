import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookState {
  content: string;
  bookId: string;
  imageUrls: string[];
}

const initialState: BookState = {
  content: '',
  bookId: '',
  imageUrls: [],
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setBookId: (state, action: PayloadAction<string>) => {
      state.bookId = action.payload;
    },
    setImageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = action.payload;
    },
    resetAll:  (state) => {
      state.content = '';
      state.bookId = '';
      state.imageUrls = [];
    },
  },
});

export const { setBookContent, setBookId, setImageUrls, resetAll } = bookSlice.actions;

export default bookSlice.reducer;
