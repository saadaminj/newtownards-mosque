// services/jamaatService.js
import { apiGet, apiPost, apiDelete } from "./apiClient";
import {byNameUtilJamaat} from "../utils/dictionary_utils"
export async function fetchJamaatTimes() {
  const data = await apiGet("/api/jamaat");
  return byNameUtilJamaat(data);
}
export async function saveJamaatTimes(body) {
  const data = await apiPost("/api/jamaat", body);
  return data;
}
export async function deleteJamaat(body) {
  const data = await apiDelete(`/api/jamaat/${body}`);
  return data;
}
