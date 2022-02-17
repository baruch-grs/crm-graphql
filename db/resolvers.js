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

const createToken = (user, passphrase, expiresIn) => {
  console.log(user);
  const { id, email, name, lastName } = user;
  return jwt.sign({ id, email, name, lastName }, passphrase, { expiresIn });
}
// Resolvers
const resolvers = {
  Query: {
    getCourses: (_, { input }, context) => {
      const result = cursos.filter((curso) => curso.technology === input.technology);
      return result;
    },
    // getTechnology: () => cursos
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
        token: createToken(userExists, process.env.PASSPHRASE, '24h')
      }

      // Crear token
    }
  }
}

module.exports = resolvers;