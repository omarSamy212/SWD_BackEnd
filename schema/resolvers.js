const { Project } = require("../models/project.model");
const { Phase } = require("../models/phase.model");
const { File } = require("../models/file.model");
const { Document } = require("../models/document.model");

const resolvers = {
  Query: {
    projects: async () => {
      try {
        const projects = await Project.find().populate({
          path: "phases",
          populate: {
            path: "documents",
            populate: { path: "files" },
          },
        });
        return projects;
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw new Error(`Error fetching projects: ${error.message}`);
      }
    },
    phases: async () => {
      try {
        const phases = await Phase.find().populate("documents"); // Populate the documents field
        return phases;
      } catch (error) {
        throw new Error(`Error fetching phases: ${error.message}`);
      }
    },
    documents: async () => {
      try {
        const documents = await Document.find().populate("files");
        return documents;
      } catch (error) {
        console.error("Error fetching documents:", error.message);
        throw new Error(`Error fetching documents: ${error.message}`);
      }
    },
    files: async () => {
      try {
        const files = await File.find();
        return files;
      } catch (error) {
        console.error("Error fetching files:", error.message);
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
        console.error("Error fetching project for document:", error.message);
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
        console.error("Error fetching phase for document:", error.message);
        throw new Error(
          `Error fetching phase for document: ${error.message}`
        );
      }
    },
    files: async (parent) => {
      try {
        const files = await File.find({ document: parent.id });
        return files;
      } catch (error) {
        console.error("Error fetching files for document:", error.message);
        throw new Error(
          `Error fetching files for document: ${error.message}`
        );
      }
    },
  },
  Phase: {
    documents: async (parent) => {
      try {
        const documents = await Document.find({ phase: parent.id });
        return documents;
      } catch (error) {
        console.error("Error fetching documents for phase:", error.message);
        throw new Error(
          `Error fetching documents for phase: ${error.message}`
        );
      }
    },
  },
  Project: {
    phases: async (parent) => {
      try {
        const phases = await Phase.find({ project: parent.id });
        return phases;
      } catch (error) {
        console.error("Error fetching phases for project:", error.message);
        throw new Error(
          `Error fetching phases for project: ${error.message}`
        );
      }
    },
  },
  Mutation: {
    createProject: async (_, args) => {
      try {
        const { name } = args.input;
        const newProject = new Project({ name });
        await newProject.save();

        // Create predefined phases for the new project
        const phaseNames = ["INITIATION", "REQUIREMENTS", "DESIGN"];
        for (const phaseName of phaseNames) {
          const phase = new Phase({ name: phaseName, project: newProject._id });
          await phase.save();
          newProject.phases.push(phase);
        }
        await newProject.save();

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
        console.error("Error deleting project:", error.message);
        throw new Error(`Error deleting project: ${error.message}`);
      }
    },
    createDocument: async (_, args) => {
      try {
        const { phaseId, projectId, title, content, imageUrl } = args.input;

        // Check if the phaseId is valid
        const phase = await Phase.findById(phaseId);
        if (!phase) {
          throw new Error(`Invalid phase ID: ${phaseId}`);
        }

        // Check if the projectId is valid
        const project = await Project.findById(projectId);
        if (!project) {
          throw new Error(`Invalid project ID: ${projectId}`);
        }

        // Create the document with the provided data
        const newDocument = new Document({
          phase: phaseId,
          project: projectId,
          title,
          content,
          imageUrl,
        });

        // Save the document
        await newDocument.save();

        // Initialize the phases and documents arrays if not present
        project.phases = project.phases || [];
        project.documents = project.documents || [];

        // Update the phases and documents in the project
        project.phases.push(phaseId);
        project.documents.push(newDocument._id);
        await project.save();

        // Initialize the documents array if not present
        phase.documents = phase.documents || [];

        // Update the documents in the phase
        phase.documents.push(newDocument._id);
        await phase.save();

        return newDocument;
      } catch (error) {
        console.error("Error creating document:", error.message);
        throw new Error(`Error creating document: ${error.message}`);
      }
    },
    editDocument: async (_, args) => {
      try {
        const updatedDocument = await Document.findByIdAndUpdate(
          args.input.id,
          args.input,
          { new: true }
        );
        return updatedDocument;
      } catch (error) {
        console.error("Error editing document:", error.message);
        throw new Error(`Error editing document: ${error.message}`);
      }
    },
    deleteDocument: async (_, { id }) => {
      try {
        const deletedDocument = await Document.findByIdAndDelete(id);
        return deletedDocument ? id : null;
      } catch (error) {
        console.error("Error deleting document:", error.message);
        throw new Error(`Error deleting document: ${error.message}`);
      }
    },
    createFile: async (_, args) => {
      try {
        const newFile = new File(args.input);
        await newFile.save();
        return newFile;
      } catch (error) {
        console.error("Error creating file:", error.message);
        throw new Error(`Error creating file: ${error.message}`);
      }
    },
    deleteFile: async (_, { id }) => {
      try {
        const deletedFile = await File.findByIdAndDelete(id);
        return deletedFile ? id : null;
      } catch (error) {
        console.error("Error deleting file:", error.message);
        throw new Error(`Error deleting file: ${error.message}`);
      }
    },
  },
};

module.exports = { resolvers };
