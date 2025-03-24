import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ImbalanceEntry from './components/ImbalanceEntry';
import BalanceEntry from './components/BalanceEntry';
import LocationManagement from './components/LocationManagement';
import Settings from './components/Settings';
import './style.css'; // Import the CSS file

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [polesData, setPolesData] = useState(() => {
    const storedData = localStorage.getItem('polesData');
    return storedData ? JSON.parse(storedData) : {
      imbalanced: [],
      balanced: [],
      aging: [],
      locations: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('polesData', JSON.stringify(polesData));
  }, [polesData]);

  const handleDataUpdate = (newData) => {
    setPolesData(newData);
  };

  return (
    <div className="App">
      <header>
        <h1>Imbalance Pole Monitoring System</h1>
        <div>
          <p>Current Date/Time: {new Date().toISOString().slice(0, 19).replace('T', ' ')} (UTC)</p>
        </div>
      </header>

      <nav>
        <button onClick={() => setActivePage('dashboard')}>Dashboard</button>
        <button onClick={() => setActivePage('imbalanceEntry')}>Imbalance Entry</button>
        <button onClick={() => setActivePage('balanceEntry')}>Balance Entry</button>
        <button onClick={() => setActivePage('locationManagement')}>Location Management</button>
        <button onClick={() => setActivePage('settings')}>Settings</button>
      </nav>

      {activePage === 'dashboard' && <Dashboard polesData={polesData} onDataUpdate={handleDataUpdate} />}
      {activePage === 'imbalanceEntry' && <ImbalanceEntry polesData={polesData} onDataUpdate={handleDataUpdate} />}
      {activePage === 'balanceEntry' && <BalanceEntry polesData={polesData} onDataUpdate={handleDataUpdate} />}
      {activePage === 'locationManagement' && <LocationManagement polesData={polesData} onDataUpdate={handleDataUpdate} />}
      {activePage === 'settings' && <Settings />}
    </div>
  );
}

export default App;
