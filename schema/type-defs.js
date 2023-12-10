const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type Phase {
    id: ID
    name: String
  }
  
  type Document {
    id: ID
    title: String
    content: String
    phaseId: ID
    fileIds: [ID]
  }
  
  type File {
    id: ID
    fileName: String
    documentId: ID
    phaseId: ID
    fileData: String
  }
  
  type Query {
    allPhases: [Phase]
    allDocuments: [Document]
    allFiles: [File]
  }
  
  type Mutation {
    setupPhases: [Phase]
    createDocument(title: String, content: String, phaseId: ID): Document
    editDocument(id: ID, title: String, content: String, phaseId: ID): Document
    deleteDocument(id: ID): ID
    createFile(file: Upload!, documentId: ID, phaseId: ID): File
    deleteFile(id: ID): ID
  }
  
`;

module.exports = { typeDefs };
