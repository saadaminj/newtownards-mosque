
import { Search, Edit2, Trash2, Copy } from 'lucide-react';
export const PrayerDisplayWidget = ({searchDate, setSearchDate, filteredTimes, editEntry, duplicateEntry, deleteEntry}) => {
  return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Prayer Times</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder="Search date (YYYY-MM-DD)"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fajr</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Sunrise</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Dhuhr</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Asr</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Maghrib</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Isha</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!filteredTimes || (filteredTimes.length === 0)) ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No entries yet. Click "Add Entry" or "Generate Year Template" to get started.
                  </td>
                </tr>
              ) : (
                filteredTimes?.map((day) => {
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
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateEntry(dateKey)}
                            className="text-green-600 hover:text-green-800"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEntry(dateKey)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
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