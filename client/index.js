const express = require("express");
const path = require("path");
const { createServer } = require("http")

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "./public/")));

httpServer.listen(port, () => {
  console.log(`Front end server running on port: ${port}`);
});


