import {MapPin, Phone, Mail } from 'lucide-react';
import Strings from '../utils/Strings.json';

const ContactWidget = () => {
  const pageStrings = Strings["contact"];
  return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">{pageStrings.title}</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{pageStrings.address}</h3>
                </div>
                <p className="text-gray-700 ml-9">
                  {pageStrings.street}<br />
                  {pageStrings.city}<br />
                  {pageStrings.postcode}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{pageStrings.phone}</h3>
                </div>
                <p className="text-gray-700 ml-9">{pageStrings.number}</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{pageStrings.email}</h3>
                </div>
                <p className="text-gray-700 ml-9">{pageStrings.emailaddress}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-3">{pageStrings.openingHours}</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>{pageStrings.daily[0]}</strong>{pageStrings.daily[1]}</p>
                  <p><strong>{pageStrings.friday[0]}</strong>{pageStrings.friday[1]}</p>
                  <p><strong>{pageStrings.office_hours[0]}</strong>{pageStrings.office_hours[1]}</p>
                </div>
              </div>
            </div>
        </div>
  );
};

export default ContactWidget;