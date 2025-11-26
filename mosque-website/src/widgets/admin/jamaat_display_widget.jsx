import { Edit2, Search, Trash2, Copy } from 'lucide-react';
import Strings from '../../utils/admin/Strings.json';

export const JamaatDisplayWidget = ({
  jamaatName,
  setJamaatName,
  filteredTimes,
  editEntry,
  duplicateEntry,
  deleteEntry,
}) => {
  const pageStrings = Strings["jamaat_display"];
  return (
    <div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{pageStrings.title}</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder={pageStrings.search_name}
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.prayer_time}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{pageStrings.time}</th>
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
                  filteredTimes?.map((jamaat) => {
                    const jamaatName = jamaat.name; 
                    return (
                      <tr key={jamaatName} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{jamaat.name}</td>
                        <td className="px-4 py-3 text-gray-600">{jamaat.time || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntry(jamaatName)}
                              className="text-blue-600 hover:text-blue-800"
                              title= {pageStrings.edit}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEntry(jamaatName)}
                              className="text-green-600 hover:text-green-800"
                              title= {pageStrings.duplicate}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntry(jamaatName)}
                              className="text-red-600 hover:text-red-800"
                              title= {pageStrings.delete}
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