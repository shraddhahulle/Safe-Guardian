
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle, MessageCircle, MapPin, Check, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { useContacts } from '@/context/ContactsContext';
import { Badge } from '@/components/ui/badge';

interface SoundDetectionProps {
  onDangerDetected: () => void;
}

interface EmergencyMessage {
  id: string;
  contact: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  location?: string;
}

const SoundDetection: React.FC<SoundDetectionProps> = ({ onDangerDetected }) => {
  const [isListening, setIsListening] = useState(false);
  const [detectionLevel, setDetectionLevel] = useState(0);
  const [detectedSounds, setDetectedSounds] = useState<string[]>([]);
  const [emergencyMessages, setEmergencyMessages] = useState<EmergencyMessage[]>([]);
  const [showMessages, setShowMessages] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { contacts, getFamilyMembers } = useContacts();
  const familyMembers = getFamilyMembers();

  // Get location for emergency messages
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    };

    // Get location initially and then every 30 seconds
    getLocation();
    const locationInterval = setInterval(getLocation, 30000);
    
    return () => clearInterval(locationInterval);
  }, []);

  // Show example messages on initial load
  useEffect(() => {
    if (familyMembers.length > 0 && emergencyMessages.length === 0) {
      const exampleLocation = "https://maps.google.com/?q=37.7749,-122.4194";
      
      // Create example messages for demonstration - Fixed type issue by explicitly using the literal types
      const demoMessages: EmergencyMessage[] = familyMembers.slice(0, 3).map((member, index) => ({
        id: `demo-${index}`,
        contact: member.name,
        message: "🚨 EMERGENCY ALERT: This is an example of an automatic alert that would be sent in a real emergency.",
        location: exampleLocation,
        timestamp: new Date(Date.now() - (index * 30000)), // Stagger timestamps
        status: index === 0 ? 'read' : index === 1 ? 'delivered' : 'sent' as const
      }));
      
      setEmergencyMessages(demoMessages);
      
      toast({
        title: "Example Alert Messages",
        description: "These are examples of automatic alerts that would be sent to your family members in an emergency.",
      });
    }
  }, [familyMembers]);

  // Auto-activate sound detection
  useEffect(() => {
    // Auto-activate after 5 seconds
    const timer = setTimeout(() => {
      if (!isListening) {
        setIsListening(true);
        toast({
          title: "Sound Detection Auto-Activated",
          description: "SafeGuardian is now listening for dangerous sounds in the background.",
        });
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate sound detection process
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      // In a real implementation, this would be actual sound analysis
      interval = setInterval(() => {
        // Simulate random noise detection
        const randomNoise = Math.random() * 100;
        setDetectionLevel(randomNoise);
        
        // Simulate random sound detection
        if (randomNoise > 80) {
          const sounds = ['Loud noise', 'Scream', 'Breaking glass', 'Gunshot'];
          const detectedSound = sounds[Math.floor(Math.random() * sounds.length)];
          
          setDetectedSounds(prev => [detectedSound, ...prev].slice(0, 5));
          
          // If dangerous sound detected
          if (detectedSound === 'Scream' || detectedSound === 'Gunshot') {
            toast({
              title: "⚠️ Dangerous Sound Detected",
              description: `Detected ${detectedSound}. Activating emergency protocol.`,
              variant: "destructive",
            });
            
            // Send emergency messages to family members
            sendEmergencyMessages(detectedSound);
            
            // Trigger the emergency alert
            onDangerDetected();
          }
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, onDangerDetected, contacts]);

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Sound Detection Activated",
        description: "Listening for dangerous sounds like screams or gunshots.",
      });
    } else {
      toast({
        title: "Sound Detection Deactivated",
        description: "No longer listening for sounds.",
      });
    }
  };

  const sendEmergencyMessages = (detectedSound: string) => {
    // Get family members to send messages to
    const recipients = familyMembers.length > 0 ? familyMembers : contacts;
    
    // Format location for sharing if available
    const locationString = currentLocation 
      ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      : "Location unavailable";
    
    // Fixed type issue by using type-safe literals for status
    const newMessages: EmergencyMessage[] = recipients.map(contact => ({
      id: Date.now() + Math.random().toString(),
      contact: contact.name,
      message: `🚨 EMERGENCY ALERT: Dangerous sound "${detectedSound}" detected.`,
      location: locationString,
      timestamp: new Date(),
      status: 'sent' // Now we're using the correct literal type
    }));
    
    setEmergencyMessages(prev => [...newMessages, ...prev]);
    
    // Simulate delivery after a delay
    setTimeout(() => {
      setEmergencyMessages(prev => 
        prev.map(msg => 
          newMessages.some(newMsg => newMsg.id === msg.id) 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 2000);
    
    // Simulate read after another delay
    setTimeout(() => {
      setEmergencyMessages(prev => 
        prev.map(msg => 
          newMessages.some(newMsg => newMsg.id === msg.id) 
            ? { ...msg, status: 'read' } 
            : msg
        )
      );
    }, 5000);
  };

  // New function to simulate a test alert to show how it works
  const sendTestAlert = () => {
    const testSound = "Test Emergency Sound";
    toast({
      title: "Sending Test Alerts",
      description: "Sending example emergency alerts to your family contacts.",
      variant: "destructive",
    });
    sendEmergencyMessages(testSound);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
          Automatic Family Alerts
        </CardTitle>
        <CardDescription>
          In emergencies, your family receives automatic location alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Alert Status</p>
              <p className="text-sm text-muted-foreground">
                {isListening ? 'Automatic alerts ready' : 'Alerts paused'}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={sendTestAlert}
              className="flex items-center"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Test Alert
            </Button>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <h3 className="text-sm font-medium text-red-600 mb-1">How Automatic Alerts Work:</h3>
            <ol className="text-xs text-red-600 space-y-1 list-decimal pl-4">
              <li>When an emergency is detected (suspicious sounds, SOS button, etc.)</li>
              <li>SafeGuardian instantly sends SMS alerts to all family members</li>
              <li>Your exact GPS location is shared in real-time</li>
              <li>Message delivery status is tracked (sent, delivered, read)</li>
              <li>Emergency services can be automatically contacted</li>
            </ol>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-red-600" />
                Example Emergency Messages
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMessages(!showMessages)}
              >
                {showMessages ? "Hide" : "Show"}
              </Button>
            </div>
            
            {showMessages && (
              <div className="space-y-2 max-h-[250px] overflow-y-auto p-2 bg-gray-50 rounded-md">
                {emergencyMessages.length > 0 ? (
                  emergencyMessages.map((msg) => (
                    <div key={msg.id} className="bg-white p-2.5 rounded-md border text-xs shadow-sm">
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium">To: {msg.contact}</span>
                        <Badge 
                          variant={msg.status === 'read' ? "default" : 
                                  msg.status === 'delivered' ? "secondary" : "outline"}
                          className="text-[10px] h-4"
                        >
                          {msg.status === 'read' ? (
                            <span className="flex items-center"><CheckCheck className="h-3 w-3 mr-1" /> Read</span>
                          ) : msg.status === 'delivered' ? (
                            <span className="flex items-center"><Check className="h-3 w-3 mr-1" /> Delivered</span>
                          ) : (
                            'Sent'
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs break-words">{msg.message}</p>
                      {msg.location && (
                        <p className="text-xs mt-1.5 flex items-center text-blue-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <a href={msg.location} target="_blank" rel="noopener noreferrer" className="underline">
                            Live Location (tap to view map)
                          </a>
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Sent: {msg.timestamp.toLocaleTimeString()} on {msg.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No emergency messages sent yet
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
            <p className="text-xs text-red-600 font-medium">
              <span className="font-bold">Family Alert Status:</span> {familyMembers.length} family members will automatically receive emergency alerts with your live location.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundDetection;
