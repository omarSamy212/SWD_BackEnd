const { Phase } = require("../models/phase.model");
const { Document } = require("../models/document.model");
const { File } = require("../models/file.model"); // Change the alias to File
const fs = require("fs");
const { GraphQLUpload } = require("graphql-upload");
const path = require("path");

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    allPhases: async () => {
      return await Phase.find();
    },
    allDocuments: async () => {
      return await Document.find();
    },
    allFiles: async () => {
      return await File.find(); // Change to use File
    },
  },
  Mutation: {
    setupPhases: async () => {
      // Check if phases already exist
      const existingPhases = await Phase.find();

      if (existingPhases.length > 0) {
        console.log("Phases already exist, skipping setup.");
        return existingPhases;
      }

      const predefinedPhases = [
        { name: "Project Initiation" },
        { name: "Requirements" },
        { name: "Design" },
      ];

      const createdPhases = await Phase.create(predefinedPhases);
      console.log("omar4");

      return createdPhases;
    },

    createDocument: async (_, { title, content, phaseId }) => {
      const documentInstance = new Document({
        title,
        content,
        phaseId,
        fileIds: [],
      });
      await documentInstance.save();
      return documentInstance;
    },
    editDocument: async (_, { id, title, content, phaseId }) => {
      return await Document.findByIdAndUpdate(
        id,
        { title, content, phaseId },
        { new: true }
      );
    },
    deleteDocument: async (_, { id }) => {
      const deletedDocument = await Document.findByIdAndDelete(id);

      // If the document is deleted, also remove associated files
      if (deletedDocument) {
        const fileIds = deletedDocument.fileIds || [];
        await File.deleteMany({ _id: { $in: fileIds } });
      }

      return id;
    },

    createFile: async (_, { file, documentId, phaseId }) => {
      const { createReadStream, filename, mimetype } = await file;

      // Generate a unique filename or use the original filename
      const randomName = generateRandomString(12) + path.extname(filename);

      // Specify the path where you want to store the file
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        randomName
      );

      // Create a writable stream to store the file
      // const writeStream = fs.createWriteStream(filePath);

      // Pipe the file data to the writable stream
      // Create a writable stream to store the file
      const writeStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(writeStream)
          .on("finish", resolve)
          .on("error", reject)
      );

      // Read the file data as a Buffer
      const fileDataBuffer = await fs.promises.readFile(filePath);

      // Create an instance of File
      const fileInstance = new File({
        fileName: randomName,
        documentId,
        phaseId,
        mimeType: mimetype,
        fileData: fileDataBuffer, // Provide the file data as a Buffer
        filePath: filePath,
      });

      // Save the file data in your database
      await fileInstance.save();

      // Update the Document with the new file reference
      const documentInstance = await Document.findById(documentId);
      if (documentInstance) {
        documentInstance.fileIds.push(fileInstance.id);
        await documentInstance.save();
      }

      return {
        url: `http://localhost:4000/uploads/${randomName}`,
        fileName: randomName,
        mimeType: mimetype,
        documentId: documentId,
        phaseId: phaseId,
      };
    },

    deleteFile: async (_, { id }) => {
      const deletedFile = await File.findByIdAndRemove(id);

      // Remove the file reference from the associated document
      if (deletedFile) {
        await Document.updateOne(
          { _id: deletedFile.documentId },
          { $pull: { fileIds: id } }
        );
      }

      return id;
    },
  },
};

module.exports = { resolvers };
