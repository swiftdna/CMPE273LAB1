export const selectLoading = (state) => state.shops.loading;
export const selectShopDetails = (state) => state.shops.data;
export const selectPublicShopDetails = (state) => state.shops.publicShopData;
export const selectShopProducts = (state) => state.shops.products;
export const selectPublicShopProducts = (state) => state.shops.publicShopProducts;
export const selectShopCategories = (state) => state.shops.categories;
export const selectError = (state) => state.shops.error;
export const selectErrorMessage = (state) => state.shops.errorMessage;