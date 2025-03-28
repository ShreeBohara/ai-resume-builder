const mongoose = require("mongoose");

const resumeDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  education: [
    {
      institution: String,
      degree: String,
      startDate: String,
      endDate: String,
      description: String
    }
  ],
  experience: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String
    }
  ],
  projects: [
    {
      title: String,
      description: String,
      link: String,
      technologies: [String]
    }
  ],
  skills: [String],
  certifications: [
    {
      name: String,
      authority: String,
      date: String
    }
  ]
});

module.exports = mongoose.model("ResumeData", resumeDataSchema);
