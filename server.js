const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyBEakHy_6yrcjLUYo3na8h1-A-o8O1eIjY");

app.post("/generate-comment", async (req, res) => {
  try {
    const { postText } = req.body;

    const prompt = `
You are writing LinkedIn comments like a real senior data engineering professional.

Generate exactly 4 different comments for the selected LinkedIn post.

Return comments in this exact order:

Comment 1:
Short thoughtful response. No question.

Comment 2:
A genuine practical question only.

Comment 3:
Mixed style. One short reaction plus one small question.

Comment 4:
Detailed senior data engineer perspective.

VERY IMPORTANT RULES:
- Return exactly 4 comments
- Do not write labels
- Do not write numbering
- Separate each comment with a new line
- Comment 1 must NOT contain a question mark
- Comment 2 must contain one question mark
- Comment 3 must contain one question mark
- Comment 4 must NOT contain a question mark
- No hashtags
- No emojis
- No "Great post"
- No "Thanks for sharing"
- No buzzwords
- Sound natural, human, and practical
- Do not summarize the post back

Selected LinkedIn post:
${postText}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const comment = result.response.text();

    res.json({
      comment
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Gemini backend running on port ${PORT}`);
});