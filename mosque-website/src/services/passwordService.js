// services/jamaatService.js
import { apiGet } from "./apiClient";
export async function fetchPassword() {
  const data = await apiGet("/api/password");
  return data.passtext;
}