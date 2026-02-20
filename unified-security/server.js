const express = require("express");
const cors = require("cors");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const Device = require("./models/Device");
const axios = require("axios");


require("dns").setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));






function getLocalSubnet() {
    const interfaces = os.networkInterfaces();

    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (
                iface.family === "IPv4" &&
                !iface.internal &&
                !name.toLowerCase().includes("vmware") &&
                !name.toLowerCase().includes("virtual")
            ) {
                const ipParts = iface.address.split(".");
                return `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
            }
        }
    }
}
async function lookupVendor(mac) {
    try {
        // const cleanMac = mac.replace(/:/g, "").substring(0, 6);
    
        const response = await axios.get(`https://api.macvendors.com/48555E`);
        return response.data;
    } catch (error) {
        return "Unknown";
    }
}

app.post("/scan", async (req, res) => {
    try {
        const subnet = getLocalSubnet();

        if (!subnet) {
            return res.status(500).json({ error: "Could not detect subnet" });
        }

        console.log("Scanning subnet:", subnet);

        const { stdout } = await execPromise(`nmap -sn -PR ${subnet}`);

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

                let finalVendor = await lookupVendor(mac);

                currentDevice.mac = mac;
                currentDevice.vendor = finalVendor;

                devices.push(currentDevice);
            }
        }

        // Now process each device
        for (let device of devices) {

            // -------------------
            // OS Detection
            // -------------------
            let osInfo = "Unknown";

            try {
                const { stdout: osOutput } = await execPromise(`nmap -O ${device.ip}`);
                const osLines = osOutput.split("\n");

                for (let line of osLines) {
                    if (line.includes("OS details:")) {
                        osInfo = line.replace("OS details:", "").trim();
                        break;
                    }
                    if (line.includes("Running:")) {
                        osInfo = line.replace("Running:", "").trim();
                    }
                }
            } catch (err) {
                console.log("OS detection failed for", device.ip);
            }

            // -------------------
            // Port Scanning
            // -------------------
            let openPorts = [];

            try {
                const { stdout: portOutput } = await execPromise(`nmap -sS --top-ports 20 ${device.ip}`);
                const portLines = portOutput.split("\n");

                for (let line of portLines) {
                    if (line.includes("/tcp") && line.includes("open")) {
                        const port = parseInt(line.split("/")[0]);
                        openPorts.push(port);
                    }
                }
            } catch (err) {
                console.log("Port scan failed for", device.ip);
            }

            // -------------------
            // Risk Scoring Logic
            // -------------------
            let riskLevel = "Low";

            const highRiskPorts = [21, 23, 3389];
            const mediumRiskPorts = [22, 139, 445];

            if (openPorts.some(port => highRiskPorts.includes(port))) {
                riskLevel = "High";
            } else if (openPorts.some(port => mediumRiskPorts.includes(port))) {
                riskLevel = "Medium";
            }

            // -------------------
            // Save to Database
            // -------------------
            await Device.findOneAndUpdate(
                { ip: device.ip },
                {
                    ip: device.ip,
                    mac: device.mac,
                    vendor: device.vendor,
                    os: osInfo,
                    openPorts: openPorts,
                    riskLevel: riskLevel,
                    lastSeen: new Date()
                },
                { upsert: true, new: true }
            );
        }

        res.json({
            message: "Scan completed",
            subnet,
            devices
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Scan failed" });
    }
});

app.get("/devices", async (req, res) => {
    try {
        const devices = await Device.find().sort({ lastSeen: -1 });

        const updatedDevices = devices.map(device => {
            const fiveMinutes = 5 * 60 * 1000;
            const isActive = (Date.now() - new Date(device.lastSeen).getTime()) < fiveMinutes;

            return {
                ...device._doc,
                status: isActive ? "Active" : "Inactive"
            };
        });

        res.json(updatedDevices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch devices" });
    }
});

app.get("/", (req, res) => {
    
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
