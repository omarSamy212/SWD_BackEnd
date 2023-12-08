const { GraphQLUpload } = require("graphql-upload");
const { Phase } = require("../models/phase");
const { File } = require("../models/file");
const { Document } = require("../models/document");
const path = require("path");
const fs = require("fs");

const resolvers = {
  Query: {
    phases: async () => {
      try {
        const phases = await Phase.find();
        return phases;
      } catch (error) {
        throw new Error(`Error fetching phases: ${error.message}`);
      }
    },
    documents: async () => {
      try {
        const documents = await Document.find();
        return documents;
      } catch (error) {
        throw new Error(`Error fetching documents: ${error.message}`);
      }
    },
    files: async () => {
      try {
        const files = await File.find();
        return files;
      } catch (error) {
        throw new Error(`Error fetching files: ${error.message}`);
      }
    },
  },
  Document: {
    phase: async (parent) => {
      console.log("Parent:", parent);
      try {
        const phase = await Phase.findById(parent.phase);
        console.log("Phase:", phase);
        return phase;
      } catch (error) {
        console.error("Error fetching phase for document:", error.message);
        throw new Error(`Error fetching phase for document: ${error.message}`);
      }
    },
    files: async (parent) => {
      try {
        const files = await File.find({ document: parent.id });
        return files;
      } catch (error) {
        throw new Error(`Error fetching files for document: ${error.message}`);
      }
    },
  },
  File: {
    document: async (parent) => {
      try {
        const document = await Document.findById(parent.document);
        return document;
      } catch (error) {
        throw new Error(`Error fetching document for file: ${error.message}`);
      }
    },
  },
  Mutation: {
    createDocument: async (_, args) => {
      try {
        const newDocument = await Document.create(args);
        return newDocument;
      } catch (error) {
        throw new Error(`Error creating document: ${error.message}`);
      }
    },
    editDocument: async (_, args) => {
      try {
        const updatedDocument = await Document.findByIdAndUpdate(
          args.id,
          args,
          { new: true }
        );
        return updatedDocument;
      } catch (error) {
        throw new Error(`Error editing document: ${error.message}`);
      }
    },
    deleteDocument: async (_, { id }) => {
      try {
        const deletedDocument = await Document.findByIdAndDelete(id);
        return deletedDocument ? id : null;
      } catch (error) {
        throw new Error(`Error deleting document: ${error.message}`);
      }
    },
    createFile: async (_, args) => {
      try {
        const newFile = await File.create(args);
        return newFile;
      } catch (error) {
        throw new Error(`Error creating file: ${error.message}`);
      }
    },
    deleteFile: async (_, { id }) => {
      try {
        const deletedFile = await File.findByIdAndDelete(id);
        return deletedFile ? id : null;
      } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
      }
    },
  },
};

module.exports = { resolvers };
