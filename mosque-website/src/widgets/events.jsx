import { Calendar } from 'lucide-react';
import Strings from '../utils/Strings.json';

const EventsWidget = ({ eventsData }) => {
  const pageStrings = Strings["events"];

  if (!eventsData || Object.keys(eventsData).length === 0) {
    return (
      <div className="flex items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-4 px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-4xl"><img
                src="/mosque_logo.svg"
                alt="Mosque logo"
                className=""
              /></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900 text-center">
            {pageStrings.no_event_display}
          </h2>
          <p className="text-base md:text-lg text-emerald-700 text-center max-w-xl">
            {/* Add a new event to see it appear here in your mosque events schedule. */}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        <Calendar className="w-10 h-10 text-emerald-600 mr-3" />
        <h2 className="text-3xl font-bold text-emerald-800">{pageStrings.title}</h2>
      </div>
      <div className="space-y-4 max-w-2xl mx-auto">
        {Object.entries(eventsData).map(([events, value]) => (
          <div key={events} className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-emerald-800">{events}</h3>
              {value.time && (<span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {value.time}
              </span>)}
            </div>
            <p className="text-gray-600 font-semibold">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsWidget;