const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config({ path: 'variables.env' });

// Connect to database

connectDB();
/**
 * Un mutation se utiliza para hacer las demás acciones del servidor
 * ACTUALIZAR, ELIMINAR Y CREAR REGISTROS
 * Similares a un PUT/PATCH, DELETE O POST
 * Ejemplo
 * 
 * mutation eliminarProducto($id : ID) {
    eliminarProducto(id: $ID)
 }

 Se requiere un Schema para lograr hacer funcionar el proyecto, éste definirá la forma de los datos
 Ej: 
 type Cliente {
   id: ID
   nombre: String
   apellido: String
   empresa: String
   emails: [Email]
   edad: Int
 }

 type Email {
   email: String
 }

 ESTA ESTRUCTURA DEBE SER SIMILAR A LA BBDD
 */

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers['authorization']);
    const token = req.headers['authorization'] || '';
    if (token) {
      try {
        const user = jwt.verify(token, process.env.PASSPHRASE);

        return {
          user
        };
      } catch (error) {
        console.log('An error ocurred', error);
      }
    }
  }
});

// start server
server.listen().then(({ url }) => {
  console.log(`Server ready in URL ${url}`);
});


