// services/jamaatService.js
import { apiGet, apiPost, apiDelete } from "./apiClient";
import {byNameUtilEvents} from "../utils/dictionary_utils"
export async function fetchEvents() {
  const data = await apiGet("/api/events");
  return byNameUtilEvents(data);
}
export async function saveEvents(body) {
  const data = await apiPost("/api/events", body);
  return data;
}
export async function deleteEvent(body) {
  const data = await apiDelete(`/api/events/${body}`);
  return data;
}
