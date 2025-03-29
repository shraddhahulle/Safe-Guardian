
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Clock, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const FakeCallFeature: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [delay, setDelay] = useState('30');
  const [callerName, setCallerName] = useState('Mom');
  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCallAnswered, setIsCallAnswered] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/5299/5299-preview.mp3');
    audioRef.current.loop = true;
    
    voiceAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, []);

  const initiateCall = () => {
    const delaySeconds = parseInt(delay);
    
    toast({
      title: "Fake Call Scheduled",
      description: `You will receive a call from "${callerName}" in ${delaySeconds} seconds.`,
    });
    
    setCountdown(delaySeconds);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          activateCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };
  
  const initiateQuickCall = () => {
    toast({
      title: "Quick Fake Call",
      description: `You will receive a call from "${callerName}" in 2 seconds.`,
    });
    
    setCountdown(2);
    
    setTimeout(() => {
      activateCall();
    }, 2000);
  };
  
  const activateCall = () => {
    setIsCallActive(true);
    // Play ringtone
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Failed to play ringtone:", error);
      });
    }
  };
  
  const answerCall = () => {
    setIsCallAnswered(true);
    // Stop ringtone
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Start conversation audio after a short delay
    setTimeout(() => {
      setConversationActive(true);
      if (voiceAudioRef.current) {
        voiceAudioRef.current.play().catch(error => {
          console.error("Failed to play voice audio:", error);
        });
      }
      
      // Display conversation messages
      showConversationMessage("Hi there! How are you doing today?");
      
      // Add more conversation lines with delays
      setTimeout(() => {
        showConversationMessage("Oh, I wanted to check if we're still meeting tomorrow?");
      }, 5000);
      
      setTimeout(() => {
        showConversationMessage("Great! I'll see you then. Stay safe!");
      }, 10000);
      
      // End call after conversation
      setTimeout(() => {
        endCall();
      }, 15000);
    }, 500);
  };
  
  const showConversationMessage = (message: string) => {
    toast({
      title: callerName + " says:",
      description: message,
    });
  };
  
  const endCall = () => {
    setIsCallActive(false);
    setIsCallAnswered(false);
    setConversationActive(false);
    
    // Stop all audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    
    toast({
      title: "Call Ended",
      description: "Fake call has been ended.",
    });
  };
  
  const cancelScheduledCall = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    
    setCountdown(0);
    
    toast({
      title: "Call Cancelled",
      description: "Scheduled fake call has been cancelled.",
    });
  };

  if (isCallActive) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold mb-1">{callerName}</h2>
            
            {!isCallAnswered ? (
              <>
                <p className="text-sm text-gray-500 mb-6">Incoming call...</p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    variant="destructive" 
                    className="flex items-center justify-center" 
                    onClick={endCall}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-green-500 hover:bg-green-600 flex items-center justify-center" 
                    onClick={answerCall}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Answer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-green-500 mb-2">Call connected</p>
                {conversationActive && <p className="text-sm text-gray-500 mb-6">Call in progress...</p>}
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center mt-2" 
                  onClick={endCall}
                >
                  <X className="mr-2 h-4 w-4" />
                  End Call
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center">
          <Phone className="h-4 w-4 mr-2 text-neutral-DEFAULT" />
          Fake Call
        </CardTitle>
        <CardDescription>
          Schedule a fake call to help you exit unsafe situations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {countdown > 0 ? (
            <div className="text-center">
              <p className="text-sm mb-2">Call will be received in:</p>
              <div className="text-2xl font-bold mb-4">{countdown} seconds</div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={cancelScheduledCall}
              >
                Cancel Call
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="caller-name">Caller Name</Label>
                <Input
                  id="caller-name"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="Mom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="call-delay">Call Delay</Label>
                <Select value={delay} onValueChange={setDelay}>
                  <SelectTrigger id="call-delay">
                    <SelectValue placeholder="Select delay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="w-full" 
                  onClick={initiateCall}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Call
                </Button>
                
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600" 
                  onClick={initiateQuickCall}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Quick Call (2s)
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FakeCallFeature;
