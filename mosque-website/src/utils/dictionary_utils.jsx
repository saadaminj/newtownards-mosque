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
