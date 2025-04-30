// server/index.js
require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sheets = google.sheets({ version: "v4", auth });

app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: {
        values: [[name, email, message, new Date().toLocaleString()]],
      },
    });

    res.status(200).send("Success");
  } catch (error) {
    console.error("Error writing to sheet:", error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
