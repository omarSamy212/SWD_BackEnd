const { GraphQLUpload } = require("graphql-upload");
const {Phase} = require("../models/phase.model");
const {File} = require("../models/file.model");
const {Document} = require("../models/document.model");
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
    files: async () => {
      try {
        const files = await File.find();
        return files;
      } catch (error) {
        throw new Error(`Error fetching files: ${error.message}`);
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
