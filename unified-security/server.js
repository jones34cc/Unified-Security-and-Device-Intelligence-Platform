const express = require("express");
const cors = require("cors");
const os = require("os");
const { exec } = require("child_process");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());







//database connection
mongoose.connect("mongodb+srv://admin:linux@cluster0.agngd0u.mongodb.net//usd")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));



function getLocalSubnet() {
    const interfaces = os.networkInterfaces();

    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            if (iface.family === "IPv4" && !iface.internal) {
                const ipParts = iface.address.split(".");
                return `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
            }
        }
    }
}
app.post("/scan", (req, res) => {

    const subnet = getLocalSubnet();

    if (!subnet) {
        return res.status(500).json({ error: "Could not detect subnet" });
    }

    exec(`nmap -sn ${subnet}`, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Scan failed" });
        }

        console.log("Scanning subnet:", subnet);
        const devices = [];
const lines = stdout.split("\n").map(line => line.trim());

let currentDevice = {};

for (let line of lines) {

    if (line.includes("Nmap scan report for")) {
        const ip = line.split(" ").pop().trim();

        currentDevice = { ip };
    }

    if (line.includes("MAC Address")) {
        const parts = line.split(" ");
        const mac = parts[2];
        const vendor = parts.slice(3).join(" ")
    .replace("(", "")
    .replace(")", "")
    .trim();

        currentDevice.mac = mac;
        currentDevice.vendor = vendor;
        devices.push(currentDevice);
    }
}

res.json({
    message: "Scan completed",
    subnet,
    devices
});

    });
});


app.get("/", (req, res) => {
    
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
