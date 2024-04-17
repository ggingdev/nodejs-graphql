const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const pool = require("../config/database");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: GraphQLList(UserType),
      resolve: async () => {
        const { rows } = await pool.query("SELECT * FROM users");
        return rows;
      },
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        const { name, email } = args;
        const { rows } = await pool.query(
          "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
          [name, email]
        );
        return rows[0];
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, name, email } = args;
        const { rows } = await pool.query(
          "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
          [name, email, id]
        );
        return rows[0];
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        const { id } = args;
        const { rows } = await pool.query(
          "DELETE FROM users WHERE id=$1 RETURNING *",
          [id]
        );
        return rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
