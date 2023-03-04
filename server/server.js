/*
  This code imports necessary modules and sets up an Express server 
  to interact with OpenAI API to generate text based on prompts received 
  through POST requests.
*/
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

// Load environment variables
dotenv.config();

// Configure the OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Set up Express server
const app = express();
app.use(cors());
app.use(express.json());

// Define GET endpoint to return a simple message
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

// Define POST endpoint to generate text based on received prompt
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    // Send the generated text in the response
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    // Log any errors and send a 500 response with an error message
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});
// Start the server on port 5000
app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
