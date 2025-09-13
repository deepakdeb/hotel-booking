import { Head, useForm, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Create({ hotel, room, check_in, check_out, guests, currencies }) {
    const { auth } = usePage().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    
    const { data, setData, post, processing, errors } = useForm({
        hotel_id: hotel?.id || '',
        room_id: room?.id || '',
        guest_name: auth.user?.name || '',
        guest_email: auth.user?.email || '',
        guest_phone: '',
        check_in: check_in || '',
        check_out: check_out || '',
        guests: guests || 1,
        special_requests: '',
        currency: 'USD',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    const calculateTotal = () => {
        if (!room || !data.check_in || !data.check_out) return 0;
        
        const nights = Math.ceil((new Date(data.check_out) - new Date(data.check_in)) / (1000 * 60 * 60 * 24));
        const baseTotal = room.price * nights;
        
        // Get selected currency rate from the currencies prop
        const selectedCurrency = currencies.find(c => c.code === data.currency);
        const rate = selectedCurrency ? selectedCurrency.exchange_rate : 1;
        
        return baseTotal * rate;
    };

    return (
        <Layout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Complete Your Booking
                </h2>
            }
        >
            <Head title="Complete Booking" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {hotel && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
                                    <p className="text-gray-600">{hotel.address}, {hotel.city}, {hotel.country}</p>
                                    {room && (
                                        <div className="mt-3">
                                            <p className="font-medium">Room Type: {room.type}</p>
                                            <p>Capacity: {room.capacity} guests</p>
                                            <p>Price per night: ${room.price}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="guest_name"
                                            value={data.guest_name}
                                            onChange={(e) => setData('guest_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.guest_name && <p className="text-red-500 text-xs mt-1">{errors.guest_name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="guest_email"
                                            value={data.guest_email}
                                            onChange={(e) => setData('guest_email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.guest_email && <p className="text-red-500 text-xs mt-1">{errors.guest_email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="guest_phone"
                                            value={data.guest_phone}
                                            onChange={(e) => setData('guest_phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.guest_phone && <p className="text-red-500 text-xs mt-1">{errors.guest_phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                                            Number of Guests *
                                        </label>
                                        <select
                                            id="guests"
                                            value={data.guests}
                                            onChange={(e) => setData('guests', parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                        {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">
                                            Check-in Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="check_in"
                                            value={data.check_in}
                                            onChange={(e) => setData('check_in', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.check_in && <p className="text-red-500 text-xs mt-1">{errors.check_in}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="check_out" className="block text-sm font-medium text-gray-700">
                                            Check-out Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="check_out"
                                            value={data.check_out}
                                            onChange={(e) => setData('check_out', e.target.value)}
                                            min={data.check_in || new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.check_out && <p className="text-red-500 text-xs mt-1">{errors.check_out}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                            Currency
                                        </label>
                                        <select
                                            id="currency"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            {currencies.map(currency => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.code} ({currency.symbol})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700">
                                        Special Requests
                                    </label>
                                    <textarea
                                        id="special_requests"
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Any special requests or requirements..."
                                    />
                                </div>

                                {room && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Booking Summary</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span>Room Rate:</span>
                                            <span className="text-right">${room.price} per night</span>
                                            
                                            <span>Check-in:</span>
                                            <span className="text-right">{new Date(data.check_in).toLocaleDateString()}</span>
                                            
                                            <span>Check-out:</span>
                                            <span className="text-right">{new Date(data.check_out).toLocaleDateString()}</span>
                                            
                                            <span>Nights:</span>
                                            <span className="text-right">
                                                {data.check_in && data.check_out 
                                                    ? Math.ceil((new Date(data.check_out) - new Date(data.check_in)) / (1000 * 60 * 60 * 24))
                                                    : 0
                                                }
                                            </span>
                                            
                                            <span className="font-semibold">Total:</span>
                                            <span className="text-right font-semibold text-lg">
                                                {data.currency} {calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!auth.user && (
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-blue-700">
                                                    <strong>Guest Booking:</strong> You're booking as a guest. 
                                                    Please save your booking reference and email for future access.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}