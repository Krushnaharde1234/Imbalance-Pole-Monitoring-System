import React from 'react';

function LocationManagement({ polesData }) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Location Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Rating (A)</th>
                        <th>Polarity</th>
                        <th>Current Qty</th>
                        <th>Remaining Capacity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {polesData.locations.map((location, index) => (
                        <tr key={index}>
                            <td>{location.location}</td>
                            <td>{location.rating}</td>
                            <td>{location.polarity}</td>
                            <td>{location.currentQty}</td>
                            <td>{location.remainingCapacity}</td>
                            <td style={{ color: location.remainingCapacity === 0 ? 'red' : (location.currentQty > 0 ? 'orange' : 'green') }}>
                                {location.remainingCapacity === 0 ? 'Full' : (location.currentQty > 0 ? 'Partially Filled' : 'Balanced')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LocationManagement;