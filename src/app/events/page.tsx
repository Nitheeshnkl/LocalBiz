"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Local Business Networking Event',
        description: 'Connect with local entrepreneurs and business owners in Coimbatore.',
        date: '2024-12-15',
        time: '10:00 AM',
        location: 'Coimbatore Business Center',
        category: 'Networking',
        attendees: 45,
        maxAttendees: 100,
      },
      {
        id: '2',
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups pitch their ideas to investors.',
        date: '2024-12-20',
        time: '2:00 PM',
        location: 'Innovation Hub',
        category: 'Competition',
        attendees: 78,
        maxAttendees: 150,
      },
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Local Events</h1>
          <p className="text-muted-foreground">
            Discover upcoming events and networking opportunities in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>
                </div>

                <Button className="w-full">
                  Register for Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No upcoming events</p>
              <p>Check back later for new events in your area.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
