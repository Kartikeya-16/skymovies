import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import backendApi from "../api/backendApi";

const DebugAuth = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const handleGetToken = async () => {
    try {
      const clerkToken = await getToken();
      setToken(clerkToken);
      console.log("Clerk Token:", clerkToken);
    } catch (error) {
      console.error("Error getting token:", error);
      setToken("Error: " + error.message);
    }
  };

  const handleTestPaymentAPI = async () => {
    try {
      setTestResult("Testing...");
      const response = await backendApi.payments.createOrder({
        amount: 100,
        currency: "INR",
        bookingDetails: {
          movieTitle: "Test Movie",
          theatre: "Test Theatre",
          seats: ["A1", "A2"],
          showtime: "7:00 PM",
        },
      });
      setTestResult("✅ Success: " + JSON.stringify(response.data, null, 2));
      console.log("Payment API Response:", response);
    } catch (error) {
      setTestResult("❌ Error: " + (error.message || JSON.stringify(error)));
      console.error("Payment API Error:", error);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🔍 Authentication Debug Page</h1>

      <div style={{ marginBottom: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Clerk Status</h2>
        <p><strong>Signed In:</strong> {isSignedIn ? "✅ Yes" : "❌ No"}</p>
        <p><strong>User Email:</strong> {user?.primaryEmailAddress?.emailAddress || "N/A"}</p>
        <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Token Test</h2>
        <button 
          onClick={handleGetToken}
          style={{ padding: "10px 20px", marginBottom: "10px", cursor: "pointer" }}
        >
          Get Clerk Token
        </button>
        {token && (
          <div style={{ marginTop: "10px", padding: "10px", background: "#fff", borderRadius: "4px", wordBreak: "break-all" }}>
            <strong>Token:</strong>
            <pre style={{ fontSize: "10px", overflow: "auto" }}>{token}</pre>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Payment API Test</h2>
        <button 
          onClick={handleTestPaymentAPI}
          style={{ padding: "10px 20px", marginBottom: "10px", cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
        >
          Test Payment API
        </button>
        {testResult && (
          <div style={{ marginTop: "10px", padding: "10px", background: "#fff", borderRadius: "4px" }}>
            <pre style={{ fontSize: "12px", overflow: "auto", whiteSpace: "pre-wrap" }}>{testResult}</pre>
          </div>
        )}
      </div>

      <div style={{ padding: "20px", background: "#fff3cd", borderRadius: "8px" }}>
        <h3>📋 Instructions</h3>
        <ol>
          <li>Check if you're signed in via Clerk</li>
          <li>Click "Get Clerk Token" to verify token generation</li>
          <li>Click "Test Payment API" to test backend authentication</li>
          <li>Check browser console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugAuth;
