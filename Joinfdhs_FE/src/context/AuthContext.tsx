import React, { createContext, useContext, useState, ReactNode } from "react";
import { message } from "antd";
import { API } from "../utils/api"; // Your API utility
import { LoginResponse } from "../types/auth"; // Your types
import { RoleType } from "../pages/LoginPage";

interface AuthContextType {
  login: (
    username: string,
    password: string,
    role: RoleType,
    navigate: (path: string) => void
  ) => Promise<"success" | "error">;
  logout: (navigate: (path: string) => void) => void;
  isLoading: boolean;
  idToken: string | null;
  username: string | null;
  role: string | null;
  fullName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthDataState] = useState<{
    idToken: string | null;
    username: string | null;
    role: string | null;
    fullName: string | null;
  }>({
    idToken: null,
    username: null,
    role: null,
    fullName: null,
  });

  // Function to update authentication data in state and localStorage
  const setAuthData = (data: Partial<AuthContextType>) => {
    const updatedAuthData = { ...authData, ...data };
    setAuthDataState(updatedAuthData);

    if (data.idToken) localStorage.setItem("idToken", data.idToken);
    if (data.username) localStorage.setItem("username", data.username);
    if (data.role) localStorage.setItem("role", data.role);
    if (data.fullName) localStorage.setItem("fullName", data.fullName);
  };

  // Function to clear authentication data from state and localStorage
  const clearAuthData = () => {
    setAuthDataState({
      idToken: null,
      username: null,
      role: null,
      fullName: null,
    });

    localStorage.removeItem("idToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
  };

  // Login function
  const login = async (
    username: string,
    password: string,
    role: RoleType,
    navigate: (path: string) => void
  ): Promise<"success" | "error"> => {
    setIsLoading(true);
    try {
      const endpoint = role === "Student" ? "/LOGINSTUDENT" : "/Login";

      const response = await API.post<LoginResponse>(
        endpoint,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response);

      if (response.status !== 200) {
        throw new Error("Unexpected status code");
      }

      const data = response.data;

      if (!data.idToken || !data.userType || !data.fullName || !data.username) {
        throw new Error("Missing required fields in response.");
      }

      setAuthData({
        idToken: data.idToken,
        username: data.username,
        role: data.userType,
        fullName: data.fullName,
      });

      // Navigate based on user type
      if (data.isFirstTime) {
        navigate("/reset");
      } else {
        switch (data.userType) {
          case "Admin":
            navigate("/admin-dashboard");
            break;
          case "Super admin":
            navigate("/admin-dashboard");
            break;
          case "Mentor":
            navigate("/mentor-dashboard");
            break;
          case "Student":
            navigate("/student-dashboard/enrol");
            break;
          default:
            throw new Error("Unknown role");
        }
      }

      return "success";
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response) {
        const status = error.response.status;
        const errorMsg = error.response.data?.message;

        switch (status) {
          case 401:
            message.error(errorMsg);
            break;
          case 404:
            message.error(errorMsg);
            break;
          case 402:
            message.error(errorMsg);
            break;
          case 212:
            message.error(errorMsg);
            break;
          default:
            message.error(errorMsg || "Login failed. Please try again.");
            break;
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
      return "error";
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (navigate: (path: string) => void) => {
    clearAuthData();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        idToken: authData.idToken,
        username: authData.username,
        role: authData.role,
        fullName: authData.fullName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};