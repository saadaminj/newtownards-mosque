import { useState, useEffect } from 'react';
import { Edit2, X, Search, Trash2, Copy, Lock } from 'lucide-react';
import bcrypt from "bcryptjs";
import { JamaatDisplayWidget } from './widgets/admin/jamaat_display_widget';
import { JamaatEditingWidget } from './widgets/admin/jamaat_editing_widget';
import { AdminHeader } from './widgets/admin/header';
import { PrayerEditingWidget } from './widgets/admin/prayer_editing_widget';
import { EventsEditingWidget } from './widgets/admin/events_editing_widget';
import { PrayerDisplayWidget } from './widgets/admin/prayer_display_widget';
import { EventsDisplayWidget } from './widgets/admin/events_display_widget';
import { Login } from './widgets/admin/login';
import { fetchEvents } from './services/eventService';
import { fetchJamaatTimes } from './services/jamaatService';
import { fetchPrayerTimes, savePrayerTimes } from './services/prayerService';
import { fetchPassword } from './services/passwordService';

export default function MosqueAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputJSON, setInputJSON] = useState("");
  const [activeTab, setActiveTab] = useState('prayers');
  const [serverHash, setServerHash] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [prayerData, setPrayerData] = useState([]);
  const [jamaatData, setJamaatData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [jamaatName, setJamaatName] = useState('');
  const [searchEventName, setSearchEventName] = useState('');
  const [eventsFormErrors, setEventsFormErrors] = useState('');
  const [jamaatFormErrors, setJamaatFormErrors] = useState('');
  const [prayerFormErrors, setPrayerFormErrors] = useState('');
  const [editForm, setEditForm] = useState({
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


  useEffect(() => {
    getPassword();
  }, []); 

  const loadData = async () => {
    loadDataPrayerTimes();
    loadDataJamaat();
    loadDataEvents();
  }

  const loadDataPrayerTimes = async () => {
    try {
      const data = await fetchPrayerTimes();
      setPrayerData(data);
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  };

  const loadDataJamaat = async () => {
    try {
      const data = await fetchJamaatTimes();
      setJamaatData(data);
    } catch (error) {
      console.error("Failed to fetch jamaat times:", error);
    }
  };

  const loadDataEvents = async () => {
    try {
      const data = await fetchEvents();
      setEventsData(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  
  async function getPassword() {
      try {
        const data = await fetchPassword();
        setServerHash(data);
      } catch (err) {
        console.error("Failed to fetch password:", err);
      }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if(serverHash === null){
      getPassword();
    }

    const isMatch = await bcrypt.compare(passwordInput, serverHash);
    
    if (isMatch) {
      setIsAuthenticated(true);
      loadData();
      setPasswordError('');
      setPasswordInput('');
    } else {
      alert("Wrong Password");
    }
  };

  const saveData = async () => {
    try {
      await savePrayerTimes(prayerData);
      alert('Prayer times saved successfully! Other pages can now access this data.');
    } catch (error) {
      alert(error);
    }
  };

  const saveDataJamaat = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/jamaat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jamaatData }),
      });

      await res.json();
      alert('Jamaat times saved successfully! Other pages can now access this data.');
    } catch (error) {
      alert('Failed to save data');
      console.error("Error saving Jamaat times:", error);
    }
  };

  const saveDataEvents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventsData }),
      });

      await res.json();
      alert('Events saved successfully! Other pages can now access this data.');
    } catch (error) {
      alert('Failed to save data');
      console.error("Error saving Events:", error);
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
          alert('Data imported successfully!');
        } catch (error) {
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

      const newPrayerData = { ...prayerData };

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
      setPrayerData(newPrayerData);
      setInputJSON("");
      if(number > 0){
        alert("Some rows can't be inserted due to validation errors: "+number);
      }
      else alert('Data imported successfully!');
    } catch (error) {
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
    setEditingIndex(-1);
    setEditForm({
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
    setEditingIndex(index);
    setEditForm({date:index,...prayerData[index]});
  };

  const saveEntry = () => {
    if (!editForm.date) {
      alert('Date is required');
      return;
    }
    
    if (!DATE_REGEX.test(editForm.date)) {
      setPrayerFormErrors("Please enter a valid date");
      return;
    }
    else if (
      (editForm.fajr && !TIME_REGEX.test(editForm.fajr)) ||
      (editForm.sunrise && !TIME_REGEX.test(editForm.sunrise)) ||
      (editForm.dhuhr && !TIME_REGEX.test(editForm.dhuhr)) ||
      (editForm.asr && !TIME_REGEX.test(editForm.asr)) ||
      (editForm.isha && !TIME_REGEX.test(editForm.isha))
    ) {
      setPrayerFormErrors("Time can only contain numbers");
      return;
    }

    let newTimes = {...prayerData};

    newTimes[editForm.date] = {
      fajr: editForm.fajr,
      sunrise: editForm.sunrise,
      dhuhr: editForm.dhuhr,
      asr: editForm.asr,
      maghrib: editForm.maghrib,
      isha: editForm.isha
    };

    // sort entries, then build a NEW object in order
    newTimes = Object.entries(newTimes)
      .sort((a, b) => new Date(a[0]) - new Date(b[0])) // a[0], b[0] are the date keys
      .reduce((acc, [date, times]) => {
        acc[date] = times;
        return acc;
      }, {});

    setPrayerData(newTimes);
    setEditingIndex(null);
  };

  const deleteEntry = async (index) =>  {
    if (confirm('Delete this entry?')) {
      // const newTimes = prayerData.filter((_, i) => i !== index);
      // setPrayerData({ ...prayerData,  newTimes });
      
      try{
        const response = await fetch(`http://localhost:4000/api/prayer_times/${index}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          // handle error (400, 404, 500, etc.)
          console.error("Error:", data.error);
          if(data.error.includes("no record found")){
            setPrayerData(prev => {
              const updated = { ...prev };
              delete updated[index]; // your key here
              return updated;
            });
          }
          else{
            alert(`Error (${response.status}): ${data.error}`);
          }
          return;
        }
        else{
          setPrayerData(prev => {
            const updated = { ...prev };
            delete updated[index]; // your key here
            return updated;
          });
        }
      } catch (err) {
        console.error("Network or JSON error:", err);
        alert("Failed to connect to server.");
      }
    }
    
    
  };

  const duplicateEntry = (index) => {
    const entry = { ...prayerData[index] };
    setEditingIndex(-1);
    setEditForm(entry);
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
        const response = await fetch(`http://localhost:4000/api/jamaat/${index}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error:", data.error);
          if((data.error).includes("nothing to delete")){
            setJamaatData(prev => {
              const updated = { ...prev };
              delete updated[index]; // your key here
              return updated;
            });
          }
          else{
            alert(`Error (${response.status}): ${data.error}`);
          }
          return;
      
        }
        else{
          setJamaatData(prev => {
            const updated = { ...prev };
            delete updated[index]; // your key here
            return updated;
          });
        }
      } catch (err) {
        console.error("Network or JSON error:", err);
        alert("Failed to connect to server.");
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
        const response = await fetch(`http://localhost:4000/api/events/${index}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          // handle error (400, 404, 500, etc.)
          console.error("Error:", data.error);
          if((data.error).includes("nothing to delete")){
            setEventsData(prev => {
              const updated = { ...prev };
              delete updated[index]; // your key here
              return updated;
            });
          }
          else{
            alert(`Error (${response.status}): ${data.error}`);
          }
          return;
      
        }
        else{
          setEventsData(prev => {
            const updated = { ...prev };
            delete updated[index]; // your key here
            return updated;
          });
        }
      } catch (err) {
        console.error("Network or JSON error:", err);
        alert("Failed to connect to server.");
      }
    }
    
    
  };

  const duplicateEntryEvents = (index) => {
    setEditingIndexEvents(-1);
    setEditFormEvents({name:index,...eventsData[index]});
  };

  let filteredTimes = prayerData ? Object.entries(prayerData) : [];

  filteredTimes = filteredTimes
    .filter(([key]) =>
      !searchDate ? true : key.toLowerCase().includes(searchDate.toLowerCase())
    )
    .map(([key, value]) => ({ date: key, ...value }));


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

  if (!isAuthenticated) {
    return (
      <Login 
        handleLogin = {handleLogin} 
        passwordInput = {passwordInput}
        setPasswordInput = {setPasswordInput}
        passwordError= {passwordError}/>
      );
  }

  // If authenticated, render the full dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <nav className=" max-w-7xl mx-auto bg-white shadow-md sticky top-0 z-10 mb-4 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-2 py-4 flex-wrap">
            {[ 'prayers','jamaat', 'events'].map(tab => (
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

        {editingIndex !== null && (
          <PrayerEditingWidget 
          saveEntry = {saveEntry} 
          editingIndex = {editingIndex}
          setEditingIndex = {setEditingIndex} 
          editForm = {editForm} 
          setEditForm = {setEditForm}
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
            saveDataJamaat={saveDataJamaat}
            addNewEntryJamaat={addNewEntryJamaat}
            editingIndexJamaat={editingIndexJamaat}
            setEditingIndexJamaat={setEditingIndexJamaat}
            editFormJamaat={editFormJamaat}
            setEditFormJamaat={setEditFormJamaat}
            saveEntryJamaat={saveEntryJamaat}
            jamaatName={jamaatName}
            setJamaatName={setJamaatName}
            filteredTimesJamaat={filteredTimesJamaat}
            editEntryJamaat={editEntryJamaat}
            duplicateEntryJamaat={duplicateEntryJamaat}
            deleteEntryJamaat={deleteEntryJamaat}/>
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


