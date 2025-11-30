"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterOptions } from '@/lib/types';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const categories = ['restaurant', 'cafe', 'bank', 'pharmacy', 'hospital', 'school', 'university', 'shop', 'supermarket', 'convenience', 'clothes', 'books', 'electronics', 'furniture', 'sports', 'beauty', 'hairdresser', 'car_repair', 'fuel', 'atm', 'post_office', 'library', 'museum', 'park', 'cinema', 'theatre', 'stadium', 'swimming_pool', 'fitness_centre'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories = [...filters.category];
    if (checked) {
      if (!newCategories.includes(category)) {
        newCategories.push(category);
      }
    } else {
      newCategories = newCategories.filter(c => c !== category);
    }
    onFilterChange({
      ...filters,
      category: newCategories
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: [],
      priceRange: [],
      rating: 0,
      studentDiscount: false,
      openNow: false,
      searchQuery: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Category</h4>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.category.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
              />
              <label htmlFor={category} className="text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Student Discount</h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="student-discount"
              checked={filters.studentDiscount}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, studentDiscount: !!checked })
              }
            />
            <label htmlFor="student-discount" className="text-sm">
              Available
            </label>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
