
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, VideoOff, Save, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const EmergencyVideoRecording: React.FC = () => {
  const [autoRecordEnabled, setAutoRecordEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle cleanup
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Stop any existing recording first
      stopRecording();
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: true 
      });
      
      // Store stream reference
      streamRef.current = stream;
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Reset recording chunks
      chunksRef.current = [];
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle data available event
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Create a blob from recorded chunks
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Clear stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        toast({
          title: "Recording Completed",
          description: "Your emergency video has been recorded. You can save it or discard it.",
        });
      };
      
      // Start recording
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // Setup timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Front camera video recording has started.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Failed",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const discardRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    toast({
      title: "Recording Discarded",
      description: "The emergency video has been discarded.",
    });
  };

  const saveRecording = () => {
    if (previewUrl) {
      // Create a download link
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `emergency-recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Recording Saved",
        description: "The emergency video has been saved to your device.",
      });
      
      // In a real app, we would upload this to Firebase Storage or similar
      console.log("In a real app, this would be uploaded to cloud storage");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAutoRecord = () => {
    setAutoRecordEnabled(!autoRecordEnabled);
    
    toast({
      title: autoRecordEnabled ? "Auto-Record Disabled" : "Auto-Record Enabled",
      description: autoRecordEnabled 
        ? "Video will not automatically start recording during emergencies." 
        : "Video will automatically start recording when SOS is activated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center">
          <Camera className="h-4 w-4 mr-2 text-emergency-DEFAULT" />
          Emergency Video Recording
        </CardTitle>
        <CardDescription>
          Record video evidence during emergencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Auto-Record Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-record">Auto-Record with SOS</Label>
              <p className="text-xs text-muted-foreground">
                Automatically start recording when SOS is activated
              </p>
            </div>
            <Switch 
              id="auto-record" 
              checked={autoRecordEnabled}
              onCheckedChange={toggleAutoRecord}
            />
          </div>
          
          {/* Video Preview or Camera View */}
          <div className="relative bg-black rounded-md overflow-hidden aspect-video">
            {previewUrl ? (
              <video 
                className="w-full h-full" 
                src={previewUrl} 
                controls
              />
            ) : (
              <video 
                ref={videoRef} 
                className="w-full h-full" 
                autoPlay 
                muted 
                playsInline
              />
            )}
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-1"></div>
                REC {formatTime(recordingTime)}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex justify-between">
            {previewUrl ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={discardRecording}
                  className="flex items-center"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Discard
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={saveRecording}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center ${isRecording ? 'text-red-500' : ''}`}
                >
                  {isRecording ? (
                    <>
                      <VideoOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground self-center">
                  {isRecording ? 'Recording...' : 'Ready to record'}
                </p>
              </>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Note: In an emergency, videos can be automatically uploaded to secure cloud storage for evidence preservation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyVideoRecording;
