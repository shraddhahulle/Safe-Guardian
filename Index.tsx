
import React, { useState, useCallback } from 'react';
import { ContactsProvider } from '@/context/ContactsContext';
import Header from '@/components/Header';
import EmergencyButton from '@/components/EmergencyButton';
import LocationDisplay from '@/components/LocationDisplay';
import ContactCard from '@/components/ContactCard';
import AddContactDialog from '@/components/AddContactDialog';
import EmergencySettings from '@/components/EmergencySettings';
import SoundDetection from '@/components/SoundDetection';
import FakeCallFeature from '@/components/FakeCallFeature';
import EmergencyVideoRecording from '@/components/EmergencyVideoRecording';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContacts } from '@/context/ContactsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRound, Settings, MapPin, Bell, Shield, Camera } from 'lucide-react';

const ContactsList = () => {
  const { contacts } = useContacts();
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-3">Emergency Contacts</h2>
      
      {contacts.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <UserRound className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No contacts added yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-2">
            {contacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </ScrollArea>
      )}
      
      <AddContactDialog />
    </div>
  );
};

const IndexContent = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
  };

  const handleDangerDetected = useCallback(() => {
    // This would trigger the SOS functionality
    const sosButton = document.querySelector('.sos-button') as HTMLButtonElement;
    if (sosButton) {
      sosButton.click(); // Programmatically click the SOS button
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-10 mt-6">
        <EmergencyButton currentLocation={currentLocation} />
      </div>
      
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contacts" className="flex items-center">
            <UserRound className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="mt-4">
          <ContactsList />
        </TabsContent>
        
        <TabsContent value="location" className="mt-4">
          <LocationDisplay onLocationUpdate={handleLocationUpdate} />
        </TabsContent>
        
        <TabsContent value="tools" className="mt-4">
          <div className="space-y-4">
            <FakeCallFeature />
            <EmergencyVideoRecording />
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-4">
            <SoundDetection onDangerDetected={handleDangerDetected} />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <EmergencySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index = () => {
  return (
    <ContactsProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <IndexContent />
      </div>
    </ContactsProvider>
  );
};

export default Index;
