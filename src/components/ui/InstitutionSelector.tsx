'use client';

// react hooks imported below
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchInstitutions } from '@/lib/api';
import { Institution } from '@/lib/types';
import { useEffect, useState } from 'react';
import { School, GraduationCap, MapPin, Check } from 'lucide-react';

interface InstitutionSelectorProps {
  selectedInstitution: Institution | null;
  onSelect: (institution: Institution | null) => void;
}

export default function InstitutionSelector({ selectedInstitution, onSelect }: InstitutionSelectorProps) {
  const [open, setOpen] = useState(false);

  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await fetchInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error('Failed to load institutions:', error);
        setInstitutions([]);
      }
    };
    loadInstitutions();
  }, []);

  const colleges = institutions.filter(i => i.type === 'college').sort((a, b) => a.name.localeCompare(b.name));
  const schools = institutions.filter(i => i.type === 'school').sort((a, b) => a.name.localeCompare(b.name));

  const handleSelect = (institution: Institution) => {
    onSelect(institution);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          {selectedInstitution ? (
            <>
              <span className="text-lg">
                {selectedInstitution.type === 'college' ? '🎓' : '🏫'}
              </span>
              <span>{selectedInstitution.name}</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4" />
              <span>Select Your Institution</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Choose Your Institution
          </DialogTitle>
          <DialogDescription>
            Select your college or school to see nearby businesses and services
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colleges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="colleges">
              <GraduationCap className="w-4 h-4 mr-2" />
              Colleges ({colleges.length})
            </TabsTrigger>
            <TabsTrigger value="schools">
              <School className="w-4 h-4 mr-2" />
              Schools ({schools.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colleges" className="space-y-3 mt-4">
            {colleges.map((institution) => (
              <Card
                key={institution.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedInstitution?.id === institution.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => handleSelect(institution)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎓</span>
                      <div>
                        <CardTitle className="text-lg">{institution.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {institution.address}
                        </CardDescription>
                      </div>
                    </div>
                    {selectedInstitution?.id === institution.id && (
                      <Badge className="bg-orange-600">
                        <Check className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="schools" className="space-y-3 mt-4">
            {schools.map((institution) => (
              <Card
                key={institution.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedInstitution?.id === institution.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => handleSelect(institution)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {institution.type === 'college' ? '🎓' : '🏫'}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{institution.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {institution.address}
                        </CardDescription>
                      </div>
                    </div>
                    {selectedInstitution?.id === institution.id && (
                      <Badge className="bg-orange-600">
                        <Check className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {selectedInstitution && (
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleClear}>
              Clear Selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}