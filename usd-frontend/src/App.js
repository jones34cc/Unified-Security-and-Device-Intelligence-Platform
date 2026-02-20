import React, { useState, useEffect } from "react";

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    const res = await fetch("http://localhost:5000/devices");
    const data = await res.json();
    setDevices(data);
  };

  const handleScan = async () => {
    setLoading(true);
    await fetch("http://localhost:5000/scan", {
      method: "POST",
    });
    await fetchDevices();
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>USD - Unified Security Dashboard</h1>

      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Start Scan"}
      </button>

      <h2>Detected Devices</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>IP</th>
            <th>MAC</th>
            <th>Vendor</th>
            <th>Status</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={index}>
              <td>{device.ip}</td>
              <td>{device.mac}</td>
              <td>{device.vendor}</td>

              <td
                style={{
                  color: device.status === "Active" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {device.status}
              </td>

              <td>
                {device.lastSeen
                  ? new Date(device.lastSeen).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;