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
    project: Project!
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

  type Project {
    id: ID!
    name: String!
  }

  type Query {
    phases: [Phase]
    documents: [Document]
    files: [File]
    projects: [Project]
  }

  type Mutation {
    createProject(name: String!): Project
    deleteProject(id: ID!): ID
    createDocument(
      phaseId: ID!
      projectId: ID!
      title: String!
      content: String!
      imageUrl: String
    ): Document
    editDocument(
      id: ID!
      title: String
      content: String
      imageUrl: String
    ): Document
    deleteDocument(id: ID!): ID
    createFile(documentId: ID!, fileName: String!, filePath: String!): File
    deleteFile(id: ID!): ID
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = { typeDefs };
