const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const noteRoutes = require("./routes/notes");
const aiRoutes = require("./routes/ai");

const app = express();

// MIDDLEWARE MUST COME BEFORE ROUTES
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/notes", noteRoutes);
app.use("/ai", aiRoutes);

// CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});