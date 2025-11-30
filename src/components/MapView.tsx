"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useRef, useEffect } from "react";
import { Business, Institution } from "@/lib/types";

interface MapViewProps {
  businesses: Business[];
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Error loading map</div>;
    case Status.SUCCESS:
      return <div>Map loaded</div>;
  }
};

function MyMapComponent({ businesses }: MapViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      const map = new google.maps.Map(ref.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 10,
      });
      mapRef.current = map;

      // Add markers for businesses
      businesses.forEach((business) => {
        new google.maps.Marker({
          position: { lat: business.latitude, lng: business.longitude },
          map,
          title: business.name,
        });
      });
    }
  }, [businesses]);

  return <div ref={ref} style={{ height: "400px", width: "100%" }} />;
}

export default function MapView({ businesses }: MapViewProps) {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
      <MyMapComponent businesses={businesses} />
    </Wrapper>
  );
}
