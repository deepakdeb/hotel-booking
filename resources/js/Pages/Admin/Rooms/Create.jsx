import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const amenitiesList = [
    'TV', 'Air Conditioning', 'Mini Bar', 'Safe', 'WiFi',
    'Coffee Maker', 'Hair Dryer', 'Iron', 'Balcony', 'Ocean View'
];

export default function Create({ hotel }) {
    const { data, setData, post, processing, errors } = useForm({
        type: '',
        description: '',
        capacity: 2,
        price: '',
        quantity: 1,
        amenities: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.hotels.rooms.store', hotel.id));
    };

    const handleAmenityChange = (amenity) => {
        const updatedAmenities = data.amenities.includes(amenity)
            ? data.amenities.filter(a => a !== amenity)
            : [...data.amenities, amenity];
        
        setData('amenities', updatedAmenities);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add Room to {hotel.name}
                </h2>
            }
        >
            <Head title="Add Room" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                            Room Type *
                                        </label>
                                        <input
                                            type="text"
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                                            Capacity *
                                        </label>
                                        <select
                                            id="capacity"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                        {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Price per Night ($) *
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                            Quantity Available *
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            min="1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Amenities
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

                                <div className="flex justify-end space-x-4">
                                    <Link
                                        href={route('admin.hotels.rooms.index', hotel.id)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Room'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}