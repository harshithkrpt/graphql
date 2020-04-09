const { ApolloServer, gql } = require("apollo-server");
const Book = require("./model/Book");
const Author = require("./model/Author");

// Database Connection
require("./config/db");

const typeDefs = gql`
  input BookInput {
    title: String!
    author: ID!
  }

  type Book {
    _id: ID!
    title: String
    author: Author
  }

  type Author {
    _id: ID!
    name: String!
    books: [Book]
  }

  type Query {
    books: [Book]
    author: [Author]
  }

  type Mutation {
    addBook(bookInput: BookInput): Boolean
    addAuthor(name: String!): Author!
  }
`;

const resolvers = {
  Query: {
    books: async () => {
      const books = await Book.find().populate("author");
      return books;
    },
    author: async () => {
      const modifiedAuthors = [];
      const authorIds = [];
      const authors = await Author.find();
      // Push The IDS
      authors.forEach((author) =>
        authorIds.push(Book.find({ author: author.id }))
      );
      const books = await Promise.all(authorIds);
      authors.forEach((author, index) => {
        modifiedAuthors.push({ ...author._doc, books: [...books[index]] });
      });
      return modifiedAuthors;
    },
  },
  Mutation: {
    addBook: async (_, { bookInput }) => {
      const { title, author } = bookInput;
      const book = new Book({ title, author });
      try {
        await book.save();
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    addAuthor: async (_, { name }) => {
      const author = new Author({ name });
      try {
        const data = await author.save();
        return { name: data.name, _id: data._id };
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log("🚀 App Running On Url " + url);
});
