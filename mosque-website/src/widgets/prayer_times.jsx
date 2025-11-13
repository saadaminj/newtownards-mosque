import { useState } from 'react';
import { Clock , ChevronLeft, ChevronRight } from "lucide-react";

const title = "Prayer Times";
const GoToTodayText = "Go to Today";
const minus30 = "-30 days";
const minus7 = "-7 days";
const plus30 = "+30 days";
const plus7 = "+7 days";
const noteTitle = "Note:";
const noteDescription = "Prayer times are calculated based on astronomical data. \
                Jamaah (congregation) starts 10-15 minutes after the Adhan (call to prayer)."
const PrayerTimesWidget = ({ prayerData }) => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const defaultTimings = {
        fajr: "05:16",
        sunrise: "06:54",
        dhuhr: "13:29",
        asr: "17:00",
        maghrib: "20:02",
        isha: "21:34",
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const getDateKey = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getCurrentPrayerTimes = () => {
        return prayerData[getDateKey(selectedDate)] || prayerData[getDateKey(new Date())] || defaultTimings;
    };
    
    const prayerTimes = getCurrentPrayerTimes();
    

    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
        return null; // or return a "No data" message if you prefer
    }
    

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Clock className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">{title}</h2>
            </div>

            {/* Date Selector */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => changeDate(-1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-800">
                      {selectedDate.toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    {selectedDate.toDateString() !== new Date().toDateString() && (
                      <button
                        onClick={goToToday}
                        className="mt-2 text-emerald-600 hover:text-emerald-700 font-semibold underline">
                        {GoToTodayText}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => changeDate(1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => changeDate(-7)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    {minus7}
                  </button>
                  <button
                    onClick={() => changeDate(-30)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    {minus30}
                  </button>
                  <button
                    onClick={() => changeDate(30)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    {plus30}
                  </button>
                  <button
                    onClick={() => changeDate(7)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    {plus7}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {Object.entries(prayerTimes).map(([name, time]) => (
                <div key={name} className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-50 to-white rounded-lg border-l-4 border-emerald-600 hover:shadow-md transition-shadow">
                  <span className="text-xl font-bold text-gray-800">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                  <span className="text-2xl font-mono text-emerald-700">{time}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500 max-w-2xl mx-auto">
              <p className="text-gray-700">
                <strong>{noteTitle}</strong> {noteDescription}
              </p>
            </div>
          </div>
  );
};


export default PrayerTimesWidget;