import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        color: "#333",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#ff4d4f" }}>403</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Access Denied</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.2rem", color: "#666" }}>
        You do not have permission to view this page.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handleGoBack}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "#1890ff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "#52c41a",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;