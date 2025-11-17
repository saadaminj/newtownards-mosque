const title = "Welcome to Our Mosque";
const description = "A place of worship, learning, and community. We welcome all Muslims and those interested in learning about Islam.\
            Join us for daily prayers, Islamic education, and community events.";

const WelcomeMosqueWidget = () => {
  return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">{title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
            {description}
            </p>
        </div>
    );
};

export default WelcomeMosqueWidget;