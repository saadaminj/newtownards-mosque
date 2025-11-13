// services/jamaatService.js
import { apiGet } from "./apiClient";
import {byNameUtilPrayers} from "../utils/dictionary_utils"
export async function fetchPrayerTimes() {
  const data = await apiGet("/api/prayer_times");
  return byNameUtilPrayers(data);
}
