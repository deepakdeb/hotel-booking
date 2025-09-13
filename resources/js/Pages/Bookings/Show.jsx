import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Show({ booking }) {
    const { auth, flash } = usePage().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    
    // Ensure numeric values
    const totalPrice = parseFloat(booking.total_price) || 0;
    const roomPrice = parseFloat(booking.room.price) || 0;
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-blue-100 text-blue-800',
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Calculate nights
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    return (
        <Layout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Booking Confirmation: {booking.reference}
                </h2>
            }
        >
            <Head title={`Booking ${booking.reference}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {flash.success && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest User Notice */}
                    {!auth.user && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Important:</strong> Please save your booking reference <strong>{booking.reference}</strong>. 
                                        You can access this booking later using your email and reference number at{' '}
                                        <Link href={route('bookings.guest-access')} className="text-indigo-600 hover:text-indigo-800">
                                            the guest access page
                                        </Link>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Booking Reference: {booking.reference}</h3>
                                        <p className="text-sm text-gray-500">Booked on {formatDate(booking.created_at)}</p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Hotel Information</h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-medium">{booking.hotel.name}</p>
                                        <p className="text-gray-600">{booking.hotel.address}</p>
                                        <p className="text-gray-600">{booking.hotel.city}, {booking.hotel.country}</p>
                                        <p className="text-gray-600">Phone: {booking.hotel.phone}</p>
                                        <p className="text-gray-600">Email: {booking.hotel.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Room Information</h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-medium">{booking.room.type}</p>
                                        <p className="text-gray-600">Capacity: {booking.room.capacity} guests</p>
                                        <p className="text-gray-600">Price per night: {booking.currency} {roomPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Booking Dates</h4>
                                    <div className="space-y-1">
                                        <p><span className="font-medium">Check-in:</span> {formatDate(booking.check_in)}</p>
                                        <p><span className="font-medium">Check-out:</span> {formatDate(booking.check_out)}</p>
                                        <p><span className="font-medium">Nights:</span> {nights}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Guest Information</h4>
                                    <div className="space-y-1">
                                        <p><span className="font-medium">Name:</span> {booking.guest_name}</p>
                                        <p><span className="font-medium">Email:</span> {booking.guest_email}</p>
                                        <p><span className="font-medium">Phone:</span> {booking.guest_phone}</p>
                                        <p><span className="font-medium">Guests:</span> {booking.guests}</p>
                                    </div>
                                </div>
                            </div>

                            {booking.special_requests && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Special Requests</h4>
                                    <p className="text-gray-600">{booking.special_requests}</p>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Payment Summary</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Room Rate × {nights} nights</span>
                                        <span className="font-medium">{booking.currency} {(roomPrice * nights).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-200">
                                        <span>Total Amount</span>
                                        <span>{booking.currency} {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {booking.currency !== 'USD' ? `(Converted from USD at current exchange rates)` : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-between">
                                <div>
                                    {!auth.user && (
                                        <Link
                                            href={route('bookings.guest-access')}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Access Another Booking
                                        </Link>
                                    )}
                                    {auth.user && (
                                        <Link
                                            href={route('bookings.index')}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Back to My Bookings
                                        </Link>
                                    )}
                                </div>
                                
                                {auth.user && booking.status === 'confirmed' && (
                                    <Link
                                        href={route('bookings.destroy', booking.id)}
                                        method="delete"
                                        as="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        confirm="Are you sure you want to cancel this booking?"
                                    >
                                        Cancel Booking
                                    </Link>
                                )}
                            </div>

                            {/* Additional Help Section */}
                            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-800 uppercase mb-2">Need Help?</h4>
                                <p className="text-sm text-blue-600">
                                    If you have any questions about your booking, please contact our support team at{' '}
                                    <span className="font-medium">support@hotelbooking.com</span> or call{' '}
                                    <span className="font-medium">+1 (555) 123-4567</span>. Please have your booking reference ready.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Print/Download Section */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Save Your Booking</h4>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Print Confirmation
                            </button>
                            <button
                                onClick={() => {
                                    const bookingText = `
                                        Booking Confirmation
                                        Reference: ${booking.reference}
                                        Hotel: ${booking.hotel.name}
                                        Address: ${booking.hotel.address}, ${booking.hotel.city}, ${booking.hotel.country}
                                        Room: ${booking.room.type}
                                        Check-in: ${formatDate(booking.check_in)}
                                        Check-out: ${formatDate(booking.check_out)}
                                        Guests: ${booking.guests}
                                        Total: ${booking.currency} ${totalPrice.toFixed(2)}
                                        Status: ${booking.status}
                                    `;
                                    const blob = new Blob([bookingText], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `booking-${booking.reference}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Download Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}