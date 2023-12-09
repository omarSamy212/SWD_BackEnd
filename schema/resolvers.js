const { Document } = require("../models/document.model");
const { File } = require("../models/file.model");
const { Phase } = require("../models/phase.model");

const resolvers = {
  Query: {
    documents: async () => {
      try {
        const documents = await Document.find().populate("files");
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
    phases: async () => {
      try {
        const phases = await Phase.find().populate("documents");
        return phases;
      } catch (error) {
        throw new Error(`Error fetching phases: ${error.message}`);
      }
    },
  },
  Document: {
    files: async (parent) => {
      try {
        const files = await File.find({ document: parent.id });
        return files;
      } catch (error) {
        throw new Error(`Error fetching files for document: ${error.message}`);
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
  },
  Phase: {
    documents: async (parent) => {
      try {
        const documents = await Document.find({ phase: parent.id });
        return documents;
      } catch (error) {
        throw new Error(`Error fetching documents for phase: ${error.message}`);
      }
    },
  },
  Mutation: {
    createDocument: async (_, args) => {
      try {
        const { phaseId, title, content, imageUrl } = args.input;

        // Check if the phaseId is valid
        const phase = await Phase.findById(phaseId);
        if (!phase) {
          throw new Error(`Invalid phase ID: ${phaseId}`);
        }

        // Create the document with the provided data
        const newDocument = new Document({
          phase: phaseId,
          title,
          content,
          imageUrl,
        });

        // Save the document
        await newDocument.save();

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
    createFile: async (_, args, context) => {
      try {
        const { file } = context;

        if (!file) {
          throw new Error("File is required.");
        }

        const { documentId, fileName, filePath } = args.input;

        // Handle file upload logic and save the file information
        // to your database, e.g., create a new File document

        const newFile = new File({
          document: documentId,
          fileName,
          filePath,
        });

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
        throw new Error(`Error deleting file: ${error.message}`);
      }
    },
  },
};

module.exports = { resolvers };
