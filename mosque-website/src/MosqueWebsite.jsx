import { useState , useEffect } from 'react';
import JamaatTimesWidget from "./widgets/jamaat";
import PrayerTimesWidget from "./widgets/prayer_times";
import DonateWidget from "./widgets/donate";
import EventsWidget from "./widgets/events"
import InfoWidget from "./widgets/info"
import WelcomeMosqueWidget from "./widgets/welcome"
import Header from "./widgets/header"
import Footer from "./widgets/footer"
import ContactWidget from "./widgets/contact"
import {fetchPrayerTimes} from "./services/prayerService"
import {fetchJamaatTimes} from "./services/jamaatService"
import {fetchEvents} from "./services/eventService"
import { createPrayerData, getNextPrayer } from './utils/dictionary_utils';
import { isDev } from './env';

export default function MosqueWebsite() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeToEnd, setTimeToEnd] = useState({ hours: 0, minutes: 0, seconds: 0});
  const [nextPrayer, setNextPrayer] = useState("");
  const [activeTab, setActiveTab] = useState('home');
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

  useEffect(() => {
    if (!prayerData) return;

    try {
      const result = getNextPrayer(prayerData, currentTime);
      if (!result) return;

      setTimeToEnd(result.timeRemaining);
      setNextPrayer(result.nextPrayerName);
    } catch (err) {
      if (isDev) console.log(err);
    }
  }, [prayerData, currentTime]); 


  useEffect(() => {
    setPrayerData(createPrayerData());
    loadDataPrayerTimes();
    loadDataJamaat();
    loadDataEvents();
    console.log("load data called");
  }, []);

  const loadDataPrayerTimes = async () => {
    try {
      const data = await fetchPrayerTimes();
      // console.log(data);
      // console.log(prayerData);
      setPrayerData(prev => {
        if (!data) return prev;

        // Start with the previous state
        const next = { ...prev };

        // Loop over dates coming from the API
        Object.entries(data).forEach(([dateKey, apiDay]) => {
          // console.log(dateKey);
          // console.log(apiDay);
          // console.log(prev[dateKey]);
          // Only update if this date already exists in prev
          if (prev[dateKey]) {
            next[dateKey] = {
              ...apiDay,        // overwrite with new timings from API
            };
            // console.log(next[dateKey]);
          }
          // If date doesn't exist in prev, we just ignore it
        });

        return next;
      });

      // console.log(prayerData);
    } catch (err) {
      if (isDev) console.error(err);
      console.error("Failed to fetch prayer times:");
    }
  };

  const loadDataJamaat = async () => {
    try {
      const data = await fetchJamaatTimes();
      setJamaatData(data);
    } catch (err) {
      if (isDev) console.error(err);
    }
  };

  const loadDataEvents = async () => {
    try {
      const data = await fetchEvents();
      setEventsData(data);
    } catch (err) {
      if (isDev) console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header time = {currentTime} nextPrayer = {nextPrayer} timeToEnd = {timeToEnd}/>

      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:hidden">
            <span className="font-semibold text-emerald-700">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md border border-emerald-600 text-emerald-700">
              <span className="sr-only">Open main menu</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-5 bg-emerald-700"></span>
                <span className="block h-0.5 w-5 bg-emerald-700"></span>
                <span className="block h-0.5 w-5 bg-emerald-700"></span>
              </div>
            </button>
          </div>

          <div
            className={`
              flex flex-col space-y-2 pb-3
              ${isMobileMenuOpen ? "flex" : "hidden"}
              md:flex md:flex-row md:space-y-0 md:space-x-2 md:justify-center md:py-4
            `}>
            {["home", "jamaat times", "prayers", "events", "donate", "info", "contact"].map(tab => (
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
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        
        {activeTab === 'home' && (
          <div className="space-y-8">
            <WelcomeMosqueWidget/>
            {jamaatData &&
              Object.keys(jamaatData).length > 0 && (
                <JamaatTimesWidget jamaatData={jamaatData} />
              )}

            {prayerData &&
              Object.keys(prayerData).length > 0 && (
                <PrayerTimesWidget prayerData={prayerData} />
              )}

            {eventsData &&
              Object.keys(eventsData).length > 0 && (
                <EventsWidget eventsData={eventsData} />
              )}
          </div>
        )}

        {activeTab === 'jamaat times' && (
            <JamaatTimesWidget jamaatData={jamaatData} />
        )}

         {activeTab === 'prayers' && (
            <PrayerTimesWidget prayerData={prayerData} />
        )}
        
        {activeTab === 'events' && (
            <EventsWidget eventsData={eventsData} />
        )}

        {activeTab === 'donate' && (
            <DonateWidget/>
        )}

        {activeTab === 'info' && (
          <InfoWidget/>
        )}

        {activeTab === 'contact' && (
          <ContactWidget/>
        )}
      </main>

      <Footer/>
    </div>
  );
}