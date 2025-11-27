
import { Search, Edit2, Trash2, Copy } from 'lucide-react';
import Strings from '../../utils/admin/Strings.json';
export const PrayerDisplayWidget = ({searchDate, setSearchDate, filteredTimes, editEntry, duplicateEntry, deleteEntry}) => {
  const pageStrings = Strings["prayer_display"];
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {pageStrings.title}
          </h2>

          <div className="relative w-full md:w-auto">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={pageStrings.search_date}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.date}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.fajr}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.sunrise}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.dhuhr}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.asr}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.maghrib}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.isha}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.actions}</th>
            </tr>
          </thead>
          <tbody>
            {(!filteredTimes || (filteredTimes.length === 0)) ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  {pageStrings.no_entries}
                </td>
              </tr>
            ) : (
              (Array.isArray(filteredTimes) ? filteredTimes : []).map((day) => {
                const dateKey = day.date; // this is like "2024-04-01"

                return (
                  <tr key={dateKey} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{day.date}</td>
                    <td className="px-4 py-3 text-gray-600">{day.fajr || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{day.sunrise || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{day.dhuhr || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{day.asr || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{day.maghrib || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{day.isha || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editEntry(dateKey)}
                          className="text-blue-600 hover:text-blue-800"
                          title={pageStrings.edit}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateEntry(dateKey)}
                          className="text-green-600 hover:text-green-800"
                          title={pageStrings.duplicate}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(dateKey)}
                          className="text-red-600 hover:text-red-800"
                          title={pageStrings.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}