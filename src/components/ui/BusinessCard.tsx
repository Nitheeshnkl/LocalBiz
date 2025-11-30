"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, IndianRupee } from 'lucide-react';
import { Business } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className="cursor-pointer card-professional"
      onClick={() => router.push(`/business/${business.id}`)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={business.image || '/placeholder-business.jpg'}
          alt={business.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-business.jpg';
          }}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {business.studentDiscount && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            Student Discount
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="h2-professional text-lg">{business.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-primary">{business.rating}</span>
            <span className="caption-professional">({business.reviewCount})</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Badge variant="outline">{business.category}</Badge>
          <span className="flex items-center">
            <IndianRupee className="w-4 h-4" />
            {business.priceRange}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {business.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{business.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <Phone className="w-4 h-4" />
          <span>{business.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}