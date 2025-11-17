// services/jamaatService.js
import { apiGet, apiPost } from "./apiClient";
export async function login(body) {
  const data = await apiPost("/api/password", body);
  return data;
}
export async function logout() {
  const data = await apiGet("/api/password");
  return data;
}

export async function me() {
  const data = await apiGet("/api/auth/me");
  return data;
}