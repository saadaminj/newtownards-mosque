import { useState, useEffect } from 'react';
import { JamaatDisplayWidget } from './widgets/admin/jamaat_display_widget';
import { JamaatEditingWidget } from './widgets/admin/jamaat_editing_widget';
import { AdminHeader } from './widgets/admin/header';
import { PrayerEditingWidget } from './widgets/admin/prayer_editing_widget';
import { EventsEditingWidget } from './widgets/admin/events_editing_widget';
import { PrayerDisplayWidget } from './widgets/admin/prayer_display_widget';
import { EventsDisplayWidget } from './widgets/admin/events_display_widget';
import { LoginWidget } from './widgets/admin/login';
import { fetchPrayerTimes, savePrayerTimes, deletePrayer } from './services/prayerService';
import { deleteJamaat, fetchJamaatTimes, saveJamaatTimes } from './services/jamaatService';
import { deleteEvent, fetchEvents, saveEvents } from './services/eventService';
import { login, logout, me } from './services/passwordService';
import { isDev } from './env';

export default function MosqueAdminDashboard() {
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputJSON, setInputJSON] = useState("");
  const [activeTab, setActiveTab] = useState('prayers');
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [prayerData, setPrayerData] = useState([]);
  const [jamaatData, setJamaatData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [prayerEditingIndex, setPrayerEditingIndex] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [jamaatName, setJamaatName] = useState('');
  const [searchEventName, setSearchEventName] = useState('');
  const [eventsFormErrors, setEventsFormErrors] = useState('');
  const [jamaatFormErrors, setJamaatFormErrors] = useState('');
  const [prayerFormErrors, setPrayerFormErrors] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showLoading, setShowLoading] = useState(true);
  const [editFormPrayers, setEditFormPrayers] = useState({
    date: '',
    fajr: '',
    sunrise: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: ''
  });

  const TEXT_REGEX = /^[a-zA-Z0-9 ]*$/;
  const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  
  const [editingIndexJamaat, setEditingIndexJamaat] = useState(null);
  const [editFormJamaat, setEditFormJamaat] = useState({
    name: '',
    time:''
  });

  const [editingIndexEvents, setEditingIndexEvents] = useState(null);
  const [editFormEvents, setEditFormEvents] = useState({
    name: '',
    description: '',
    time:''
  });

  async function authenticate(){
    try { 
      await me();
      setIsAuthenticated(true); 
      setShowLoading(false); 
      loadData();
    } catch (error){
      if(isDev) console.log(error); 
      setIsAuthenticated(false); 
      setShowLoading(false); 
    } 
  }

  useEffect(() => { 
    if (!isAuthenticated){ 
      authenticate();
    } 
  });

  const loadData = async () => {
    loadDataPrayerTimes();
    loadDataJamaat();
    loadDataEvents();
  }

  const loadDataPrayerTimes = async () => {
    try {
      const data = await fetchPrayerTimes();
      setPrayerData(data);
      setFilteredTimes(prayerData);
    } catch (error) {
      if(isDev) console.error("Failed to fetch prayer times:", error);
    }
  };

  const loadDataJamaat = async () => {
    try {
      const data = await fetchJamaatTimes();
      setJamaatData(data);
    } catch (error) {
      if(isDev) console.error("Failed to fetch jamaat times:", error);
    }
  };

  const loadDataEvents = async () => {
    try {
      const data = await fetchEvents();
      setEventsData(data);
    } catch (error) {
      if(isDev) console.error("Failed to fetch events:", error);
    }
  };

  async function handleLogout() {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch(error){
      if(isDev) console.log(error);
      alert(error);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const response = await login({password: passwordInput});

      if (response.isMatch) {
        setIsAuthenticated(true);
        loadData();
        setPasswordError('');
        setPasswordInput('');
      } else if(response.password) {
        setNewPassword(response.password);
      } else {
        alert("Wrong Password");
      }
    } catch(error){
      if(isDev) console.log(error);
      alert(error);
    }
  }
    

  const saveData = async () => {
    try {
      await savePrayerTimes(prayerData);
      alert('Prayer times saved successfully! Other pages can now access this data.');
    } catch (error) {
      if(isDev) console.log(error);
      alert(error);
    }
  };

  const saveDataJamaat = async () => {
    try {
      await saveJamaatTimes(jamaatData);
      alert('Jamaat times saved successfully! Other pages can now access this data.');
    } catch (error){
      if(isDev) console.log(error);
      alert('Failed to save data');
    }
  };

  const saveDataEvents = async () => {
    try {
      await saveEvents(eventsData);
      alert('Events saved successfully! Other pages can now access this data.');
    } catch (error){
      if(isDev) console.log(error);
      alert('Failed to save data');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setPrayerData(imported);
          setFilteredTimes(prayerData);
          alert('Data imported successfully!');
        } catch (error) {
          if(isDev) console.log(error);
          alert('Invalid JSON file',error);
        }
      };
      reader.readAsText(file);
    }
  };

  const importInputJSON = () => {
    let number = 0;
    if (inputJSON.length === 0) return;
    try {
      const imported = JSON.parse(inputJSON);

      let newPrayerData = { ...prayerData };

      for (const [date, newTimes] of Object.entries(imported)) {

        if (!DATE_REGEX.test(date)){
          number += 1;
          continue;
        }
        if (!TIME_REGEX.test(newTimes.fajr) || !TIME_REGEX.test(newTimes.sunrise) || !TIME_REGEX.test(newTimes.dhuhr) 
          || !TIME_REGEX.test(newTimes.asr) || !TIME_REGEX.test(newTimes.isha)){
          number += 1;
          continue;
        }
        newPrayerData[date] = {
          ...(newPrayerData[date] || {}),
          ...newTimes,
        };
      }

      newPrayerData = Object.entries(newPrayerData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0])) // a[0], b[0] are the date keys
      .reduce((acc, [date, times]) => {
        acc[date] = times;
        return acc;
      }, {});

      setPrayerData(newPrayerData);
      setFilteredTimes(newPrayerData);
      console.log(prayerData);
      console.log(filteredTimes);
      setInputJSON("");
      if(number > 0){
        alert("Some rows can't be inserted due to validation errors: "+number);
      }
      else alert('Data imported successfully!');
    } catch (error) {
      if(isDev) console.log(error);
      alert('Invalid JSON input',error);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(prayerData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prayer-times-${prayerData.year}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addNewEntry = () => {
    setPrayerEditingIndex(-1);
    setEditFormPrayers({
      date: '',
      fajr: '',
      sunrise: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: ''
    });
  };

  const editEntry = (index) => {
    setPrayerEditingIndex(index);
    setEditFormPrayers({date:index,...prayerData[index]});
  };

  const saveEntry = () => {
    if (!editFormPrayers.date) {
      alert('Date is required');
      return;
    }
    
    if (!DATE_REGEX.test(editFormPrayers.date)) {
      setPrayerFormErrors("Please enter a valid date");
      return;
    }
    else if (
      (editFormPrayers.fajr && !TIME_REGEX.test(editFormPrayers.fajr)) ||
      (editFormPrayers.sunrise && !TIME_REGEX.test(editFormPrayers.sunrise)) ||
      (editFormPrayers.dhuhr && !TIME_REGEX.test(editFormPrayers.dhuhr)) ||
      (editFormPrayers.asr && !TIME_REGEX.test(editFormPrayers.asr)) ||
      (editFormPrayers.isha && !TIME_REGEX.test(editFormPrayers.isha))
    ) {
      setPrayerFormErrors("Time can only contain numbers");
      return;
    }

    let newTimes = {...prayerData};

    newTimes[editFormPrayers.date] = {
      fajr: editFormPrayers.fajr,
      sunrise: editFormPrayers.sunrise,
      dhuhr: editFormPrayers.dhuhr,
      asr: editFormPrayers.asr,
      maghrib: editFormPrayers.maghrib,
      isha: editFormPrayers.isha
    };

    // sort entries, then build a NEW object in order
    newTimes = Object.entries(newTimes)
      .sort((a, b) => new Date(a[0]) - new Date(b[0])) // a[0], b[0] are the date keys
      .reduce((acc, [date, times]) => {
        acc[date] = times;
        return acc;
      }, {});

    setPrayerData(newTimes);
    setFilteredTimes(prayerData);
    setPrayerEditingIndex(null);
  };

  const deleteEntry = async (index) =>  {
    if (confirm('Delete this entry?')) {
      
      try{
        await deletePrayer(index);
        setPrayerData(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
        setFilteredTimes(prayerData);
      } catch (err) {
        if(String(err).includes("This entry does not exist in Database")){
          setPrayerData(prev => {
            const updated = { ...prev };
            delete updated[index]; 
            return updated;
          });
          setFilteredTimes(prayerData);
        }
        // console.error("Network or JSON error:", err);
        alert(err);
      }
    }
  };

  const duplicateEntry = (index) => {
    const entry = { ...prayerData[index] };
    setPrayerEditingIndex(-1);
    setEditFormPrayers(entry);
  };

  const addNewEntryJamaat = () => {
    setEditingIndexJamaat(-1);
    setEditFormJamaat({
      name: '',
      time: ''
    });
  };

  const editEntryJamaat = (index) => {
    setEditingIndexJamaat(index);
    setEditFormJamaat({name:index,...jamaatData[index]});
  };

  const saveEntryJamaat = () => {
    if (!editFormJamaat || !editFormJamaat.name || editFormJamaat.name.trim().length === 0) {
      alert("Name is required");
      return;
    }

    if (!TEXT_REGEX.test(editFormJamaat.name)) {
      setJamaatFormErrors("Jamaat name can contain only letters, numbers, and spaces.");
      return;
    }
    else if (!TIME_REGEX.test(editFormJamaat.time)) {
      setJamaatFormErrors("Jamaat time can not be empty and must contain only numbers");
      return;
    }

    let newJamaat = {...jamaatData};

    newJamaat[editFormJamaat.name] = {
      time: editFormJamaat.time,
    };

    newJamaat = Object.entries(newJamaat)
      .sort(([, aVal], [, bVal]) => {
        const aTime = aVal?.time || "";
        const bTime = bVal?.time || "";
        return toMinutes24(aTime) - toMinutes24(bTime); // ascending
      })
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {});

    setJamaatData(newJamaat);
    setEditingIndexJamaat(null);
  };

  function toMinutes24(t) {
    if (!t) return Number.POSITIVE_INFINITY;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  const deleteEntryJamaat = async (index) =>  {
    if (confirm('Delete this entry?')) {
      try{
        await deleteJamaat(index);
        setJamaatData(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
      } catch (err){
        if(String(err).includes("This entry does not exist in Database")){
          setJamaatData(prev => {
            const updated = { ...prev };
            delete updated[index]; 
            return updated;
          });
        }
        // console.error("Network or JSON error:", err);
        alert(err);
      }
    }
  };

  const duplicateEntryJamaat = (index) => {
    setEditingIndexJamaat(-1);
    setEditFormJamaat({name:index,...jamaatData[index]});
  };

  const addNewEntryEvents = () => {
    setEditingIndexEvents(-1);
    setEditFormEvents({
      name: '',
      description:'',
      time: ''
    });
  };

  const editEntryEvents = (index) => {
    setEditingIndexEvents(index);
    setEditFormEvents({name:index,...eventsData[index]});
  };

  const saveEntryEvents = () => {
    if (!editFormEvents || !editFormEvents.name || editFormEvents.name.trim().length === 0) {
      alert("Name is required");
      return;
    }

    if (!TEXT_REGEX.test(editFormEvents.name)) {
      setEventsFormErrors("Event name can contain only letters, numbers, and spaces.");
      return;
    }
    else if (!TEXT_REGEX.test(editFormEvents.description)) {
      setEventsFormErrors("Event description can contain only letters, numbers, and spaces.");
      return;
    }
    else if (editFormEvents.time && !TIME_REGEX.test(editFormEvents.time)) {
      setEventsFormErrors("Event time can contain only letters, numbers, and spaces.");
      return;
    }

    let newEvent = {...eventsData};

    newEvent[editFormEvents.name] = {
      description: editFormEvents.description,
      time: editFormEvents.time,
    };

    newEvent = Object.entries(newEvent)
      .sort(([, aVal], [, bVal]) => {
        const aTime = aVal?.time || "";
        const bTime = bVal?.time || "";
        return toMinutes24(aTime) - toMinutes24(bTime); // ascending
      })
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {});

    setEventsData(newEvent);
    setEditingIndexEvents(null);
  };

  const deleteEntryEvents = async (index) =>  {
    if (confirm('Delete this entry?')) {
      
      try{
        await deleteEvent(index);

        setEventsData(prev => {
          const updated = { ...prev };
          delete updated[index]; 
          return updated;
        });
      } catch (err) {
        if(String(err).includes("This entry does not exist in Database")){
          setEventsData(prev => {
            const updated = { ...prev };
            delete updated[index]; 
            return updated;
          });
        }
        // console.error("Network or JSON error:", err);
        alert(err);
      }
    }
  };

  const duplicateEntryEvents = (index) => {
    setEditingIndexEvents(-1);
    setEditFormEvents({name:index,...eventsData[index]});
  };

  useEffect(() => {
    const entries = Object.entries(prayerData || {}); // <- source data

    const result = entries
      .filter(([key]) =>
        !searchDate ? true : key.toLowerCase().includes(searchDate.toLowerCase())
      )
      .map(([key, value]) => ({ date: key, ...value }));

    setFilteredTimes(result);
  }, [searchDate, prayerData]);



  let filteredTimesJamaat = jamaatData ? Object.entries(jamaatData) : [];

  filteredTimesJamaat = filteredTimesJamaat
  .filter(([key]) =>
    !jamaatName ? true : key.toLowerCase().includes(jamaatName.toLowerCase())
  )
  .sort(([, aVal], [, bVal]) => {
    const aTime = aVal?.time || "";
    const bTime = bVal?.time || "";
    return toMinutes24(aTime) - toMinutes24(bTime);
  })
  .map(([key, value]) => ({ name: key, ...value }));

  let filteredTimesEvents = eventsData ? Object.entries(eventsData) : [];

  filteredTimesEvents = filteredTimesEvents
    .filter(([key]) =>
      !searchEventName
        ? true
        : key.toLowerCase().includes(searchEventName.toLowerCase())
    )
    .sort(([, aVal], [, bVal]) => {
      const aTime = aVal?.time || "";
      const bTime = bVal?.time || "";
      return toMinutes24(aTime) - toMinutes24(bTime);
    })
    .map(([key, value]) => ({
      name: value?.name || key, 
      time: value?.time || "",
      description: value?.description || "",
    }));
  if (showLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginWidget 
        handleLogin = {handleLogin} 
        handleLogout = {handleLogout}
        passwordInput = {passwordInput}
        setPasswordInput = {setPasswordInput}
        passwordError= {passwordError}
        newPassword= {newPassword}
        setNewPassword={setNewPassword}/>
      );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <nav className="max-w-7xl mx-auto bg-white shadow-md sticky top-0 z-10 mb-4 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1 flex justify-center space-x-2 flex-wrap">
              {['prayers', 'jamaat', 'events'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3-3m0 0l3 3m-3-3v12"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {activeTab === 'prayers' && (
        <div className="max-w-7xl mx-auto">
        
        <AdminHeader 
          saveData = {saveData} 
          addNewEntry = {addNewEntry} 
          downloadJSON = {downloadJSON} 
          handleFileUpload = {handleFileUpload} 
          data = {prayerData}
          inputJSON={inputJSON}
          importInputJSON={importInputJSON}
          setInputJSON={setInputJSON}
        />

        {prayerEditingIndex !== null && (
          <PrayerEditingWidget 
          saveEntry = {saveEntry} 
          editingIndex = {prayerEditingIndex}
          setEditingIndex = {setPrayerEditingIndex} 
          editForm = {editFormPrayers} 
          setEditForm = {setEditFormPrayers}
          formErrors = {prayerFormErrors}
          setFormErrors = {setPrayerFormErrors}/>
        )}
        <PrayerDisplayWidget 
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          filteredTimes = {filteredTimes} 
          editEntry = {editEntry}
          duplicateEntry = {duplicateEntry} 
          deleteEntry = {deleteEntry}/>
      </div>)}
      {activeTab === 'jamaat' && (
        <div>
          <AdminHeader saveData={saveDataJamaat} addNewEntry={addNewEntryJamaat}/>
          {editingIndexJamaat !== null && (
            <JamaatEditingWidget
              saveEntry = {saveEntryJamaat} 
              editingIndex = {editingIndexJamaat}
              setEditingIndex = {setEditingIndexJamaat} 
              editForm = {editFormJamaat} 
              setEditForm = {setEditFormJamaat}
              formErrors = {jamaatFormErrors}
              setFormErrors = {setJamaatFormErrors}/>
          )}
          <JamaatDisplayWidget eventsData={eventsData}
            jamaatName={jamaatName}
            setJamaatName={setJamaatName}
            filteredTimes={filteredTimesJamaat}
            editEntry={editEntryJamaat}
            duplicateEntry={duplicateEntryJamaat}
            deleteEntry={deleteEntryJamaat}/>
        </div>
      )}
      {activeTab === 'events' && (
        <div className="max-w-7xl mx-auto">
        <AdminHeader saveData={saveDataEvents} addNewEntry={addNewEntryEvents}/>
        {editingIndexEvents !== null && (
          <EventsEditingWidget 
          saveEntry = {saveEntryEvents} 
          editingIndex = {editingIndexEvents}
          setEditingIndex = {setEditingIndexEvents} 
          editForm = {editFormEvents} 
          setEditForm = {setEditFormEvents}
          formErrors={eventsFormErrors}
          setFormErrors = {setEventsFormErrors}/>
        )}
        <EventsDisplayWidget 
            searchEventName = {searchEventName}
            setSearchEventName = {setSearchEventName}
            filteredTimes = {filteredTimesEvents} 
            editEntry = {editEntryEvents}
            duplicateEntry = {duplicateEntryEvents} 
            deleteEntry = {deleteEntryEvents}/>
      </div>
      )}
    </div>
  );
}


