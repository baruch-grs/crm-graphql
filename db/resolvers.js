const cursos = [
  {
    title: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
    technology: 'JavaScript ES6',
  },
  {
    title: 'React - La Guía Completa: Hooks Context Redux MERN +15 Apps',
    technology: 'React',
  },
  {
    title: 'Node.js - Bootcamp Desarrollo Web inc. MVC y REST APIs',
    technology: 'Node.js'
  },
  {
    title: 'ReactJS Avanzado - FullStack React GraphQL y Apollo',
    technology: 'React'
  }
];

require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Clients');


const createToken = (user, passphrase, expiresIn) => {
  console.log(user);
  const { id, email, name, lastName } = user;
  return jwt.sign({ id, email, name, lastName }, passphrase, { expiresIn });
}
// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.PASSPHRASE);
      return userId;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log('CANNOT GET PRODUCTS', error);
      }
    },

    getProductByID: async (_, { id }) => {
      // Revisar si existe producto
      const product = await Product.findById(id);

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;
      // Revisar si usuario está registrado 
      const userExists = await User.findOne({ email });
      console.log(userExists);
      if (userExists) {
        throw new Error('User is already registered.s');
      }
      // Hashear su password 
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // Guardarlo en la BBDD
        const user = new User(input);
        user.save(); // Se almacena en la BBDD

        return user;
      } catch (error) {
        console.log(error);
      }
    },

    authenticateUser: async (_, { input }) => {
      const { email, password } = input;
      // Verificar si el usuario existe
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error('Wrong user or password!');
      }

      // Revisar si password es correcto
      const rightPassword = await bcryptjs.compare(password, userExists.password);
      if (!rightPassword) {
        throw new Error('Wrong user or password!');
      }

      return {
        // Crear token
        token: createToken(userExists, process.env.PASSPHRASE, '24h')
      }

    },

    newProduct: async (_, { input }) => {
      try {
        const product = new Product(input);

        // Almacenar en BBDD
        const result = await product.save();
        return result;
      } catch (error) {
        console.log('ERROR. CANNOT CREATE PRODUCT', error);
      }
    },

    updateProduct: async (_, { id, input }) => {
      // Revisar si existe producto
      let product = await Product.findById(id);

      if (!product) {
        throw new Error('Product not found');
      }

      // Guardarlo en la BBDD
      product = await Product.findOneAndUpdate({ _id: id, }, input, { new: true });
      return product;
    },
    deleteProduct: async (_, { id }) => {
      // Revisar si existe producto
      let product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      // Eliminar producto
      await Product.findOneAndDelete({ _id: id });

      return 'Producto eliminado';
    },

    newClient: async (_, { input }) => {
      const { email } = input;
      // Verificar si el cliente está registrado
      console.log(input);
      const client = Client.findOne({ email });

      if (client) {
        throw new Error('Client already registered');
      }
      const newClient = new Client(input);

      // Asignar vendedor
      newClient.seller = "620e8ffdb6cb9b9b6dda706d";
      // Guardar en BBDD
      try {
        const result = await newClient.save();
        return result

      } catch (error) {
        console.log('ERROR, CLIENT NOT REGISTERED', error);
      }
    }
  }
}

module.exports = resolvers;