const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { buildContext } = require('graphql-passport');
const { wireup } = require('./router');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    login(username: String!, password: String!): LoginResponse
    logout: BaseResponse
    getUserDetails(user_id: String!): UserResponse
    getProducts(shop_id: String!): ProductsResponse
    getAllProducts: AllProductsResponse,
    getProduct(item_id: String!): AllProductResponse
    getAllCategories: CategoriesResponse,
    getCategories(shop_id: String!): CategoriesResponse
    getShopByOwner: ShopResponse,
    getShop(shop_id: String!): ShopResponse
    checkShopNameExists(shop_name: String!): ShopNameExistsResponse,
    getOrders: OrdersResponse
    getOrder(order_id: String!): OrderResponse
    getCartOrder: OrderResponse
    getCartItems(cart_id: String!): CartItemsResponse
  }
  type Mutation {
    addProduct(
      name: String
      image_url: String
      description: String
      price: Float
      category_id: String
      qty: String
      photo_url: String
      shop_id: String
    ): BaseResponse
    addCategory(shop_id: String!, name: String!): BaseResponse
    removeCategory(category_id: String!): BaseResponse
    addShop(
      name: String!
    ): BaseResponse
    addOrder(
      item_id: String!
      qty: Int
      price: String
    ): BaseResponse
    removeOrder(
      order_id: String!
    ): BaseResponse
    addCartItem(
      cart_id: String!
      item_id: String!
      qty: Int
      price: String
    ): BaseResponse
    deleteCartItem(
      cart_item_id: String!
    ): BaseResponse
    updateUserDetails(
      email: String
      username: String
      address1: String
      city: String
      dob: String
      dp_url: String
      name: String
      state: String
    ): BaseResponse
    modifyProduct(
      item_id: String!
      name: String
      image_url: String
      description: String
      price: String
      category_id: String
      qty: String
      photo_url: String
      shop_id: String
    ): BaseResponse
    updateShop(
      shop_id: String!
      name: String
      image_url: String
    ): BaseResponse
    modifyOrder(
      order_id: String!
      status: String
      total: Int
    ): BaseResponse
    modifyCartItem(
      order_dtl_id: String!
      qty: Int
    ): BaseResponse
  }
  type LoginResponse {
    success: Boolean
    message: String
    isAuthenticated: Boolean
    token: String
    user: LoggedInUser
  }
  type LoggedInUser {
    email: String
    id: String
    username: String
  }
  type BaseResponse {
    success: Boolean!
    message: String
  }
  type UserResponse {
    success: Boolean!,
    data: User
  }
  type User {
    _id: String!
    email: String
    password: String
    username: String
    address1: String
    city: String
    dob: String
    dp_url: String
    name: String
    state: String 
  }
  type ProductResponse {
    success: Boolean!
    message: String
    data: Product
  }
  type ProductsResponse {
    success: Boolean!
    message: String
    data: [Product]
  }
  type AllProductResponse {
    success: Boolean!
    message: String
    data: AllProduct
  }
  type AllProductsResponse {
    success: Boolean!
    message: String
    data: [AllProduct]
  }
  type Product {
    _id: String
    name: String
    image_url: String
    description: String
    price: String
    category_id: String
    qty: String
    photo_url: String
    shop_id: String
    item_id: String
    salesCount: Int
    createdAt: Float
    modifiedAt: Float
  }
  type AllProduct {
    _id: String
    name: String
    image_url: String
    description: String
    price: String
    category_id: String
    qty: String
    photo_url: String
    shop_id: String
    salesCount: Int
    shop_details: Shop
  }
  type CategoriesResponse {
    success: Boolean!
    message: String
    data: [Category]
  }
  type Category {
    _id: String
    shop_id: String
    name: String
  }
  type ShopsResponse {
    success: Boolean!
    message: String
    data: [Shop]
  }
  type ShopResponse {
    success: Boolean!
    message: String
    data: Shop
  }
  type Shop {
    _id: String
    name: String
    owner_id: String
    image_url: String
    totalSales: Int
  }
  type ShopNameExistsResponse {
    success: Boolean!,
    data: ShopNameExist
  }
  type ShopNameExist {
    exist: Boolean!
  }
  type OrdersResponse {
    success: Boolean!
    message: String
    data: [Order]
  }
  type OrderResponse  {
    success: Boolean!
    message: String
    data: Order
  }
  type OrderDetail {
    _id: String
    item_id: String
    qty: Int
    price: String
    order_id: String
    createdAt: Float
    modifiedAt: Float
    product: Product
  }
  type Order {
    _id: String
    user_id: String
    total: Int
    status: String
    createdAt: Float
    modifiedAt: Float
    insertedId: String
    details: [OrderDetail]
  }
  type CartItemsResponse {
    success: Boolean!
    message: String
    data: [CartItem]
  }
  type CartItem {
    _id: String
    qty: Int
    price: String
    order_id: String
    createdAt: Float
    modifiedAt: Float
    item_id: String
    gift: Boolean
    gift_description: String
    product: CartItemProduct
  }
  type CartItemProduct {
    category_id: String
    createdAt: Float
    description: String
    image_url: String
    item_id: String
    modifiedAt: Float
    name: String
    photo_url: String
    price: Float
    qty: Int
    shop_id: String
    _id: String
  }
`);

const resolveCommon = (root, args, context, info) => {
  return wireup(root, args, context, info);
}

const rootResolver = {
  login: resolveCommon,
  logout: resolveCommon,
  getUserDetails: resolveCommon,
  getAllProducts: resolveCommon,
  getProducts: resolveCommon,
  getProduct: resolveCommon,
  getAllCategories: resolveCommon,
  getCategories: resolveCommon,
  getShopByOwner: resolveCommon,
  getShop: resolveCommon,
  checkShopNameExists: resolveCommon,
  getOrders: resolveCommon,
  getOrder: resolveCommon,
  getCartOrder: resolveCommon,
  getCartItems: resolveCommon,
  addProduct: resolveCommon,
  addCategory: resolveCommon,
  addShop: resolveCommon,
  addOrder: resolveCommon,
  removeOrder: resolveCommon,
  addCartItem: resolveCommon,
  deleteCartItem: resolveCommon,
  updateUserDetails: resolveCommon,
  modifyProduct: resolveCommon,
  updateShop: resolveCommon,
  modifyOrder: resolveCommon,
  modifyCartItem: resolveCommon
};

const graphql = graphqlHTTP((req, res, graphQLParams) => {
  res.set('x-api-tech', 'graphql');
  const modResolver = {
    ...rootResolver
  };
  return {
    schema,
    rootValue: modResolver,
    context: buildContext({req, res}),
    graphiql: true, // this creates the interactive GraphQL API explorer with documentation.
  };
});

module.exports = graphql;