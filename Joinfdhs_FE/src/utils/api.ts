// src/utils/api.ts
import axios from 'axios';

//const baseURL = process.env.REACT_PUBLIC_API_BASE_URL;

const baseURL = "https://asia-south1-mediksharegistration.cloudfunctions.net";

export const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const privateAPI = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});