import { BookOpen } from 'lucide-react';

const title = "Islamic Information";
const islamicInfo = [
    {
    title: 'Five Pillars of Islam',
    content: 'Shahada (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), Hajj (Pilgrimage)'
    },
    {
    title: 'Friday Prayer (Jummah)',
    content: 'Jummah is obligatory for Muslim men. It replaces Dhuhr prayer on Fridays and includes a sermon (khutbah).'
    },
    {
    title: 'Wudu (Ablution)',
    content: 'Ritual purification required before prayer. Wash hands, mouth, nose, face, arms, head, and feet.'
    },
    {
    title: 'Importance of Prayer',
    content: 'Prayer is the second pillar of Islam and the first thing we will be questioned about on the Day of Judgment.'
    }
];
const InfoWidget = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">{title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {islamicInfo.map((info, index) => (
                <div key={index} className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border-2 border-emerald-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-emerald-800 mb-3">{info.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{info.content}</p>
                </div>
              ))}
            </div>
        </div>
    );
};

export default InfoWidget