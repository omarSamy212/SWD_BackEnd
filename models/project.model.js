const mongoose = require("mongoose");
const Phase = require("./phase.model"); // Adjust the path based on your file structure

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
    },
  ],
});

const Project = mongoose.model("Project", ProjectSchema);

ProjectSchema.pre("save", async function (next) {
  try {
    const project = this;

    console.log("Project:", project);

    if (project.isNew) {
      const phaseNames = ["INITIATION", "REQUIREMENTS", "DESIGN"];

      for (const phaseName of phaseNames) {
        console.log("Creating phase:", phaseName);

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
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

module.exports = Project;
