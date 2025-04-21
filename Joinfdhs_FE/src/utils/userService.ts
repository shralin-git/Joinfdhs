import { apiService } from "./apiService";
import axios from "axios";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  EmployeeID: string;
  collegeName: string;
  RollNumber: string;
  stateOfResidence: string;
  userType: string; // "mentor", "student", "admin", or "super admin"
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}


export const fetchUserInfo = async (username: string) => {
  try {
    const response = await apiService.get("/getUserProfile", { username });
    console.log("User Info Response:", response);

    // Store the user information in local storage
    localStorage.setItem("userInfo", JSON.stringify(response));

    return response; // Return the response for immediate use
  } catch (error: any) {
    // Handle specific errors for getUserInfo API
    if (error.response) {
      const { status, message } = error.response.data;
      switch (status) {
        case 400:
          throw new Error(message || "ID token is missing.");
        case 401:
          throw new Error(message || "Invalid ID token.");
        case 403:
          throw new Error(message || "Access forbidden: You are not authorized.");
        case 404:
          throw new Error(message || "User not found.");
        default:
          throw new Error(message || "An unexpected error occurred.");
      }
    } else {
      throw new Error("Network error. Please check your connection.");
    }
  }
};



/**
 * Fetches the user profile based on the provided username and ID token.
 * @param username - The username of the user to fetch.
 * @param idToken - The ID token for authorization.
 * @returns - A promise that resolves with the user profile or an error message.
 */
export const fetchUserProfile = async (
  username: string,
  idToken: string
): Promise<ApiResponse<UserProfile>> => {
  const url = "https://asia-south1-mediksharegistration.cloudfunctions.net/getUserProfile";

  try {
    if (!idToken) {
      throw new Error("ID token is missing");
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `${idToken}`,
      },
      params: {
        username,
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data as UserProfile,
      };
    } else {
      return {
        success: false,
        error: `Unexpected response code: ${response.status}`,
      };
    }
  } catch (error: any) {
    // Handle known error scenarios
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return { success: false, error: data.message || "ID token is missing" };
        case 401:
          return { success: false, error: data.message || "Invalid ID token" };
        case 403:
          return { success: false, error: data.message || "Unauthorized access" };
        case 404:
          return { success: false, error: data.message || "User not found" };
        default:
          return { success: false, error: data.message || `Unexpected error: ${status}` };
      }
    }

    // Handle other errors (e.g., network errors)
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};