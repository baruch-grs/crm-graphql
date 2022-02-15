const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const connectDB = require('./config/db');

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
  context: () => {
    const myContext = 'Hello world';

    return {
      myContext
    }

  }
});

// start server
server.listen().then(({ url }) => {
  console.log(`Server ready in URL ${url}`);
});


