// src/types/auth.ts
export interface LoginResponse {
    idToken: string;
    refreshToken: string;
    userType: string;
    username: string;
    fullName: string;
    isFirstTime: boolean;
  }