import React, { useState,useCallback , useEffect } from 'react';
import { Clock, Heart, BookOpen, Calendar, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
export default function MosqueWebsite() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prayerData, setPrayerData] = useState([]);
  const [jamaatData, setJamaatData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(() => {
    loadDataPrayerTimes();
    loadDataJamaat();
    loadDataEvents();
  }, []);

  // 3) Data loading effect – also runs once on mount
  useEffect(() => {
    loadData();
  }, [loadData]);



  const loadDataPrayerTimes = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/prayer_times");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const byDate = data.reduce((acc, row) => {
        acc[row.date] = {
          fajr: row.fajr,
          sunrise: row.sunrise,
          dhuhr: row.dhuhr,
          asr: row.asr,
          maghrib: row.maghrib,
          isha: row.isha,
        };
        return acc;
      }, {});

      setPrayerData(byDate);
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  };

  const loadDataJamaat = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/jamaat");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const byName = data.reduce((acc, row) => {
        acc[row.name] = {
          time: row.time,
        };
        return acc;
      }, {});

      setJamaatData(byName);
    } catch (error) {
      console.error("Failed to fetch jamaat times:", error);
    }
  };

  const loadDataEvents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const byName = data.reduce((acc, row) => {
        acc[row.name] = {
          description: row.description,
          time: row.time,
        };
        return acc;
      }, {});

      setEventsData(byName);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };
  
  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getCurrentPrayerTimes = () => {
    return prayerData[getDateKey(selectedDate)] || prayerData[getDateKey(new Date())] || defaultTimings;
  };
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

  const prayerTimes = getCurrentPrayerTimes();

  const bankDetails = {
    bankName: 'Islamic Community Bank',
    accountName: 'Central Mosque Trust',
    accountNumber: '1234567890',
    sortCode: '12-34-56',
    iban: 'GB29 NWBK 1234 5612 3456 78',
    swift: 'NWBKGB2L'
  };

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

  const MosqueIcon = () => (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L26 18H38L32 8Z" fill="currentColor"/>
      <rect x="30" y="2" width="4" height="6" fill="currentColor"/>
      <circle cx="32" cy="3" r="2" fill="currentColor"/>
      <path d="M10 28C10 24 14 20 18 20C22 20 26 24 26 28V48H10V28Z" fill="currentColor"/>
      <path d="M38 28C38 24 42 20 46 20C50 20 54 24 54 28V48H38V28Z" fill="currentColor"/>
      <rect x="14" y="48" width="36" height="14" rx="1" fill="currentColor"/>
      <rect x="28" y="32" width="8" height="16" fill="white"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-2">
            <MosqueIcon />
            <h1 className="text-4xl font-bold ml-4">Newtownards Islamic Cultural Centre</h1>
          </div>
          <p className="text-center text-emerald-100 text-lg">Peace be upon you - As-Salamu Alaikum</p>
          <div className="text-center mt-4 text-emerald-100 font-mono text-xl">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
  <div className="container mx-auto px-4">
    {/* Top row: brand + hamburger on mobile */}
    <div className="flex items-center justify-between py-3 md:hidden">
      <span className="font-semibold text-emerald-700">
        Menu
      </span>
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
        className="inline-flex items-center justify-center p-2 rounded-md border border-emerald-600 text-emerald-700"
      >
        {/* Simple hamburger icon */}
        <span className="sr-only">Open main menu</span>
        <div className="space-y-1">
          <span className="block h-0.5 w-5 bg-emerald-700"></span>
          <span className="block h-0.5 w-5 bg-emerald-700"></span>
          <span className="block h-0.5 w-5 bg-emerald-700"></span>
        </div>
      </button>
    </div>

    {/* Menu items */}
    <div
      className={`
        flex flex-col space-y-2 pb-3
        ${isMobileMenuOpen ? "flex" : "hidden"}
        md:flex md:flex-row md:space-y-0 md:space-x-2 md:justify-center md:py-4
      `}
    >
      {["home", "prayers", "donate", "info", "events", "contact"].map(tab => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false); // close menu on select (mobile)
          }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeTab === tab
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-emerald-100"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  </div>
</nav>


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-emerald-800 mb-4">Welcome to Our Mosque</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                A place of worship, learning, and community. We welcome all Muslims and those interested in learning about Islam.
                Join us for daily prayers, Islamic education, and community events.
              </p>
            </div>

            {/* Quick Prayer Times */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">Today's Jamaat Time</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(jamaatData).map(([name, value]) => (
                  <div key={name} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="font-bold text-lg">{name}</div>
                    <div className="text-2xl font-mono mt-2">{value.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prayers Tab */}
        {activeTab === 'prayers' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Clock className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">Prayer Times</h2>
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
                        className="mt-2 text-emerald-600 hover:text-emerald-700 font-semibold underline"
                      >
                        Go to Today
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
                    -7 days
                  </button>
                  <button
                    onClick={() => changeDate(-30)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    -30 days
                  </button>
                  <button
                    onClick={() => changeDate(30)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    +30 days
                  </button>
                  <button
                    onClick={() => changeDate(7)}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                  >
                    +7 days
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
                <strong>Note:</strong> Prayer times are calculated based on astronomical data. 
                Jamaah (congregation) starts 10-15 minutes after the Adhan (call to prayer).
              </p>
            </div>
          </div>
        )}

        {/* Donate Tab */}
        {activeTab === 'donate' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">Support Our Mosque</h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-gray-700 text-lg text-center mb-8">
                Your donations help maintain our mosque, support community programs, and serve those in need. 
                May Allah reward your generosity.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border-2 border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">Bank Transfer Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">Bank Name:</span>
                    <span className="text-gray-800">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">Account Name:</span>
                    <span className="text-gray-800">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">Account Number:</span>
                    <span className="text-gray-800 font-mono">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">Sort Code:</span>
                    <span className="text-gray-800 font-mono">{bankDetails.sortCode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-200">
                    <span className="font-semibold text-gray-700">IBAN:</span>
                    <span className="text-gray-800 font-mono text-sm">{bankDetails.iban}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-700">SWIFT/BIC:</span>
                    <span className="text-gray-800 font-mono">{bankDetails.swift}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">Zakat & Sadaqah</h4>
                <p className="text-gray-700">
                  We accept Zakat, Sadaqah, and general donations. Please specify the type of donation in your transfer reference.
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-500">
                <p className="text-gray-700 italic text-center">
                  "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; 
                  in each spike is a hundred grains." - Quran 2:261
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">Islamic Information</h2>
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
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Calendar className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">Events & Programs</h2>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              {Object.entries(eventsData).map(([events, value]) => (
                <div key={events} className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-emerald-800">{events}</h3>
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {value.description}
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold">{value.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-3xl font-bold text-emerald-800">Contact Us</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Address</h3>
                </div>
                <p className="text-gray-700 ml-9">
                  123 Community Street<br />
                  London, UK<br />
                  Postal Code: SW1A 1AA
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Phone</h3>
                </div>
                <p className="text-gray-700 ml-9">+44 20 1234 5678</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-lg border-l-4 border-emerald-600">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-700 ml-9">info@centralmosque.org</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-3">Opening Hours</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Daily:</strong> Opens 30 minutes before Fajr, Closes after Isha</p>
                  <p><strong>Friday:</strong> Opens early for Jummah preparation</p>
                  <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">Central Community Mosque</p>
          <p className="text-emerald-200">Serving the community with faith and compassion</p>
          <p className="text-emerald-300 mt-4 text-sm">
            © 2024 Central Community Mosque. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}