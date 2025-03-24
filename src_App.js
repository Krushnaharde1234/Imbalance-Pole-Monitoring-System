import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ImbalanceEntry from './components/ImbalanceEntry';
import BalanceEntry from './components/BalanceEntry';
import LocationManagement from './components/LocationManagement';
import Settings from './components/Settings';

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
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ textAlign: 'left' }}>Imbalance Pole Monitoring System</h1>
        <div style={{ textAlign: 'right' }}>
          <p>Current Date/Time: {new Date().toLocaleString()}</p>
        </div>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setActivePage('dashboard')} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Dashboard</button>
        <button onClick={() => setActivePage('imbalanceEntry')} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Imbalance Entry</button>
        <button onClick={() => setActivePage('balanceEntry')} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Balance Entry</button>
        <button onClick={() => setActivePage('locationManagement')} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Location Management</button>
        <button onClick={() => setActivePage('settings')} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Settings</button>
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