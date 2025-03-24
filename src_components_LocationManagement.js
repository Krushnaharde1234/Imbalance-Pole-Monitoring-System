import React, { useState } from 'react';

function LocationManagement({ polesData, onDataUpdate }) {
    const [newLocation, setNewLocation] = useState({
        location: '',
        rating: '',
        polarity: '',
        capacity: ''
    });

    const handleInputChange = (e) => {
        setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    };

    const handleAddLocation = () => {
        if (newLocation.location && newLocation.rating && newLocation.polarity && newLocation.capacity) {
            const updatedLocations = [...polesData.locations, {
                location: newLocation.location,
                rating: newLocation.rating,
                polarity: newLocation.polarity,
                currentQty: 0,
                remainingCapacity: parseInt(newLocation.capacity),
                status: 'Balanced'
            }];
            onDataUpdate({ ...polesData, locations: updatedLocations });
            setNewLocation({ location: '', rating: '', polarity: '', capacity: '' });
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="location-management-container">
            <h2>Location Management</h2>

            <h3>Add New Location</h3>
            <div className="add-location-form">
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newLocation.location}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="rating"
                    placeholder="Rating (A)"
                    value={newLocation.rating}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="polarity"
                    placeholder="Polarity"
                    value={newLocation.polarity}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={newLocation.capacity}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddLocation}>Add Location</button>
            </div>

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
                            <td className={location.remainingCapacity === 0 ? 'full' : (location.currentQty > 0 ? 'partially-filled' : 'balanced')}>
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
