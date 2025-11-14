import { Edit2, X, Search, Trash2, Copy } from 'lucide-react';

export const JamaatAdmin = ({ 
  editingIndexJamaat,
  setEditingIndexJamaat,
  editFormJamaat,
  setEditFormJamaat,
  saveEntryJamaat,
  jamaatName,
  setJamaatName,
  filteredTimesJamaat,
  editEntryJamaat,
  duplicateEntryJamaat,
  deleteEntryJamaat,
}) => {
  return (
    <div>
        {editingIndexJamaat !== null && (
          <form
            onSubmit={(e) => {
              e.preventDefault();   // stop browser submit
              saveEntryJamaat();          // do your React save (which may close modal)
            }}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingIndexJamaat === -1 ? 'Add New Entry' : 'Edit Entry'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingIndexJamaat(null)}
                    className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jamaat Name *</label>
                    <input
                      type="text"
                      value={editFormJamaat.name}
                      onChange={(e) => setEditFormJamaat({ ...editFormJamaat, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                    <div key="Time">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        Time
                      </label>
                      <input
                        type="time"
                        value={editFormJamaat.time}
                        onChange={(e) => setEditFormJamaat({ ...editFormJamaat, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    // onClick={saveEntryJamaat}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndexJamaat(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Prayer Times Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Jamaat Times</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder="Search name"
                value={jamaatName}
                onChange={(e) => setJamaatName(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Prayer Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesJamaat.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No entries yet. Click "Add Entry" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredTimesJamaat.map((jamaat) => {
                    const jamaatName = jamaat.name; 
                    return (
                      <tr key={jamaatName} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{jamaat.name}</td>
                        <td className="px-4 py-3 text-gray-600">{jamaat.time || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntryJamaat(jamaatName)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEntryJamaat(jamaatName)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntryJamaat(jamaatName)}
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
      </div>
  );
};