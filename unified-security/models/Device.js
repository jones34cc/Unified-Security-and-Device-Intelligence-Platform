const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    mac: { type: String },
    vendor: { type: String },
    os: { type: String },
    openPorts: { type: [Number] },
    riskLevel: { type: String },
    lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Device", deviceSchema);