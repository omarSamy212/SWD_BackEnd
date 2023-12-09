// project.model.js
const mongoose = require("mongoose");
const Phase = require("./phase");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Each project should have a unique name
  },
});

const Project = mongoose.model("Project", ProjectSchema);

// Seed phases for a new project
ProjectSchema.pre("save", async function (next) {
  try {
    const project = this;

    // Check if the project is new (not an update)
    if (project.isNew) {
      // Predefined phase names
      const phaseNames = ["INITIATION", "REQUIREMENTS", "DESIGN"];

      // Seed phases for the new project
      for (const phaseName of phaseNames) {
        const phase = await Phase.create({
          name: phaseName,
          project: project._id,
        });
        project.phases.push(phase);
      }

      console.log(`Phases seeded for project '${project.name}' successfully`);
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = Project;
