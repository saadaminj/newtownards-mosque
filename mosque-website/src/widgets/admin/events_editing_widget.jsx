import { X } from 'lucide-react';
export const EventsEditingWidget = ({saveEntry, editingIndex, setEditingIndex, editForm, setEditForm, formErrors, setFormErrors}) => {
    return (
        <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEntry();
            }}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingIndex === -1 ? 'Add New Entry' : 'Edit Entry'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setFormErrors();
                    }}
                    className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                    <input
                      type="text"
                      disabled= {editingIndex !== null && editingIndex !== -1}
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                    <div key="Description">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div key="Time">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        Time
                      </label>
                      <input
                        type="time"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setFormErrors();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
                {formErrors && (
                  <p className="mt-1 text-sm text-red-600 block">
                    {formErrors}
                  </p>
                )}
              </div>
            </div>
          </form>
    );
}
        