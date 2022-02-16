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
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
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
    }
  }
}

module.exports = resolvers;