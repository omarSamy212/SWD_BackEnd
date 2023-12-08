const { gql } = require("apollo-server-express");

// schema
const typeDefs = gql`
  scalar Upload

  type Phase {
    id: ID!
    name: String!
  }

  type Document {
    id: ID!
    phase: Phase!
    title: String!
    content: String!
    imageUrl: String # For Usecase Diagram in Requirements Phase
    files: [File]
  }

  type File {
    id: ID!
    document: Document!
    fileName: String!
    filePath: String!
  }

  type Query {
    phases: [Phase]
    documents: [Document]
    files: [File]
  }

  type Mutation {
    createDocument(
      phaseId: ID!
      title: String!
      content: String!
      imageUrl: String
    ): Document
    createFile(documentId: ID!, fileName: String!, filePath: String!): File
    editDocument(
      id: ID!
      title: String
      content: String
      imageUrl: String
    ): Document
    deleteDocument(id: ID!): ID
    deleteFile(id: ID!): ID
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = { typeDefs };
