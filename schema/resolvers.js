const { Phase } = require("../models/phase.model");
const { File } = require("../models/file.model");
const { Document } = require("../models/document.model");
const { Project } = require("../models/project.model");

const resolvers = {
  Query: {
    projects: async () => {
      try {
        const projects = await Project.find().populate({
          path: "phases",
          populate: { path: "documents" },
        });
        return projects;
      } catch (error) {
        throw new Error(`Error fetching projects: ${error.message}`);
      }
    },
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
        const documents = await Document.find().populate("project phase files");
        return documents;
      } catch (error) {
        throw new Error(`Error fetching documents: ${error.message}`);
      }
    },
    files: async () => {
      try {
        const files = await File.find().populate("document");
        return files;
      } catch (error) {
        throw new Error(`Error fetching files: ${error.message}`);
      }
    },
  },
  Document: {
    project: async (parent) => {
      try {
        const project = await Project.findById(parent.project);
        return project;
      } catch (error) {
        throw new Error(
          `Error fetching project for document: ${error.message}`
        );
      }
    },
    phase: async (parent) => {
      try {
        const phase = await Phase.findById(parent.phase);
        return phase;
      } catch (error) {
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
    createProject: async (_, args) => {
      try {
        const { name } = args.Project;
        console.log("Creating project with name:", name);
  
        const newProject = new Project({ name });
        await newProject.save();
  
        console.log("Created project:", newProject);
  
        return newProject;
      } catch (error) {
        console.error("Error creating project:", error.message);
        throw new Error(`Error creating project: ${error.message}`);
      }
    },
    deleteProject: async (_, { id }) => {
      try {
        const deletedProject = await Project.findByIdAndDelete(id);
        return deletedProject ? id : null;
      } catch (error) {
        throw new Error(`Error deleting project: ${error.message}`);
      }
    },
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
