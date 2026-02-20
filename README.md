🛡️ USD – Unified Security Dashboard
📌 Overview

USD (Unified Security Dashboard) is a network security monitoring system that:

Discovers devices connected to your local network

Detects open ports using Nmap

Performs OS fingerprinting

Assigns risk levels based on exposed services

Displays results in a real-time dashboard

This project demonstrates practical cybersecurity concepts including:

Network scanning

Port enumeration

Risk scoring

Device classification

Vulnerability surface assessment

🚀 Features
🔎 Network Discovery

Uses ARP-based scanning (nmap -sn -PR)

Automatically detects local subnet

Identifies active devices

🧠 OS Detection

Uses nmap -O for OS fingerprinting

Displays detected operating system (if available)

🌐 Port Scanning

Scans top 20 common ports using SYN scan

Extracts open ports per device

⚠️ Risk Scoring Engine

Risk is calculated based on exposed ports:

Port	Risk
21 (FTP)	High
23 (Telnet)	High
3389 (RDP)	High
22 (SSH)	Medium
139, 445 (SMB)	Medium

Devices are classified as:

Low Risk

Medium Risk

High Risk

📊 Dashboard Interface

Total Devices

Active Devices

High Risk Devices

Open Ports per Device

Color-coded Risk & Status

🏗️ Tech Stack
Backend

Node.js

Express

MongoDB Atlas

Mongoose

Nmap

Axios

Frontend

React

REST API integration

Dashboard UI

⚙️ Installation Guide
1️⃣ Clone Repository
git clone <your-repo-url>
cd USD
2️⃣ Backend Setup
cd unified-security
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string

Start server (Run as Administrator for OS detection):

nodemon server.js
3️⃣ Frontend Setup
cd usd-frontend
npm install
npm start

Frontend runs at:

http://localhost:3000
⚠️ Important Notes

Nmap must be installed and added to system PATH.

For OS detection (-O) and SYN scan (-sS), backend must run with Administrator privileges.

Some modern devices use randomized MAC addresses, making vendor detection unreliable.

Smartphones often block port scanning for security reasons.

🧠 Security Disclaimer

This project is intended for:

Educational purposes

Testing on your own network

Ethical security experimentation

Do not scan networks you do not own or have permission to test.

📈 Future Improvements

CVE vulnerability lookup

Device fingerprint classification engine

Graph-based risk visualization

Automated alerts

Agent-based deep monitoring

👨‍💻 Author

Satyabrata Das
Computer Science & Engineering
Cybersecurity Enthusiast
