export const byNameUtilPrayers = (data) => {
    return data.reduce((acc, row) => {
        acc[row.date] = {
          fajr: row.fajr,
          sunrise: row.sunrise,
          dhuhr: row.dhuhr,
          asr: row.asr,
          maghrib: row.maghrib,
          isha: row.isha,
        };
        return acc;
    }, {});
}

export const byNameUtilEvents = (data) => {
    return data.reduce((acc, row) => {
        acc[row.name] = {
          description: row.description,
          time: row.time,
        };
        return acc;
      }, {});
};

export function byNameUtilJamaat(data) {
  return data.reduce((acc, row) => {
    acc[row.name] = {
      time: row.time,
    };
    return acc;
  }, {});
};


// prayerData: the dictionary you showed
// currentTime: a JS Date object

function parsePrayerDateTime(dateStr, timeStr) {
  // timeStr format: "HH:MM" (24-hour)
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function msToHMS(ms) {
  if (ms == null || ms < 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

export function getNextPrayer(prayerData, currentTime) {
  try{
    const todayStr = currentTime.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const sortedDates = Object.keys(prayerData).sort();      // ISO dates sort correctly

    for (const dateStr of sortedDates) {
      // Skip days in the past
      if (dateStr < todayStr) continue;

      const daySchedule = prayerData[dateStr];
      if (!daySchedule) continue;

      // Build [{ name, dateTime }]
      const prayers = Object.entries(daySchedule)
        .map(([name, timeStr]) => ({
          name,
          dateTime: parsePrayerDateTime(dateStr, timeStr),
        }))
        .sort((a, b) => a.dateTime - b.dateTime);

      for (const p of prayers) {
        // For today, only consider times after "now"
        if (dateStr === todayStr && p.dateTime <= currentTime) continue;

        const diffMs = p.dateTime.getTime() - currentTime.getTime();
        if (diffMs <= 0) continue;

        return {
          nextPrayerName: p.name,
          nextPrayerDateTime: p.dateTime,
          timeRemainingMs: diffMs,
          timeRemaining: msToHMS(diffMs),
        };
      }
      // If we got here and dateStr === todayStr, it means all today's prayers are past.
      // Loop continues, and the next date's first prayer will be picked.
    }

    // No future prayers in the data range
    return null;
  } catch(err){
    console.log(err);
  }
}

const defaultTimings = {
  fajr: "05:16",
  sunrise: "06:54",
  dhuhr: "13:29",
  asr: "17:00",
  maghrib: "20:02",
  isha: "21:34",
};

export function createPrayerData() {
    const prayerData = {};
    const year = (new Date()).getFullYear();

    for (let index = year - 1; index <= year + 1; index++) {
      const startDate = new Date(index, 0, 1);     // Jan 1
      const endDate = new Date(index + 1, 0, 1);   // Jan 1 next year

      for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateKey = `${yyyy}-${mm}-${dd}`;    // e.g. "2025-01-01"

        // Clone so each day has its own object
        prayerData[dateKey] = { ...defaultTimings };
      }
    }

    return prayerData;
}


export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
