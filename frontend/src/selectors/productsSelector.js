export const selectLoading = (state) => state.products.loading;
export const selectProducts = (state) => state.products.data;
export const selectError = (state) => state.products.error;
export const selectErrorMessage = (state) => state.products.errorMessage;