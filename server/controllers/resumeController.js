const ResumeData = require("../models/ResumeData");
const axios = require("axios"); // if needed to call external DeepSeek service
// Or const { SomeDeepSeekFunction } = require("deepseek") // if it's an npm package

exports.storeResumeData = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { education, experience, projects, skills, certifications } = req.body;

    // Upsert: Update or create
    let resumeData = await ResumeData.findOne({ userId });

    if (!resumeData) {
      resumeData = new ResumeData({
        userId,
        education,
        experience,
        projects,
        skills,
        certifications
      });
    } else {
      // update existing
      resumeData.education = education;
      resumeData.experience = experience;
      resumeData.projects = projects;
      resumeData.skills = skills;
      resumeData.certifications = certifications;
    }

    await resumeData.save();
    res.status(200).json({ message: "Resume data saved successfully" });
  } catch (error) {
    console.error("storeResumeData Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.generateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { jobDescription } = req.body;

    // 1) Fetch user data
    const resumeData = await ResumeData.findOne({ userId });

    if (!resumeData) {
      return res.status(404).json({ message: "No resume data found for user" });
    }

    // 2) Call your AI/DeepSeek service to generate a resume
    // *** This is placeholder logic, adjust it per your AI solution usage

    // Example: calling external API with user data and job description
    // const aiResponse = await axios.post("https://api.deepseek.ai/generateResume", {
    //   resumeData,
    //   jobDescription
    // });

    // or if it’s an NPM library:
    // const aiResponse = await SomeDeepSeekFunction({ resumeData, jobDescription });

    // Mocked result for demonstration
    const aiResponse = {
      data: {
        resumeText: `
        John Doe
        Email: example@example.com

        EXPERIENCE:
        - React Developer at XYZ

        MATCHED SKILLS:
        - React, Node.js, MongoDB
        `
      }
    };

    // 3) Return AI-generated resume
    res.status(200).json({
      resume: aiResponse.data.resumeText || "AI-generated resume placeholder"
    });
  } catch (error) {
    console.error("generateResume Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
