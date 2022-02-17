const { gql } = require('apollo-server');
// Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    createdDate: String
  }

  type Token {
    token: String
  }

  type Product {
    id: ID
    name: String
    availability: Int
    price: Float
    created: String
  }

  type Client {
    id: ID
    name: String
    lastName: String
    company: String
    email: String
    phone: String
    seller: ID
  }

  input AuthenticateInput {
    email: String
    password: String!
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    availability: Int!
    price: Float!
  }

  input ClientInput {
    name: String!
    lastName: String!
    company: String!
    email: String!
    phone: String
  }

  type Query {
    # Users
    getUser(token: String!): User

    # Products
    getProducts: [Product]
    getProductByID(id: ID!): Product 
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String
    
    # Clients
    newClient(input: ClientInput): Client

  }
`;

module.exports = typeDefs;