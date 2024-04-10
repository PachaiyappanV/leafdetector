const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const fileupload = require("express-fileupload");
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const model = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
  generationConfig,
});
app.use(express.static("./public"));
app.use(express.json());
app.use(fileupload());

app.post("/api/upload", async (req, res) => {
  const leafImage = req.files.image;
  console.log(req.files);
  const imagePath = path.join(
    __dirname,
    `./public/uploads/` + `${leafImage.name}`
  );

  await leafImage.mv(imagePath);

  const leafname = await generatecontent(leafImage.name);

  async function generatecontent(imageName) {
    try {
      const imagepath = `public/uploads/${imageName}`;

      const imagedata = await fs.readFile(imagepath);

      const imageformat = imagedata.toString("base64");

      const parts = [
        { text: "Name of this plant,only give the name alone" },

        {
          inlineData: {
            mimeType: "image/webp",

            data: imageformat,
          },
        },
      ];

      const data = await model.generateContent({
        contents: [{ role: "user", parts }],
      });

      const result = await data.response;

      const text = result.text();
      return text;
    } catch (error) {
      console.error("Error generating", error);
    }
  }

  res.status(200).json({ leafname });
});

app.listen(port, () => console.log("server is up and running on port " + port));
