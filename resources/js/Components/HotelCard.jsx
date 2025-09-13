import { Link } from '@inertiajs/react';

export default function HotelCard({ hotel, checkIn, checkOut, guests }) {
    const lowestPrice = hotel.min_price || hotel.price;
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {hotel.images && hotel.images.length > 0 && (
                <img 
                    src={hotel.images[0]} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                />
            )}
            
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{hotel.city}, {hotel.country}</p>
                
                <div className="flex items-center mb-3">
                    <div className="flex items-center text-yellow-400">
                        {/* Star rating would go here */}
                        <span className="text-sm text-gray-600 ml-1">(4.5)</span>
                    </div>
                </div>
                
                <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities && hotel.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{hotel.amenities.length - 3} more
                        </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-indigo-600">${lowestPrice}</p>
                        <p className="text-sm text-gray-600">per night</p>
                        {hotel.available_rooms !== undefined && (
                            <p className="text-sm text-green-600 mt-1">
                                {hotel.available_rooms} rooms available
                            </p>
                        )}
                    </div>
                    
                    <Link
                        href={route('hotels.show', {
                            hotel: hotel.id,
                            check_in: checkIn,
                            check_out: checkOut,
                            guests: guests
                        })}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        View Rooms
                    </Link>
                </div>
            </div>
        </div>
    );
}