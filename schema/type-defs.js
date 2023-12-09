const { gql } = require("apollo-server-express");

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

  input ProjectInput {
    name: String!
  }

  input DocumentInput {
    phaseId: ID!
    projectId: ID!
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
    fileName: String!
    filePath: String!
  }

  type Query {
    phases: [Phase]
    documents: [Document]
    files: [File]
    projects: [Project]
  }

  type Mutation {
    createProject(input: ProjectInput): Project
    deleteProject(id: ID!): ID
    createDocument(input: DocumentInput): Document
    editDocument(input: DocumentEditInput): Document
    deleteDocument(id: ID!): ID
    createFile(input: FileInput): File
    deleteFile(id: ID!): ID
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = { typeDefs };
