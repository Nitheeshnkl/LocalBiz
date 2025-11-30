"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchInstitutions, getBusinesses } from '@/lib/api';
import { Institution, Business, FilterOptions } from '@/lib/types';
import { MapPin, List, ArrowLeft } from 'lucide-react';
import InstitutionSelector from '@/components/ui/InstitutionSelector';
import SearchBar from '@/components/ui/SearchBar';
import FilterSidebar from '@/components/ui/FilterSidebar';
import MapView from '@/components/ui/MapView';
import BusinessCard from '@/components/ui/BusinessCard';

export default function BusinessesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState<'list' | 'map'>(searchParams.get('map') === 'true' ? 'map' : 'list');
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [],
    rating: 0,
    studentDiscount: false,
    openNow: false,
    searchQuery: '',
  });

  // --- Load Institutions + Businesses ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const institutionsData = await fetchInstitutions();
        setInstitutions(institutionsData);

        if (selectedInstitution) {
          const businessesData = await getBusinesses(
            selectedInstitution.lat,
            selectedInstitution.lon
          );
          setBusinesses(businessesData);
          setFilteredBusinesses(businessesData);
        } else {
          setBusinesses([]);
          setFilteredBusinesses([]);
        }
      } catch (error) {
        console.error('Failed to load:', error);
        setBusinesses([]);
        setFilteredBusinesses([]);
        setInstitutions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedInstitution]);

  // --- Apply Filters ---
  useEffect(() => {
    let filtered = businesses;

    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((b) => filters.category.includes(b.category));
    }

    if (filters.rating > 0) {
      filtered = filtered.filter((b) => b.rating >= filters.rating);
    }

    if (filters.studentDiscount) {
      filtered = filtered.filter((b) => b.studentDiscount);
    }

    setFilteredBusinesses(filtered);
  }, [searchQuery, filters, businesses]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedInstitution) params.append('institution', selectedInstitution.id);
    if (selectedCategory) params.append('category', selectedCategory);
    if (viewMode === 'map') params.append('map', 'true');

    router.push(`/businesses?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-700">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-gray-900">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-700 hover:text-black font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <h1 className="text-2xl font-bold text-gray-900">
              Business Directory
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className="text-gray-700 hover:text-black"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>

            <Button
              size="sm"
              variant={viewMode === 'map' ? 'default' : 'outline'}
              className="text-gray-700 hover:text-black"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
        </div>
      </header>

      <div className="h-20" /> {/* Spacer for fixed header */}

      {/* --- SEARCH + INSTITUTION --- */}
      <div className="bg-white border-b pb-4">
        <div className="container mx-auto px-4 mt-4 flex flex-col md:flex-row gap-4">
          <InstitutionSelector
            selectedInstitution={selectedInstitution}
            onSelect={setSelectedInstitution}
          />

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4 py-8 flex gap-6">
        {/* --- SIDEBAR --- */}
        <aside className="w-64 bg-white shadow-sm rounded-xl p-5 h-fit">
          <h2 className="text-xl font-semibold mb-3">Filters</h2>
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* --- MAIN AREA --- */}
        <main className="flex-1">
          {viewMode === 'list' ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  {filteredBusinesses.length} Businesses Found
                </h2>

                {selectedInstitution && (
                  <Badge variant="secondary" className="text-gray-700">
                    Near {selectedInstitution.name}
                  </Badge>
                )}
              </div>

              {filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-white shadow-sm rounded-xl">
                  <p className="text-gray-600">No businesses found.</p>
                </Card>
              )}
            </>
          ) : (
            <MapView
              businesses={filteredBusinesses}
              institutions={institutions}
              selectedInstitution={selectedInstitution}
            />
          )}
        </main>
      </div>
    </div>
  );
}
