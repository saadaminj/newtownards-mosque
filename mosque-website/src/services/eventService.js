// services/jamaatService.js
import { apiGet } from "./apiClient";
import {byNameUtilEvents} from "../utils/dictionary_utils"
export async function fetchEvents() {
  const data = await apiGet("/api/events");
  return byNameUtilEvents(data);
}
