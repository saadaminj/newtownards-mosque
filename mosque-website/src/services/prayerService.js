// services/jamaatService.js
import { apiDelete, apiGet, apiPost} from "./apiClient";
import {byNameUtilPrayers} from "../utils/dictionary_utils"
export async function fetchPrayerTimes() {
  const data = await apiGet("/api/prayer_times");
  return byNameUtilPrayers(data);
}

export async function savePrayerTimes(body) {
  const data = await apiPost("/api/prayer_times", body);
  return data;
}
export async function deletePrayer(body) {
  const data = await apiDelete(`/api/prayer_times/${body}`);
  return data;
}

