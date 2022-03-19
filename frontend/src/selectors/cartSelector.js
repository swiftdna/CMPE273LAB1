export const selectLoading = (state) => state.cartDetails.loading;
export const selectCartDetails = (state) => state.cartDetails.data;
export const selectCartID = (state) => state.cartDetails.cart_id;
export const selectError = (state) => state.cartDetails.error;
export const selectErrorMessage = (state) => state.cartDetails.errorMessage;