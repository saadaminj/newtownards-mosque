import Strings from "../utils/Strings.json";
const pageStrings = Strings["welcome"];

const WelcomeMosqueWidget = () => {
  return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">{pageStrings.title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
            {pageStrings.description}
            </p>
        </div>
    );
};

export default WelcomeMosqueWidget;