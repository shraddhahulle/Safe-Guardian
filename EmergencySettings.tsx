
import React from 'react';
import { 
  Handshake, 
  Volume2, 
  BatteryLow, 
  PhoneOff,
  Clock,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const EmergencySettings: React.FC = () => {
  const { toast } = useToast();
  
  const [shakeToActivate, setShakeToActivate] = React.useState(false);
  const [voiceActivation, setVoiceActivation] = React.useState(false);
  const [lowBatteryAlert, setLowBatteryAlert] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(true);
  const [autoCallDelay, setAutoCallDelay] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'shake':
        setShakeToActivate(value);
        toast({
          title: `Shake to activate ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "Your phone will detect shaking as an emergency signal." 
            : "Shake detection has been turned off.",
        });
        break;
      case 'voice':
        setVoiceActivation(value);
        toast({
          title: `Voice activation ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "Say 'Help me' to activate emergency mode." 
            : "Voice activation has been turned off.",
        });
        break;
      case 'battery':
        setLowBatteryAlert(value);
        toast({
          title: `Low battery alerts ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "Automatic alerts will be sent when battery is below 15%." 
            : "Low battery alerts have been turned off.",
        });
        break;
      case 'offline':
        setOfflineMode(value);
        toast({
          title: `Offline mode ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "Alerts will be queued when offline and sent when back online." 
            : "Offline mode has been turned off.",
        });
        break;
      case 'autoCall':
        setAutoCallDelay(value);
        toast({
          title: `Auto call delay ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "Emergency services will be called after sending alerts." 
            : "Emergency services will be called immediately.",
        });
        break;
      case 'notifications':
        setNotificationsEnabled(value);
        toast({
          title: `Notifications ${value ? 'enabled' : 'disabled'}`,
          description: value 
            ? "You will receive app notifications for important events." 
            : "App notifications have been turned off.",
        });
        localStorage.setItem('notifications-enabled', value.toString());
        // Publish an event that the Header component can listen to
        window.dispatchEvent(new CustomEvent('notifications-setting-changed', { 
          detail: { enabled: value } 
        }));
        break;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Emergency Settings</CardTitle>
        <CardDescription>
          Configure how SafeGuardian responds in emergencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="notifications" className="text-sm font-medium">
                App Notifications
              </Label>
            </div>
            <Switch 
              id="notifications" 
              checked={notificationsEnabled}
              onCheckedChange={(value) => handleSettingChange('notifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Handshake className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="shake-activate" className="text-sm font-medium">
                Shake to Activate
              </Label>
            </div>
            <Switch 
              id="shake-activate" 
              checked={shakeToActivate}
              onCheckedChange={(value) => handleSettingChange('shake', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="voice-activate" className="text-sm font-medium">
                Voice Activation
              </Label>
            </div>
            <Switch 
              id="voice-activate" 
              checked={voiceActivation}
              onCheckedChange={(value) => handleSettingChange('voice', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BatteryLow className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="battery-alert" className="text-sm font-medium">
                Low Battery Alert
              </Label>
            </div>
            <Switch 
              id="battery-alert" 
              checked={lowBatteryAlert}
              onCheckedChange={(value) => handleSettingChange('battery', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PhoneOff className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="offline-mode" className="text-sm font-medium">
                Offline Mode
              </Label>
            </div>
            <Switch 
              id="offline-mode" 
              checked={offlineMode}
              onCheckedChange={(value) => handleSettingChange('offline', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-neutral-DEFAULT" />
              <Label htmlFor="auto-call" className="text-sm font-medium">
                Delay Auto Call
              </Label>
            </div>
            <Switch 
              id="auto-call" 
              checked={autoCallDelay}
              onCheckedChange={(value) => handleSettingChange('autoCall', value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencySettings;
