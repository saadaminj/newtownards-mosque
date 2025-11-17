
import { Calendar, Plus, Save, Download, Upload } from 'lucide-react';
export const AdminHeader = ({saveData, addNewEntry, downloadJSON, handleFileUpload, data, setInputJSON, inputJSON, importInputJSON}) => {
  return (
    <div>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-800">Mosque Admin Dashboard</h1>
            </div>
            {saveData && (<button
              type="button"
              onClick={saveData}
              className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>)}
          </div>
          {importInputJSON &&
          (<form
            onSubmit={(e) => {
              e.preventDefault();   // stop browser submit
              importInputJSON();          // do your React save (which may close modal)
            }}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 ">
              <div className='flex flex-wrap gap-2'>
                <label className=" text-sm font-medium text-gray-700 mb-2">Input JSON Data</label>
                <input
                  type="text"
                  value={inputJSON}
                  onChange={(e) => setInputJSON(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex"
                />
                {importInputJSON && (<button
                  type="submit"
                  onClick={importInputJSON}
                  className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-3"
                  >
                    <Save className="w-4 h-4" />
                    Import JSON input
                </button>)}
              </div>
            </div>
          </form>)}
          <div className="flex flex-wrap gap-3">
            {addNewEntry && 
              (<button
                type="button"
                onClick={addNewEntry}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>)}
            {downloadJSON && (<button
              onClick={downloadJSON}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </button>)}
            {handleFileUpload && (<label className="bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>)}
          </div>
            
          {data && 
            (<div className="mt-4 p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total Entries:</span> {Object.keys(data || {}).length} days
              </p>
            </div>)}
          </div>
    </div>
  );
};