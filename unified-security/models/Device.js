const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    mac: { type: String },
    vendor: { type: String },
    lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Device", deviceSchema);