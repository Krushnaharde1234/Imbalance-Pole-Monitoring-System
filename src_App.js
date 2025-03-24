import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ImbalanceEntry from './components/ImbalanceEntry';
import BalanceEntry from './components/BalanceEntry';
import LocationManagement from './components/LocationManagement';
import Settings from './components/Settings';
import './style.css'; // Import the CSS file

const CurrentDateAndTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId);
    }, []);

    const formatDateTime = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <span>{formatDateTime(currentDateTime)} (UTC)</span>
    );
};


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
        <div className="app-container">
            <aside className="sidebar">
                <h2>Navigation</h2>
                <button onClick={() => setActivePage('dashboard')}>Dashboard</button>
                <button onClick={() => setActivePage('imbalanceEntry')}>Imbalance Entry</button>
                <button onClick={() => setActivePage('balanceEntry')}>Balance Entry</button>
                <button onClick={() => setActivePage('locationManagement')}>Location Management</button>
                <button onClick={() => setActivePage('settings')}>Settings</button>
            </aside>
            <main className="main-content">
                <header>
                    <h1>Imbalance Pole Monitoring System</h1>
                    <div>
                        <p>Current Date/Time: <CurrentDateAndTime /></p>
                    </div>
                </header>

                {activePage === 'dashboard' && <Dashboard polesData={polesData} onDataUpdate={handleDataUpdate} />}
                {activePage === 'imbalanceEntry' && <ImbalanceEntry polesData={polesData} onDataUpdate={handleDataUpdate} />}
                {activePage === 'balanceEntry' && <BalanceEntry polesData={polesData} onDataUpdate={handleDataUpdate} />}
                {activePage === 'locationManagement' && <LocationManagement polesData={polesData} onDataUpdate={handleDataUpdate} />}
                {activePage === 'settings' && <Settings polesData={polesData} onDataUpdate={handleDataUpdate} />}
            </main>
        </div>
    );
}

export default App;
