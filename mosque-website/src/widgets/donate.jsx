import { Heart } from 'lucide-react';
import Strings from '../utils/Strings.json';

const pageStrings = Strings["donate"];

const DonateWidget = () => {

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        <Heart className="w-10 h-10 text-emerald-600 mr-3" />
        <h2 className="text-3xl font-bold text-emerald-800">{pageStrings.title}</h2>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-gray-700 text-lg text-center mb-8">
          {pageStrings.description}
        </p>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border-2 border-emerald-200">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">{pageStrings.bankTransferDetails}</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-emerald-200">
              <span className="font-semibold text-gray-700">{pageStrings.bankName}</span>
              <span className="text-gray-800">{pageStrings.bankDetails.bankName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-200">
              <span className="font-semibold text-gray-700">{pageStrings.accountName}</span>
              <span className="text-gray-800">{pageStrings.bankDetails.accountName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-200">
              <span className="font-semibold text-gray-700">{pageStrings.accountNumber}</span>
              <span className="text-gray-800 font-mono">{pageStrings.bankDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-200">
              <span className="font-semibold text-gray-700">{pageStrings.sortCode}</span>
              <span className="text-gray-800 font-mono">{pageStrings.bankDetails.sortCode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-200">
              <span className="font-semibold text-gray-700">{pageStrings.iban}</span>
              <span className="text-gray-800 font-mono text-sm">{pageStrings.bankDetails.iban}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-700">{pageStrings.swiftCode}</span>
              <span className="text-gray-800 font-mono">{pageStrings.bankDetails.swift}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-900 mb-2">{pageStrings.zakatTitle}</h4>
          <p className="text-gray-700">
            {pageStrings.zakatDescription}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-500">
          <p className="text-gray-700 italic text-center">{pageStrings.zakatDescription2}
          </p>
        </div>
      </div>
    </div>
  );
};
export default DonateWidget;