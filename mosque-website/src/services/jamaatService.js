// services/jamaatService.js
import { apiGet } from "./apiClient";
import {byNameUtilJamaat} from "../utils/dictionary_utils"
export async function fetchJamaatTimes() {
  const data = await apiGet("/api/jamaat");
  return byNameUtilJamaat(data);
}
