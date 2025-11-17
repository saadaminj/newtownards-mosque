import { Heart } from 'lucide-react';

const title = "Support Our Mosque";
const description = "Your donations help maintain our mosque, support community programs, and serve those in need. \
                May Allah reward your generosity.";
const bankTransferDetails = "Bank Transfer Details";
const bankName = "Bank Name:";
const accountName = "Account Name:";
const accountNumber = "Account Number:";
const sortCode = "Sort Code:";
const iban = "IBAN:";
const swiftCode = "SWIFT/BIC:"

const zakatTitle = "Zakat & Sadaqah";
const zakatDescription = "We accept Zakat, Sadaqah, and general donations. Please specify the type of donation in your transfer reference."
const zakatDescription2 = '"The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; \
                  in each spike is a hundred grains." - Quran 2:261';

const bankDetails = {
    bankName: 'Islamic Community Bank',
    accountName: 'Central Mosque Trust',
    accountNumber: '1234567890',
    sortCode: '12-34-56',
    iban: 'GB29 NWBK 1234 5612 3456 78',
    swift: 'NWBKGB2L'
};

const DonateWidget = () => {

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">{title}</h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-gray-700 text-lg text-center mb-8">
                {description}
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border-2 border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">{bankTransferDetails}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">{bankName}</span>
                    <span className="text-gray-800">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">{accountName}</span>
                    <span className="text-gray-800">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">{accountNumber}</span>
                    <span className="text-gray-800 font-mono">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">{sortCode}</span>
                    <span className="text-gray-800 font-mono">{bankDetails.sortCode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">{iban}</span>
                    <span className="text-gray-800 font-mono text-sm">{bankDetails.iban}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-700">{swiftCode}</span>
                    <span className="text-gray-800 font-mono">{bankDetails.swift}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">{zakatTitle}</h4>
                <p className="text-gray-700">
                  {zakatDescription}
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-500">
                <p className="text-gray-700 italic text-center">{zakatDescription2}
                </p>
              </div>
            </div>
        </div>
    );
};
export default DonateWidget;