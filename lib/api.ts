import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzeText = (text: string) =>
  API.post("/analyze-text", { text });
