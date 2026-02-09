
import { Calendar, Plus, Save, Download, Upload, Copy } from 'lucide-react';
import Strings from '../../utils/admin/Strings.json';
export const AdminHeader = ({saveData, addNewEntry, downloadJSON, handleFileUpload, data, setInputJSON, inputJSON, importInputJSON, copyPromptText}) => {
  const pageStrings = Strings["header"];
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {pageStrings.title}
            </h1>
          </div>

          {saveData && (
            <button
              type="button"
              onClick={saveData}
              className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {pageStrings.save_changes}
            </button>
          )}
        </div>
        {importInputJSON &&
        (<form
          onSubmit={(e) => {
            e.preventDefault();   // stop browser submit
            importInputJSON();          // do your React save (which may close modal)
          }}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 ">
            <div className='flex flex-wrap gap-2'>
              <label className=" text-sm font-medium text-gray-700 mb-2">{pageStrings.input_json}</label>
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
                  {pageStrings.import_json_input}
              </button>)}
              {copyPromptText && (<button
                type="button"
                onClick={copyPromptText}
                className="bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  {pageStrings.copy_prompt}
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
              {pageStrings.add_entry}
            </button>)}
          {downloadJSON && (<button
            onClick={downloadJSON}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {pageStrings.export_json}
          </button>)}
          {handleFileUpload && (<label className="bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            {pageStrings.import_json}
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
              <span className="font-semibold">{pageStrings.total_entries}</span> {Object.keys(data || {}).length} {pageStrings.days}
            </p>
          </div>)}
        </div>
    </div>
  );
};