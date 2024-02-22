const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { default: axios } = require("axios");

const {USERS} = require('./User')
const {TODOS} = require('./Todos')

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `   
    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
    }


     type Todo {
        id: ID!
        title: String!
        Completed: Boolean!
        user: User
    }
    input TodoInput{
        title: String!
        Completed: Boolean!
        user_id: ID
    }
    
    type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
    }

    type Mutation{
        createTodo(input: TodoInput!): Todo!
        updateTodo(id: ID!, input: TodoInput!): Todo!
        deleteTodo(id: ID!) : ID!
    } 
    `,
    //if you want to from data base then use Query in typedefs, for sending the data to database use mutation
    resolvers: {
        Todo:{
            user:(todo) => USERS.find((user) => user.id === todo.id)
        },

      Query: {
        // getTodos: async () =>  (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        // getAllUsers: async () =>  (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        // getUser: async (_, {id}) =>  (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data

        getTodos: () => TODOS,
        getAllUsers: () =>  USERS,
        getUser:(_, {id}) =>  (USERS.find((user)=> user.id === id))
      },

      Mutation: {


        createTodo: (_,{input}) => {
            const newTodo = {id: Number(todos.length + 1), ...input}
            TODOS.push(newTodo);
            return TODOS
        },
        // createTodo:(_, {input})=>{
        //   const newTodo = {...input, id: generateId()};
        //   TODOs.push(newTodo);
        //   return newTodo;
        // },
        
        updateTodo: (_ ,{id, input} )=>{
           let todo=TODOS.find((t) => t.id===id );
           Object.assign(todo , input);
           return todo;
        },

        deleteTodo:(_ ,{id})=>{
          const removed = TODOS.shift({id});
          TODOs = TODOS.filter((todo)=>todo.id !==removed.id);
          return removed.id
        }
      }
    },
  });

  app.use(express.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));


  app.listen(4000, () => {
    console.log("app is listening on 4000");
  });
}

startServer();
