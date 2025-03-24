import React, { useState, useEffect } from 'react';

function Dashboard({ polesData, onDataUpdate }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      // Aging logic
      const updatedPolesData = { ...polesData };
      updatedPolesData.imbalanced = updatedPolesData.imbalanced.map(pole => {
        const daysInactive = pole.daysInactive ? pole.daysInactive + 1 : 1;
        return { ...pole, daysInactive };
      });

      // Move to aging poles
      updatedPolesData.aging = [
        ...updatedPolesData.aging,
        ...updatedPolesData.imbalanced.filter(pole => pole.daysInactive >= 15)
      ];
      updatedPolesData.imbalanced = updatedPolesData.imbalanced.filter(pole => pole.daysInactive < 15);
      onDataUpdate(updatedPolesData);

    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, [polesData, onDataUpdate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ width: '30%', backgroundColor: '#FF9800', padding: '10px', color: 'white' }}>
        <h2>Imbalanced Poles</h2>
        <table>
          <thead>
            <tr>
              <th>Polarity</th>
              <th>Rating (A)</th>
              <th>Location</th>
              <th>Imbalance Qty</th>
              <th>Balanced Qty</th>
              <th>Days Inactive</th>
            </tr>
          </thead>
          <tbody>
            {polesData.imbalanced.map((pole, index) => (
              <tr key={index} style={{ color: pole.daysInactive >= 15 ? 'red' : 'white' }}>
                <td>{pole.polarity}</td>
                <td>{pole.rating}</td>
                <td>{pole.location}</td>
                <td>{pole.imbalanceQty}</td>
                <td>{pole.balancedQty || 0}</td>
                <td>{pole.daysInactive || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: '30%', backgroundColor: '#4CAF50', padding: '10px', color: 'white' }}>
        <h2>Balanced Poles</h2>
        <table>
          <thead>
            <tr>
              <th>Polarity</th>
              <th>Rating (A)</th>
              <th>Location</th>
              <th>Balanced Qty</th>
              <th>Balance Date</th>
            </tr>
          </thead>
          <tbody>
            {polesData.balanced.map((pole, index) => (
              <tr key={index}>
                <td>{pole.polarity}</td>
                <td>{pole.rating}</td>
                <td>{pole.location}</td>
                <td>{pole.balancedQty}</td>
                <td>{pole.balanceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: '30%', backgroundColor: '#E53935', padding: '10px', color: 'white' }}>
        <h2>Aging Poles</h2>
        <table>
          <thead>
            <tr>
              <th>Polarity</th>
              <th>Rating (A)</th>
              <th>Location</th>
              <th>Imbalance Qty</th>
              <th>Days Inactive</th>
            </tr>
          </thead>
          <tbody>
            {polesData.aging.map((pole, index) => (
              <tr key={index}>
                <td>{pole.polarity}</td>
                <td>{pole.rating}</td>
                <td>{pole.location}</td>
                <td>{pole.imbalanceQty}</td>
                <td>{pole.daysInactive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;