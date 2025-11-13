import {MapPin, Phone, Mail } from 'lucide-react';

const title = "Contact Us";
const address = {
  Address: "address",
  street: "123 Community Street",
  city: "London, UK",
  postcode:"Postal Code: SW1A 1AA"
};
const phone = {
  Phone:"Phone",
  number: "+44 20 1234 5678",
}
const email ={
  Email: "Email",
  emailaddress: "info@centralmosque.org"
}
const openingHours = {
  OpeningHours: "Opening Hours",
  1: ["Daily:"," Opens 30 minutes before Fajr, Closes after Isha"],
  2: ["Friday:"," Opens early for Jummah preparation"],
  3: ["Office Hours:"," Monday - Friday, 9:00 AM - 5:00 PM"]
}
const ContactWidget = () => {
  return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">{title}</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{address.Address}</h3>
                </div>
                <p className="text-gray-700 ml-9">
                  {address.street}<br />
                  {address.city}<br />
                  {address.postcode}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{phone.Phone}</h3>
                </div>
                <p className="text-gray-700 ml-9">{phone.number}</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{email.Email}</h3>
                </div>
                <p className="text-gray-700 ml-9">{email.emailaddress}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-3">{openingHours.OpeningHours}</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>{openingHours[1][0]}</strong>{openingHours[1][1]}</p>
                  <p><strong>{openingHours[2][0]}</strong>{openingHours[2][1]}</p>
                  <p><strong>{openingHours[2][0]}</strong>{openingHours[2][1]}</p>
                </div>
              </div>
            </div>
        </div>
  );
};

export default ContactWidget;