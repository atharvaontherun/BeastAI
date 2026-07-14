const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

const commands = {
  vscode: "code",
  chrome: "start chrome",
  brave: "start brave",
  spotify: "start spotify",
  discord: "start discord",
  calculator: "calc",
  notepad: "notepad",
  paint: "mspaint",
  explorer: "explorer",
};

app.post("/execute", (req, res) => {
  const { app: appName } = req.body;

  if (!appName) {
    return res.status(400).json({
      success: false,
      error: "No app specified",
    });
  }

  const command = commands[appName.toLowerCase()];

  if (!command) {
    return res.status(404).json({
      success: false,
      error: "Unknown application",
    });
  }

  exec(command, (err) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      app: appName,
    });
  });
});
app.get("/test", (req, res) => {
  exec("notepad");

  res.send("Opening Notepad...");
});
app.listen(4567, () => {
  console.log("🚀 BEAST Companion running on http://localhost:4567");
});