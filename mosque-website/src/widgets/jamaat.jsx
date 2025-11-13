import { Clock } from "lucide-react";

const title = "Today's Jamaat Time";

const JamaatTimesWidget = ({ jamaatData }) => {
  if (!jamaatData || Object.keys(jamaatData).length === 0) {
    return null; 
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white">
      <div className="flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 mr-3" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(jamaatData).map(([name, value]) => (
          <div
            key={name}
            className="bg-white/10 backdrop-blur rounded-lg p-4 text-center"
          >
            <div className="font-bold text-lg">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </div>
            <div className="text-2xl font-mono mt-2">
              {value.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JamaatTimesWidget;