require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const Trace = require("./models/Trace");
console.log("TRACE MODEL =", Trace);

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected");
  })
  .catch((err) => {
    console.log(err);
  });
 

app.get("/", (req, res) => {
  res.send("Plexus Server Running");
});

app.post("/trace", async (req, res) => {
  try {
    const trace = await Trace.create(req.body);

    res.status(201).json({
      success: true,
      trace
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false
    });
  }
});
app.get("/traces", async (req, res) => {
  try {

    const traces = await Trace.find()
      .sort({ timestamp: -1 });

    res.json(traces);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});