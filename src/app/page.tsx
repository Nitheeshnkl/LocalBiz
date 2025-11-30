"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/ui/SearchBar';
import BusinessCard from '@/components/ui/BusinessCard';
import InstitutionSelector from '@/components/ui/InstitutionSelector';
import { useState, useEffect } from 'react';
import { Institution, Business } from '@/lib/types';
import { fetchInstitutions, getBusinesses } from '@/lib/api';
import { Store, Utensils, Wrench, Sparkles, MapPin, Calendar, GraduationCap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedInstitution) params.append('institution', selectedInstitution.name);
    router.push(`/businesses?${params.toString()}`);
  };

  const filteredBusinesses = selectedInstitution
    ? businesses
    : businesses;

  const featuredBusinesses = filteredBusinesses.slice(0, 3);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load sample businesses for home page display
        const sampleBusinesses = await getBusinesses(11.0168, 76.9558); // Coimbatore coordinates
        setBusinesses(sampleBusinesses);

        // Extract unique categories
        const uniqueCategories = [...new Set(sampleBusinesses.map(b => b.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load businesses:', error);
        setBusinesses([]);
        setCategories([]);
      }
    };

    loadData();
  }, []);

  const categoryIcons = {
    'Food & Drink': Utensils,
    'Services': Wrench,
    'Retail': Store,
    'Entertainment': Sparkles,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Discover Local Businesses in Coimbatore</h1>
            <p className="text-xl text-orange-100">
              Find the best restaurants, services, and shops near your college or school
            </p>

            {/* Institution Selector */}
            <div className="flex justify-center mb-4">
              <InstitutionSelector
                selectedInstitution={selectedInstitution}
                onSelect={setSelectedInstitution}
              />
            </div>

            {selectedInstitution && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">
                    {selectedInstitution.type === 'college' ? '🎓' : '🏫'}
                  </span>
                  <div className="text-left">
                    <p className="font-semibold">{selectedInstitution.name}</p>
                    <p className="text-sm text-orange-100">
                      Showing {filteredBusinesses.length} nearby businesses
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/businesses' + (selectedInstitution ? `?institution=${selectedInstitution.name}` : ''))}>
            <CardContent className="flex items-center gap-4 p-6">
              <Store className="w-10 h-10 text-orange-600" />
              <div>
                <h3 className="font-semibold">Browse All</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedInstitution ? `Near ${selectedInstitution.name}` : 'Explore businesses'}
                </p>
              </div>
            </CardContent>
          </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/businesses?map=true' + (selectedInstitution ? `&institution=${selectedInstitution.id}` : ''))}>
            <CardContent className="flex items-center gap-4 p-6">
              <MapPin className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="font-semibold">Map View</h3>
                <p className="text-sm text-muted-foreground">Find nearby places</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/events')}>
            <CardContent className="flex items-center gap-4 p-6">
              <Calendar className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-semibold">Events</h3>
                <p className="text-sm text-muted-foreground">College offers & events</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0).map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] || Store;
            return (
              <Card
                key={category}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => router.push(`/businesses?category=${category}` + (selectedInstitution ? `&institution=${selectedInstitution.name}` : ''))}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Icon className="w-12 h-12 mb-4 text-orange-600" />
                  <h3 className="font-semibold">{category}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              {selectedInstitution ? `Businesses Near ${selectedInstitution.name}` : 'Featured Businesses'}
            </h2>
            {selectedInstitution && (
              <p className="text-muted-foreground mt-2">
                {filteredBusinesses.length} businesses found near {selectedInstitution.name}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => router.push('/businesses' + (selectedInstitution ? `?institution=${selectedInstitution.name}` : ''))}>
            View All
          </Button>
        </div>
        {featuredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No businesses found near this institution yet
            </p>
          </Card>
        )}
      </div>

      {/* Student Benefits Section */}
      <div className="bg-gradient-to-r from-green-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Student Benefits</h2>
          <p className="text-xl text-green-100 mb-8">
            Show your college/school ID and get exclusive discounts at {businesses.filter(b => b.studentDiscount).length}+ businesses!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">10-30%</h3>
              <p>Student Discounts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Late Night</h3>
              <p>Service Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Free WiFi</h3>
              <p>Study-Friendly Spots</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Business?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join our platform and reach thousands of students in Coimbatore
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push('/dashboard')}
          >
            Register Your Business
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Coimbatore Student Directory. Connecting students with local businesses.
          </p>
        </div>
      </footer>
    </div>
  );
}
