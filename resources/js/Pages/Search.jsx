import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import SearchFilters from '@/Components/SearchFilters';
import HotelCard from '@/Components/HotelCard';
import Pagination from '@/Components/Pagination';

export default function Search({ hotels, filters: initialFilters }) {
    const { auth } = usePage().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    
    const { data, setData, get } = useForm({
        search_text: initialFilters.search_text || '',
        check_in: initialFilters.check_in || '',
        check_out: initialFilters.check_out || '',
        guests: initialFilters.guests || 1,
        min_price: initialFilters.min_price || '',
        max_price: initialFilters.max_price || '',
        amenities: initialFilters.amenities || [],
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('search', data), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <Layout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Find Your Perfect Stay
                </h2>
            }
        >
            <Head title="Search Hotels" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="search_text" className="block text-sm font-medium text-gray-700">
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            id="search_text"
                                            value={data.search_text}
                                            onChange={(e) => setData('search_text', e.target.value)}
                                            placeholder="Name, Description, City or Country"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">
                                            Check-in
                                        </label>
                                        <input
                                            type="date"
                                            id="check_in"
                                            value={data.check_in}
                                            onChange={(e) => setData('check_in', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="check_out" className="block text-sm font-medium text-gray-700">
                                            Check-out
                                        </label>
                                        <input
                                            type="date"
                                            id="check_out"
                                            value={data.check_out}
                                            onChange={(e) => setData('check_out', e.target.value)}
                                            min={data.check_in || new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                                            Guests
                                        </label>
                                        <select
                                            id="guests"
                                            value={data.guests}
                                            onChange={(e) => setData('guests', parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filters Sidebar */}
                        <div className="w-full md:w-1/4">
                            <SearchFilters 
                                data={data} 
                                setData={setData} 
                                onFilterChange={() => get(route('search', data), { preserveState: true })} 
                            />
                        </div>

                        {/* Results */}
                        <div className="w-full md:w-3/4">
                            {hotels.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {hotels.data.map(hotel => (
                                            <HotelCard 
                                                key={hotel.id} 
                                                hotel={hotel} 
                                                checkIn={data.check_in}
                                                checkOut={data.check_out}
                                                guests={data.guests}
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6">
                                        <Pagination links={hotels.links} />
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                                    <p className="text-gray-500">No hotels found matching your criteria.</p>
                                    <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}