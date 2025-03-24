import React, { useState } from 'react';

function BalanceEntry({ polesData, onDataUpdate }) {
    const [polarity, setPolarity] = useState('');
    const [rating, setRating] = useState('');
    const [balancedQuantity, setBalancedQuantity] = useState('');
    const [location, setLocation] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // Function to get existing ratings based on imbalanced poles data
    const getExistingRatings = () => {
        const ratings = new Set();
        polesData.imbalanced.forEach(pole => {
            ratings.add(pole.rating);
        });
        return Array.from(ratings);
    };

    // Function to get existing polarities based on imbalanced poles data
    const getExistingPolarities = () => {
        const polarities = new Set();
        polesData.imbalanced.forEach(pole => {
            polarities.add(pole.polarity);
        });
        return Array.from(polarities);
    };

    // Function to get existing locations based on imbalanced poles data
    const getExistingLocations = () => {
        const locations = new Set();
        polesData.imbalanced.forEach(pole => {
            locations.add(pole.location);
        });
        return Array.from(locations);
    };

    const validate = () => {
        let errors = {};
        if (!polarity) errors.polarity = 'Polarity is required';
        if (!rating) errors.rating = 'Rating is required';
        if (!balancedQuantity) errors.balancedQuantity = 'Balanced Quantity is required';
        if (!location) errors.location = 'Location is required';
        if (isNaN(balancedQuantity) || parseFloat(balancedQuantity) <= 0) {
            errors.balancedQuantity = 'Balanced Quantity must be a positive number';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        // Find the imbalanced pole entry
        const imbalancedPoleIndex = polesData.imbalanced.findIndex(
            pole => pole.polarity === polarity && pole.rating === rating && pole.location === location
        );

        if (imbalancedPoleIndex === -1) {
            alert('No matching imbalanced pole entry found.');
            return;
        }

        const imbalancedPole = { ...polesData.imbalanced[imbalancedPoleIndex] };
        const enteredBalancedQuantity = parseInt(balancedQuantity);

        if (enteredBalancedQuantity > imbalancedPole.imbalanceQty) {
            alert('Entered balanced quantity exceeds the imbalanced quantity.');
            return;
        }

        // Update the imbalanced quantity
        imbalancedPole.imbalanceQty -= enteredBalancedQuantity;

        // Create a new balanced pole entry
        const newBalancedPole = {
            polarity: polarity,
            rating: rating,
            location: location,
            balancedQty: enteredBalancedQuantity,
            balanceDate: new Date().toLocaleDateString()
        };

        // Update poles data
        const updatedPolesData = { ...polesData };
        if (imbalancedPole.imbalanceQty === 0) {
            // Move entry to Balanced Poles if imbalance hits 0
            updatedPolesData.balanced = [...updatedPolesData.balanced, newBalancedPole];
            updatedPolesData.imbalanced.splice(imbalancedPoleIndex, 1);
        } else {
            // Update the imbalanced pole entry
            updatedPolesData.imbalanced[imbalancedPoleIndex] = imbalancedPole;
        }

        onDataUpdate(updatedPolesData);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Balance Entry</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="polarity" style={{ marginRight: '10px' }}>Polarity:</label>
                    <select
                        id="polarity"
                        value={polarity}
                        onChange={(e) => setPolarity(e.target.value)}
                        style={{ padding: '5px', borderColor: validationErrors.polarity ? 'red' : '' }}
                    >
                        <option value="">Select Polarity</option>
                        {getExistingPolarities().map(existingPolarity => (
                            <option key={existingPolarity} value={existingPolarity}>{existingPolarity}</option>
                        ))}
                    </select>
                    {validationErrors.polarity && <p style={{ color: 'red' }}>{validationErrors.polarity}</p>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="rating" style={{ marginRight: '10px' }}>Rating (A):</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ padding: '5px', borderColor: validationErrors.rating ? 'red' : '' }}
                    >
                        <option value="">Select Rating</option>
                        {getExistingRatings().map(existingRating => (
                            <option key={existingRating} value={existingRating}>{existingRating}</option>
                        ))}
                    </select>
                    {validationErrors.rating && <p style={{ color: 'red' }}>{validationErrors.rating}</p>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="location" style={{ marginRight: '10px' }}>Location:</label>
                    <select
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ padding: '5px', borderColor: validationErrors.location ? 'red' : '' }}
                    >
                        <option value="">Select Location</option>
                        {getExistingLocations().map(existingLocation => (
                            <option key={existingLocation} value={existingLocation}>{existingLocation}</option>
                        ))}
                    </select>
                    {validationErrors.location && <p style={{ color: 'red' }}>{validationErrors.location}</p>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="balancedQuantity" style={{ marginRight: '10px' }}>Balanced Quantity:</label>
                    <input
                        type="number"
                        id="balancedQuantity"
                        value={balancedQuantity}
                        onChange={(e) => setBalancedQuantity(e.target.value)}
                        style={{ padding: '5px', borderColor: validationErrors.balancedQuantity ? 'red' : '' }}
                    />
                    {validationErrors.balancedQuantity && <p style={{ color: 'red' }}>{validationErrors.balancedQuantity}</p>}
                </div>

                <button type="submit" style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Submit</button>
            </form>
        </div>
    );
}

export default BalanceEntry;