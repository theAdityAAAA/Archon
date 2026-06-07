console.log("TRACE FILE LOADED");

const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema({
  traceId: String,

  service: String,

  endpoint: String,

  method: String,

  duration: Number,

  status: Number,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Trace",
  TraceSchema
);