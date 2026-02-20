# 🛡️ USD – Unified Security Dashboard

## 📌 Overview

USD (Unified Security Dashboard) is a network security monitoring system that:

- Discovers devices connected to the local network
- Detects open ports using Nmap
- Performs OS fingerprinting
- Assigns risk levels based on exposed services
- Displays results in a real-time security dashboard

This project demonstrates practical cybersecurity concepts including:

- Network discovery
- Port enumeration
- OS detection
- Risk scoring
- Device monitoring

---

## 🚀 Features

### 🔎 Network Discovery
- ARP-based host discovery (`nmap -sn -PR`)
- Automatic subnet detection
- Active device identification

### 🧠 OS Detection
- Uses `nmap -O` for OS fingerprinting
- Displays detected operating system (if available)

### 🌐 Port Scanning
- SYN scan (`-sS`) on top 20 common ports
- Extracts and stores open ports per device

### ⚠️ Risk Scoring Engine

Risk level is determined based on exposed services:

| Port | Risk Level |
|------|------------|
| 21 (FTP) | High |
| 23 (Telnet) | High |
| 3389 (RDP) | High |
| 22 (SSH) | Medium |
| 139, 445 (SMB) | Medium |

Devices are categorized as:

- 🟢 Low Risk
- 🟠 Medium Risk
- 🔴 High Risk

---

## 📊 Dashboard Interface

The frontend dashboard provides:

- Total Devices
- Active Devices
- High Risk Devices
- Open Ports per Device
- OS Detection Results
- Color-coded Risk & Status indicators

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Nmap
- Axios

### Frontend
- React.js
- REST API integration
- Dashboard UI with dynamic risk visualization

---
