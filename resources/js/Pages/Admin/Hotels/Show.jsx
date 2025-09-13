import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ hotel }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Hotel Details: {hotel.name}
                    </h2>
                    <div className="space-x-2">
                        <Link
                            href={route('admin.hotels.rooms.index', hotel.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Manage Rooms
                        </Link>
                        <Link
                            href={route('admin.hotels.edit', hotel.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Edit Hotel
                        </Link>
                        <Link
                            href={route('admin.hotels.index')}
                            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={hotel.name} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Hotel Images */}
                            {hotel.images && hotel.images.length > 0 && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        {hotel.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${hotel.name} image ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {hotel.name}</p>
                                        <p><span className="font-medium">Description:</span> {hotel.description}</p>
                                        <p><span className="font-medium">Base Price:</span> ${hotel.price} per night</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Address:</span> {hotel.address}</p>
                                        <p><span className="font-medium">City:</span> {hotel.city}</p>
                                        <p><span className="font-medium">Country:</span> {hotel.country}</p>
                                        {hotel.postal_code && (
                                            <p><span className="font-medium">Postal Code:</span> {hotel.postal_code}</p>
                                        )}
                                        <p><span className="font-medium">Phone:</span> {hotel.phone}</p>
                                        <p><span className="font-medium">Email:</span> {hotel.email}</p>
                                    </div>
                                </div>
                            </div>

                            {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hotel.amenities.map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rooms Summary */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Rooms ({hotel.rooms?.length || 0})</h3>
                                    <Link
                                        href={route('admin.hotels.rooms.create', hotel.id)}
                                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                    >
                                        Add Room
                                    </Link>
                                </div>
                                
                                {hotel.rooms && hotel.rooms.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {hotel.rooms.map(room => (
                                            <div key={room.id} className="border rounded-lg p-4">
                                                <h4 className="font-semibold">{room.type}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{room.description.substring(0, 100)}...</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <span>Capacity:</span>
                                                    <span>{room.capacity} guests</span>
                                                    <span>Price:</span>
                                                    <span>${room.price}/night</span>
                                                    <span>Available:</span>
                                                    <span>{room.quantity} rooms</span>
                                                </div>
                                                <div className="mt-3">
                                                    <Link
                                                        href={route('admin.hotels.rooms.edit', [hotel.id, room.id])}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm mr-3"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('admin.hotels.rooms.destroy', [hotel.id, room.id])}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:text-red-900 text-sm"
                                                        confirm="Are you sure you want to delete this room?"
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No rooms added yet.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings ({hotel.bookings?.length || 0})</h3>
                                {hotel.bookings && hotel.bookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Reference
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Guest
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Dates
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {hotel.bookings.map((booking) => (
                                                    <tr key={booking.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {booking.reference}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {booking.guest_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {booking.currency} {booking.total_price}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No bookings yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}