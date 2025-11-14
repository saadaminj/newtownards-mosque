import React, { useState, useEffect } from 'react';
import { Upload, Calendar, Download, Plus, Edit2, Save, X, Search, Trash2, Copy, Lock } from 'lucide-react';
import bcrypt from "bcryptjs";
import { JamaatAdmin } from './widgets/admin/jamaat_admin';
import { AdminHeader } from './widgets/admin/header';

let MONTH = "";
let YEAR = "";

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
  const [editForm, setEditForm] = useState({
    date: '',
    fajr: '',
    sunrise: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: ''
  });
  
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
    // call it here
    fetchPassword();
  }, []); 

  const loadData = async () => {
    loadDataPrayerTimes();
    loadDataJamaat();
    loadDataEvents();
  }

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

  
  async function fetchPassword() {
      try {
        const res = await fetch("http://localhost:4000/api/password");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setServerHash(data.passtext);    
        // if (Array.isArray(data) && data.length > 0) {
        //   setServerHash(data[0].hash);
        // }
      } catch (err) {
        console.error("Failed to fetch password:", err);
      }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const res = await fetch("http://localhost:4000/api/prayer_times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prayerData }),
      });

      await res.json();
      alert('Prayer times saved successfully! Other pages can now access this data.');
    } catch (error) {
      alert('Failed to save data');
      console.error("Error saving prayer times:", error);
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
    if (inputJSON.length === 0) return;
    try {
      const imported = JSON.parse(inputJSON);

      const newPrayerData = { ...prayerData };

      for (const [date, newTimes] of Object.entries(imported)) {
      newPrayerData[date] = {
        ...(newPrayerData[date] || {}),
        ...newTimes,
      };
    }
      setPrayerData(newPrayerData);
      setInputJSON("");

      alert('Data imported successfully!');
    } catch (error) {
      alert('Invalid JSON input',error);
    }
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   [MONTH, yearWithExt] = file.name.split("_");
  //   YEAR = yearWithExt.split(".")[0];


  //   setProcessingImage(true);

  //   try {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       try {
  //           const worker = await createWorker("eng");
  //           const {
  //               data: { text },
  //           } = await worker.recognize(file);
  //           await worker.terminate();

  //           setOcrText(text);
  //           const jsonText = parsePrayerTable(text);
  //           console.log(jsonText);
  //           // const parsed = JSON.parse(jsonText);
  //           let parsed = {};
  //           parsed["prayer_times"] = jsonText;
  //           // setResultJson({
  //           // year: YEAR,
  //           // prayer_times: parsed,
  //           // });
  //           if (parsed.prayer_times && parsed.prayer_times.length > 0) {
  //             setPrayerData(parsed);
  //             alert(`Successfully imported ${parsed.prayer_times.length} prayer time entries from image!`);
  //           } else {
  //               console.log(parsed);
  //             alert('No prayer times found in the image');
  //           }
            
  //       } catch (error) {
  //         console.error(error);
  //         alert('Failed to process image. Please ensure the image is clear and contains a prayer times table.');
  //         setProcessingImage(false);
  //       } finally {
  //         setProcessingImage(false);
  //       }
  //     };

  //     reader.readAsDataURL(file);
  //   } catch (error) {
  //     console.error(error);
  //     alert('Failed to read image file');
  //     setProcessingImage(false);
  //   }
  // };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setProcessingImage(true);

  //   try {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       try {
  //         // base64 without the prefix
  //         const base64Image = e.target.result.split(',')[1];

  //         // call your local Ollama
  //         const response = await fetch('http://localhost:11435/api/generate', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             model: 'llava:latest', // or the vision model you pulled in Ollama
  //             prompt: `This is a prayer times table from a mosque. The table shows prayer times with columns for different prayers (Fajr, Shrq/Sunrise, Dhuhr, Asr, Mgrb/Maghrib, Isha) and rows for each day of the month.
  //                   Extract ALL prayer times from this image and return ONLY valid JSON (no markdown, no explanation) with this exact structure:

  //                   {
  //                     "2024-04-01":
  //                       {
  //                         "fajr": "05:16",
  //                         "sunrise": "06:54",
  //                         "dhuhr": "13:29",
  //                         "asr": "17:00",
  //                         "maghrib": "20:02",
  //                         "isha": "21:34"
  //                       },

  //                     "2024-04-02":
  //                       {
  //                         "fajr": "05:16",
  //                         "sunrise": "06:54",
  //                         "dhuhr": "13:29",
  //                         "asr": "17:00",
  //                         "maghrib": "20:02",
  //                         "isha": "21:34"
  //                       },
  //                   }

  //                   CRITICAL INSTRUCTIONS:
  //                   - The image has month name for e.g April, May, June convert it to number
  //                   - 1 2 3 4 are days so convert month and days in keys such as YYYY-MM-DD 2025-04-01 (if april)
  //                   - the image has prayer times, parse the text and put it into dictionary in this format: 
  //                   {
  //                     "2024-04-01":
  //                       {
  //                         "fajr": "05:16",
  //                         "sunrise": "06:54",
  //                         "dhuhr": "13:29",
  //                         "asr": "17:00",
  //                         "maghrib": "20:02",
  //                         "isha": "21:34"
  //                       },

  //                     "2024-04-02":
  //                       {
  //                         "fajr": "05:16",
  //                         "sunrise": "06:54",
  //                         "dhuhr": "13:29",
  //                         "asr": "17:00",
  //                         "maghrib": "20:02",
  //                         "isha": "21:34"
  //                       },
  //                   }
  //                   - Each day prayer time is seperate and the dictionary should have 8, 30 or 31 days in it. Please extract times for whole month and put it in json object like you are told.
  //                   - The image shows times in 12-hour format (e.g., 5.16 means 5:16 AM, 1.29 means 1:29 PM)
  //                   - Times before noon (Fajr, Sunrise) are AM times
  //                   - Times after noon (Dhuhr, Asr, Maghrib, Isha) are PM times
  //                   - Convert ALL times to 24-hour format with colon separator (HH:MM)
  //                   - Fajr and Sunrise: Keep as morning times (e.g., 5.16 → 05:16)
  //                   - Dhuhr: Add 12 hours if needed (e.g., 1.29 → 13:29)
  //                   - Asr: Add 12 hours (e.g., 5.00 → 17:00)
  //                   - Maghrib: Add 12 hours (e.g., 8.02 → 20:02)
  //                   - Isha: Add 12 hours (e.g., 9.34 → 21:34)
  //                   - If time is already after 12, keep it
  //                   - Date format: YYYY-MM-DD
  //                   - Extract ALL days visible in the table
  //                   - Return ONLY the JSON object, no other text`,

  //             images: [base64Image],
  //             stream: false
  //           })
  //         });

  //         // 1) get JSON from Ollama
  //         const data = await response.json();
  //         console.log("ollama raw:", data);

  //         // 2) Ollama puts the text in `data.response`, not `data.message.content`
  //         const rawText = (data.response || "").trim();

  //         // 3) strip ```json ... ``` if model added it
  //         const cleaned = rawText
  //           .replace(/```json\s*/i, "")
  //           .replace(/```/g, "")
  //           .trim();

  //         // 4) sometimes model still appends text after the JSON
  //         // so grab up to the last closing brace
  //         const lastBrace = cleaned.lastIndexOf("}");
  //         const jsonOnly = lastBrace !== -1 ? cleaned.slice(0, lastBrace + 1) : cleaned;

  //         // 5) now parse
  //         const parsed = JSON.parse(jsonOnly);
  //         console.log("parsed:", parsed);

  //         if (parsed && Object.keys(parsed).length > 0) {
  //           // if you want to MERGE instead of replace, you can merge here
  //           setPrayerData(parsed);
  //           alert(`Successfully imported ${Object.keys(parsed).length} prayer time entries from image!`);
  //         } else {
  //           alert('No prayer times found in the image');
  //         }

  //       } catch (error) {
  //         console.error(error);
  //         alert('Failed to process image. Please ensure the image is clear and contains a prayer times table.');
  //         setProcessingImage(false);
  //       } finally {
  //         setProcessingImage(false);
  //       }
  //     };

  //     reader.readAsDataURL(file);
  //   } catch (error) {
  //     console.error(error);
  //     alert('Failed to read image file');
  //     setProcessingImage(false);
  //   }
  // };


  // // convert things like "5.16" → "05:16", and if not morning → +12h
  // const to24hFromDot = (timeStr, isMorning) => {
  //   if (!timeStr) return "";
  //   timeStr = timeStr.replace(":", ".").trim();
  //   const parts = timeStr.split(".");
  //   if (parts.length !== 2) return timeStr;
  //   let h = parseInt(parts[0], 10);
  //   const m = parseInt(parts[1], 10);
  //   if (isMorning) {
  //     return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  //   } else {
  //     if (h < 12) h += 12;
  //     return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  //   }
  // };

  // // parse OCR text that looks like your April table
  // const parsePrayerTable = (text) => {
  //   const lines = text.split("\n");
  //   const entries = [];

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (!line) continue;
  //   //   if (line.toLowerCase().startsWith("april")) continue;

  //     // split by spaces
  //     const parts = line.split(/\s+/);
  //     // we expect: day fajr shrq dhuhr asr mgrb isha → 7 items min
  //     if (parts.length < 7) continue;
  //     if (!/^\d+$/.test(parts[0])) continue;

  //     const day = parseInt(parts[0], 10);
  //     const fajr = parts[1];
  //     const shrq = parts[2];
  //     const dhuhr = parts[3];
  //     const asr = parts[4];
  //     const mgrb = parts[5];
  //     const isha = parts[6];

  //     const dateStr = `${YEAR}-${String(MONTH).padStart(2, "0")}-${String(day).padStart(
  //       2,
  //       "0"
  //     )}`;

  //     entries.push({
  //       date: dateStr,
  //       fajr: to24hFromDot(fajr, true),
  //       sunrise: to24hFromDot(shrq, true),
  //       dhuhr: to24hFromDot(dhuhr, false),
  //       asr: to24hFromDot(asr, false),
  //       maghrib: to24hFromDot(mgrb, false),
  //       isha: to24hFromDot(isha, false),
  //     });
  //   }

  //   return entries;
  // };

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






// JAMAAT


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

      // helper to turn "03:45 pm" into minutes since midnight
  // sort entries, then rebuild object
    function toMinutes24(t) {
      if (!t) return Number.POSITIVE_INFINITY;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    }

  const deleteEntryJamaat = async (index) =>  {
    if (confirm('Delete this entry?')) {
      // const newTimes = prayerData.filter((_, i) => i !== index);
      // setPrayerData({ ...prayerData,  newTimes });
      
      try{
        const response = await fetch(`http://localhost:4000/api/jamaat/${index}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          // handle error (400, 404, 500, etc.)
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



  //Events



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
      // const newTimes = prayerData.filter((_, i) => i !== index);
      // setPrayerData({ ...prayerData,  newTimes });
      
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

  // const generateYearTemplate = () => {
  //   const year = prayerData.year;
  //   const days = [];
  //   for (let month = 0; month < 12; month++) {
  //     const daysInMonth = new Date(year, month + 1, 0).getDate();
  //     for (let day = 1; day <= daysInMonth; day++) {
  //       const date = new Date(year, month, day);
  //       days.push({
  //         date: date.toISOString().split('T')[0],
  //         fajr: '05:00',
  //         sunrise: '06:30',
  //         dhuhr: '12:00',
  //         asr: '15:30',
  //         maghrib: '18:00',
  //         isha: '19:30'
  //       });
  //     }
  //   }
  //   setPrayerData({ ...prayerData, days });
  // };

  // const filteredTimes = prayerData.filter(pt =>
  //   !searchDate || pt.includes(searchDate)
  // );

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
              <p className="text-gray-500 text-sm">Enter the admin password to continue</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();   // stop browser submit
              saveEntry();          // do your React save (which may close modal)
            }}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingIndex === -1 ? 'Add New Entry' : 'Edit Entry'}
                  </h2>
                  <button
                    type="button" 
                    onClick={() => setEditingIndex(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map(prayer => (
                    <div key={prayer}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {prayer}
                      </label>
                      <input
                        type="time"
                        value={editForm[prayer]}
                        onChange={(e) => setEditForm({ ...editForm, [prayer]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    // onClick={saveEntry}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button" 
                    onClick={() => setEditingIndex(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Prayer Times Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Prayer Times</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder="Search date (YYYY-MM-DD)"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Fajr</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Sunrise</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dhuhr</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Asr</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Maghrib</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Isha</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No entries yet. Click "Add Entry" or "Generate Year Template" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredTimes.map((day) => {
                    const dateKey = day.date; // this is like "2024-04-01"

                    return (
                      <tr key={dateKey} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{day.date}</td>
                        <td className="px-4 py-3 text-gray-600">{day.fajr || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{day.sunrise || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{day.dhuhr || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{day.asr || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{day.maghrib || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{day.isha || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntry(dateKey)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEntry(dateKey)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntry(dateKey)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })

                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>)}
      {activeTab === 'jamaat' && (
        <div>
          <AdminHeader saveData={saveDataJamaat} addNewEntry={addNewEntryJamaat}/>
          <JamaatAdmin eventsData={eventsData}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();   // stop browser submit
              saveEntryEvents();          // do your React save (which may close modal)
            }}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingIndexEvents === -1 ? 'Add New Entry' : 'Edit Entry'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingIndexEvents(null)}
                    className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                    <input
                      type="text"
                      value={editFormEvents.name}
                      onChange={(e) => setEditFormEvents({ ...editFormEvents, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                    <div key="Description">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editFormEvents.description}
                        onChange={(e) => setEditFormEvents({ ...editFormEvents, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div key="Time">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        Time
                      </label>
                      <input
                        type="time"
                        value={editFormEvents.time}
                        onChange={(e) => setEditFormEvents({ ...editFormEvents, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    // onClick={saveEntryJamaat}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndexEvents(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Prayer Times Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Events</h2>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="text"
                placeholder="Search name"
                value={searchEventName}
                onChange={(e) => setSearchEventName(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesEvents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No entries yet. Click "Add Entry" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredTimesEvents.map((event) => {
                    const eventName = event.name; 
                    return (
                      <tr key={eventName} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{event.name}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{event.description}</td>
                        <td className="px-4 py-3 text-gray-600">{event.time || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntryEvents(eventName)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEntryEvents(eventName)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntryEvents(eventName)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
    
  );
}


