const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type Phase {
    id: ID!
    name: String!
    documents: [Document]
  }

  type Document {
    id: ID!
    phase: Phase!
    title: String!
    content: String!
    imageUrl: String
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
    createDocument(input: DocumentInput): Document
    editDocument(input: DocumentEditInput): Document
    deleteDocument(id: ID!): ID
    uploadFile(input: FileInput): File
    deleteFile(id: ID!): ID
  }

  input DocumentInput {
    phaseId: ID!
    title: String!
    content: String!
    imageUrl: String
  }

  input DocumentEditInput {
    id: ID!
    title: String
    content: String
    imageUrl: String
  }

  input FileInput {
    documentId: ID!
    file: Upload!
  }
`;

module.exports = { typeDefs };
