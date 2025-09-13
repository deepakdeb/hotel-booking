import { useState } from 'react';

const amenitiesList = [
    'Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 
    'Restaurant', 'Bar', 'Room Service', 'Air Conditioning',
    'Parking', 'Pet Friendly', 'Business Center', 'Family Rooms'
];

export default function SearchFilters({ data, setData, onFilterChange }) {
    const [priceRange, setPriceRange] = useState({
        min: data.min_price || 0,
        max: data.max_price || 1000
    });

    const handleAmenityChange = (amenity) => {
        const updatedAmenities = data.amenities.includes(amenity)
            ? data.amenities.filter(a => a !== amenity)
            : [...data.amenities, amenity];
        
        setData('amenities', updatedAmenities);
        onFilterChange();
    };

    const handlePriceChange = (type, value) => {
        const newPriceRange = { ...priceRange, [type]: value };
        setPriceRange(newPriceRange);
        setData('min_price', newPriceRange.min);
        setData('max_price', newPriceRange.max);
        onFilterChange();
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            
            {/* Price Range */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range (per night)</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            min="0"
                            max="10000"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Min"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="number"
                            min="0"
                            max="10000"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 1000)}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Max"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
                <div className="space-y-2">
                    {amenitiesList.map(amenity => (
                        <label key={amenity} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.amenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ms-2 text-sm text-gray-600">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => {
                    setData({
                        location: data.location,
                        check_in: data.check_in,
                        check_out: data.check_out,
                        guests: data.guests,
                        min_price: '',
                        max_price: '',
                        amenities: [],
                    });
                    setPriceRange({ min: 0, max: 1000 });
                    onFilterChange();
                }}
                className="w-full text-sm text-indigo-600 hover:text-indigo-800"
            >
                Clear all filters
            </button>
        </div>
    );
}