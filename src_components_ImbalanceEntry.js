import React, { useState } from 'react';

function ImbalanceEntry({ polesData, onDataUpdate }) {
    const [polarity, setPolarity] = useState('');
    const [rating, setRating] = useState('');
    const [quantities, setQuantities] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    const handlePolarityChange = (e) => {
        setPolarity(e.target.value);
        setQuantities({}); // Reset quantities when polarity changes
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleQuantityChange = (poleNumber, value) => {
        setQuantities({ ...quantities, [poleNumber]: value });
    };

    const validate = () => {
        let errors = {};
        if (!polarity) errors.polarity = 'Polarity is required';
        if (!rating) errors.rating = 'Rating is required';
        if (rating && (isNaN(rating) || parseFloat(rating) < 0.5 || parseFloat(rating) > 80)) {
            errors.rating = 'Rating must be between 0.5 and 80';
        }

        let numberOfPoles = parseInt(polarity.charAt(0));
        for (let i = 1; i <= numberOfPoles; i++) {
            if (!quantities[`pole${i}`]) {
                errors[`pole${i}`] = `Quantity for Pole ${i} is required`;
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const calculateImbalance = () => {
        if (!validate()) {
            return;
        }

        let numberOfPoles = parseInt(polarity.charAt(0));
        let poleQuantities = [];
        for (let i = 1; i <= numberOfPoles; i++) {
            poleQuantities.push(parseInt(quantities[`pole${i}`]));
        }

        const balancedQty = Math.min(...poleQuantities);
        const imbalanceQty = poleQuantities.reduce((sum, qty) => sum + qty, 0) - (balancedQty * numberOfPoles);

        return { balancedQty, imbalanceQty };
    };

    const assignLocation = () => {
        const { balancedQty, imbalanceQty } = calculateImbalance();
        let availableLocation = null;
        let updatedLocations = [...polesData.locations];
        let newImbalancedPole = {
            polarity,
            rating,
            imbalanceQty,
            balancedQty,
            location: null,
            daysInactive: 0
        };

        // Check if an existing location with the same rating has space
        for (let i = 0; i < updatedLocations.length; i++) {
            if (updatedLocations[i].rating === rating && updatedLocations[i].remainingCapacity > 0) {
                availableLocation = updatedLocations[i];
                break;
            }
        }

        if (availableLocation) {
            const spaceAvailable = Math.min(availableLocation.remainingCapacity, imbalanceQty);
            availableLocation.currentQty += spaceAvailable;
            availableLocation.remainingCapacity -= spaceAvailable;
            newImbalancedPole.location = availableLocation.location;
            newImbalancedPole.imbalanceQty = spaceAvailable;
        } else {
            // Assign next available location
            let nextLocation = `A${updatedLocations.length + 1}`;
            updatedLocations.push({
                location: nextLocation,
                rating: rating,
                polarity: polarity,
                currentQty: imbalanceQty,
                remainingCapacity: Math.max(0, 25 - imbalanceQty),
                status: imbalanceQty > 0 ? 'Active' : 'Balanced'
            });
            newImbalancedPole.location = nextLocation;
        }

        // Update poles data
        const updatedPolesData = { ...polesData };
        updatedPolesData.imbalanced = [...updatedPolesData.imbalanced, newImbalancedPole];
        updatedPolesData.locations = updatedLocations;
        onDataUpdate(updatedPolesData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        assignLocation();
    };

    const handleReset = () => {
        setPolarity('');
        setRating('');
        setQuantities({});
        setValidationErrors({});
    };

    let numberOfPoles = polarity ? parseInt(polarity.charAt(0)) : 0;
    let quantityInputs = [];
    for (let i = 1; i <= numberOfPoles; i++) {
        quantityInputs.push(
            <div key={i} style={{ marginBottom: '10px' }}>
                <label htmlFor={`pole${i}`} style={{ marginRight: '10px' }}>Pole {i} Quantity:</label>
                <input
                    type="number"
                    id={`pole${i}`}
                    value={quantities[`pole${i}`] || ''}
                    onChange={(e) => handleQuantityChange(`pole${i}`, e.target.value)}
                    style={{ padding: '5px', borderColor: validationErrors[`pole${i}`] ? 'red' : '' }}
                />
                {validationErrors[`pole${i}`] && <p style={{ color: 'red' }}>{validationErrors[`pole${i}`]}</p>}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Imbalance Entry</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="polarity" style={{ marginRight: '10px' }}>Polarity:</label>
                    <select id="polarity" value={polarity} onChange={handlePolarityChange} style={{ padding: '5px', borderColor: validationErrors.polarity ? 'red' : '' }}>
                        <option value="">Select Polarity</option>
                        <option value="2-Pole">2-Pole</option>
                        <option value="3-Pole">3-Pole</option>
                        <option value="4-Pole">4-Pole</option>
                    </select>
                    {validationErrors.polarity && <p style={{ color: 'red' }}>{validationErrors.polarity}</p>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="rating" style={{ marginRight: '10px' }}>Rating (A):</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={handleRatingChange}
                        style={{ padding: '5px', borderColor: validationErrors.rating ? 'red' : '' }}
                    />
                    {validationErrors.rating && <p style={{ color: 'red' }}>{validationErrors.rating}</p>}
                </div>

                {quantityInputs}

                <button type="submit" style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Submit</button>
                <button type="reset" onClick={handleReset} style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}>Reset</button>
            </form>
        </div>
    );
}

export default ImbalanceEntry;