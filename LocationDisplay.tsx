
import React, { useState, useEffect } from 'react';
import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LocationDisplayProps {
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(newLocation);
        onLocationUpdate(newLocation);
        setLoading(false);
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        setLocationError(errorMessage);
        setLoading(false);
      }
    );
  };

  // Get location when component mounts
  useEffect(() => {
    getCurrentLocation();
    
    // Set up regular location updates
    const intervalId = setInterval(() => {
      getCurrentLocation();
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-emergency-DEFAULT" />
          Current Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emergency-DEFAULT"></div>
          </div>
        ) : locationError ? (
          <div className="text-center py-4">
            <p className="text-sm text-emergency-DEFAULT mb-2">{locationError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={getCurrentLocation}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : location ? (
          <div className="space-y-2">
            <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p className="text-sm">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                className="h-8"
              >
                <Map className="h-4 w-4 mr-1" />
                Update
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your location will be shared with emergency contacts when you activate SOS
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default LocationDisplay;
