import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Show({ hotel, check_in, check_out, guests }) {
    const { auth } = usePage().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    // Calculate available rooms on the frontend using the data from backend
    const availableRooms = hotel.rooms.map(room => {
        // For now, we'll show all rooms as available since the backend already filtered
        // In a real app, you'd want to calculate availability here too
        return {
            ...room,
            available: room.quantity // Simplified for now
        };
    }).filter(room => room.available > 0);

    return (
        <Layout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {hotel.name} - Available Rooms
                </h2>
            }
        >
            <Head title={hotel.name} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Hotel Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                            <p className="text-gray-600 mb-4">{hotel.address}, {hotel.city}, {hotel.country}</p>
                            <p className="text-gray-700">{hotel.description}</p>
                            
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Check-in:</span>
                                    <p>{new Date(check_in).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Check-out:</span>
                                    <p>{new Date(check_out).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Guests:</span>
                                    <p>{guests}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Rooms */}
                    <div className="space-y-4">
                        {availableRooms.length > 0 ? (
                            availableRooms.map(room => (
                                <div key={room.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{room.type}</h3>
                                            <p className="text-gray-600 mt-2">{room.description}</p>
                                            
                                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                                <span>Capacity:</span>
                                                <span>{room.capacity} guests</span>
                                                <span>Available:</span>
                                                <span>{room.available} rooms</span>
                                                <span>Price per night:</span>
                                                <span className="font-semibold">${room.price}</span>
                                            </div>

                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="mt-3">
                                                    <h4 className="text-sm font-medium text-gray-700">Amenities:</h4>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {room.amenities.slice(0, 5).map((amenity, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="ml-6 text-right">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                ${room.price}
                                            </div>
                                            <div className="text-sm text-gray-500">per night</div>
                                            
                                            <Link
                                                href={route('bookings.create', {
                                                    hotel_id: hotel.id,
                                                    room_id: room.id,
                                                    check_in: check_in,
                                                    check_out: check_out,
                                                    guests: guests
                                                })}
                                                className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                                <p className="text-gray-500">No rooms available for the selected dates.</p>
                                <Link
                                    href={route('search')}
                                    className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                                >
                                    Search for different dates
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}