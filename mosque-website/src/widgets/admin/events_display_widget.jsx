
import { Search, Edit2, Trash2, Copy } from 'lucide-react';
export const EventsDisplayWidget = ({searchEventName, setSearchEventName, filteredTimes, editEntry, duplicateEntry, deleteEntry}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Events</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder="Search name"
                value={searchEventName}
                onChange={(e) => setSearchEventName(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(!filteredTimes || (filteredTimes?.length === 0)) ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No entries yet. Click "Add Entry" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredTimes?.map((event) => {
                    const eventName = event.name; 
                    return (
                      <tr key={eventName} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{event.name}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{event.description}</td>
                        <td className="px-4 py-3 text-gray-600">{event.time || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntry(eventName)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEntry(eventName)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntry(eventName)}
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
        </div>);
}