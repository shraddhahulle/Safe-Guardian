import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, X, Volume2, VolumeX, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useContacts } from '@/context/ContactsContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface EmergencyButtonProps {
  currentLocation: { lat: number; lng: number } | null;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ currentLocation }) => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [autoAlertEnabled, setAutoAlertEnabled] = useState(false);
  const [autoAlertInterval, setAutoAlertInterval] = useState<NodeJS.Timeout | null>(null);
  const { contacts, getFamilyMembers } = useContacts();
  const primaryContact = contacts.find(contact => contact.isPrimary);
  const familyMembers = getFamilyMembers();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (sosActive && countdown === 0) {
      sendSOS();
      
      if (isSoundOn && audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Failed to play siren sound:", error);
        });
      }
      
      toast({
        title: "SOS Alert Sent!",
        description: `Emergency contacts have been notified of your situation${currentLocation ? ' with your location' : ''}.`,
        variant: "destructive",
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sosActive, countdown, currentLocation, isSoundOn]);

  useEffect(() => {
    if (autoAlertEnabled && !autoAlertInterval) {
      const interval = setInterval(() => {
        sendAutoAlert();
      }, 5 * 60 * 1000);
      
      setAutoAlertInterval(interval);
      
      toast({
        title: "Auto Alert Activated",
        description: "Family members will be automatically notified of your location every 5 minutes.",
        variant: "destructive",
      });
    } else if (!autoAlertEnabled && autoAlertInterval) {
      clearInterval(autoAlertInterval);
      setAutoAlertInterval(null);
      
      toast({
        title: "Auto Alert Deactivated",
        description: "Automatic location sharing has been stopped.",
      });
    }
    
    return () => {
      if (autoAlertInterval) {
        clearInterval(autoAlertInterval);
      }
    };
  }, [autoAlertEnabled]);

  useEffect(() => {
    if (familyMembers.length === 0) {
      toast({
        title: "No Family Members",
        description: "Add family members to enable automatic alerts to them in emergencies.",
        variant: "default",
      });
    }
  }, [familyMembers]);

  const activateSOS = () => {
    setSosActive(true);
    setCountdown(5);
    toast({
      title: "SOS Activating",
      description: "Sending emergency alert in 5 seconds. Tap cancel to stop.",
      variant: "destructive",
    });
  };

  const cancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  const sendSOS = () => {
    console.log("SOS Alert sent to contacts:", contacts);
    console.log("Current location:", currentLocation);
    
    const locationString = currentLocation 
      ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      : "Location unavailable";
    
    if (primaryContact) {
      console.log(`Calling ${primaryContact.name}: ${primaryContact.phone}`);
      console.log(`SMS message: 🚨 EMERGENCY! I need help! My current location: ${locationString}`);
    }
    
    if (familyMembers.length > 0) {
      console.log("Alerting family members with high priority:");
      familyMembers.forEach(member => {
        console.log(`PRIORITY Family Alert to ${member.name}: 🚨 EMERGENCY! I need immediate help! My current location: ${locationString}`);
      });
      
      toast({
        title: "Family Members Alerted",
        description: `${familyMembers.length} family members have been sent high-priority alerts.`,
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      if (isSoundOn && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setSosActive(false);
      setCountdown(5);
      
      toast({
        title: "Emergency Response Activated",
        description: "Emergency services would be contacted in a real scenario.",
        variant: "destructive",
      });
    }, 10000);
  };

  const sendAutoAlert = () => {
    const locationString = currentLocation 
      ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      : "Location unavailable";
    
    const recipients = familyMembers.length > 0 ? familyMembers : contacts;
    
    console.log("Automatic Alert: Sending location to family members");
    recipients.forEach(contact => {
      console.log(`Auto SMS to ${contact.name}: I'm checking in. My current location: ${locationString}`);
    });
    
    toast({
      title: "Auto Update Sent",
      description: "Your location has been shared with your family members.",
      variant: "default",
    });
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    toast({
      title: isSoundOn ? "Siren Sound Disabled" : "Siren Sound Enabled",
      description: isSoundOn ? "The emergency siren will not play when SOS is activated." : "The emergency siren will play when SOS is activated.",
    });
  };

  const toggleAutoAlert = () => {
    setAutoAlertEnabled(!autoAlertEnabled);
  };

  const familyCount = familyMembers.length;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-4">
        <Alert variant="destructive" className="bg-red-100 border-red-500">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Emergency Alert System</AlertTitle>
          <AlertDescription className="text-red-600">
            Press the SOS button below to activate the emergency alert system.
            {autoAlertEnabled ? " Auto alerts are currently active." : ""}
            {" "}
            {familyCount > 0 ? 
              `${familyCount} family ${familyCount === 1 ? 'member' : 'members'} will be notified.` : 
              "No family members added yet."}
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="flex items-center justify-between w-full mb-2">
        <Button 
          variant={autoAlertEnabled ? "destructive" : "outline"} 
          size="sm" 
          onClick={toggleAutoAlert} 
          className="text-xs flex items-center"
        >
          <Users className="h-3 w-3 mr-1" />
          {autoAlertEnabled ? "Disable Family Alerts" : "Enable Family Alerts"}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSound} 
          className="relative"
          title={isSoundOn ? "Disable siren sound" : "Enable siren sound"}
        >
          {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>
      
      {sosActive ? (
        <div className="flex flex-col items-center">
          <Button 
            className="relative h-32 w-32 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 sos-button animate-pulse"
            onClick={cancelSOS}
          >
            <div className="flex flex-col items-center">
              <X className="h-8 w-8 mb-1" />
              <span className="text-sm">CANCEL</span>
              <span className="text-xl font-bold">{countdown}</span>
            </div>
          </Button>
          <p className="mt-4 text-red-600 font-semibold flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 animate-pulse" />
            SOS Alert will be sent in {countdown} seconds
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Button 
            className="h-32 w-32 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 animate-pulse-emergency sos-button"
            onClick={activateSOS}
          >
            <span className="text-xl font-bold">SOS</span>
          </Button>
          <p className="mt-4 text-neutral-DEFAULT">Press to send emergency alert</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-muted-foreground text-center">
        <p>You can also activate SOS by:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Shaking your device (if enabled in settings)</li>
          <li>Using voice commands (if enabled in settings)</li>
          <li>Setting up auto alerts to regularly update family</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyButton;
