const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Schema GraphQL
const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    age: Int
  }

  type Query {
    characters: [Character]
    character(id: ID!): Character
  }

  type Mutation {
    createCharacter(name: String!, age: Int): Character
    updateCharacter(id: ID!, name: String, age: Int): Character
    deleteCharacter(id: ID!): Character
  }
`;

// Exemple de données (à remplacer par votre propre logique de stockage des objets/personnages)
const characters = [
  { id: '1', name: 'Luke Skywalker', age: 23 },
  { id: '2', name: 'Darth Vader', age: 45 },
];

// Résolveurs GraphQL
const resolvers = {
  Query: {
    characters: () => characters,
    character: (_, { id }) => characters.find((c) => c.id === id),
  },
  Mutation: {
    createCharacter: (_, { name, age }) => {
      const newCharacter = { id: String(characters.length + 1), name, age };
      characters.push(newCharacter);
      return newCharacter;
    },
    updateCharacter: (_, { id, name, age }) => {
      const character = characters.find((c) => c.id === id);
      if (!character) throw new Error('Character not found');
      character.name = name || character.name;
      character.age = age || character.age;
      return character;
    },
    deleteCharacter: (_, { id }) => {
      const characterIndex = characters.findIndex((c) => c.id === id);
      if (characterIndex === -1) throw new Error('Character not found');
      const deletedCharacter = characters.splice(characterIndex, 1)[0];
      return deletedCharacter;
    },
  },
};

// Création de l'instance ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Création de l'application Express
const app = express();

// Fonction asynchrone pour démarrer le serveur Apollo
async function startApolloServer() {
  await server.start();

  // Montage du serveur Apollo GraphQL sur l'application Express
  server.applyMiddleware({ app });

  // Démarrage du serveur
  const port = 4000;
  app.listen(port, () => {
    console.log(`Apollo Server started on http://localhost:${port}/graphql`);
  });
}

startApolloServer().catch((err) => {
  console.error('Error starting Apollo Server:', err);
});
