
import React, { useState } from 'react';
import { Bell, Settings, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

const Header: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Emergency Alert',
      message: 'Your SOS alert was sent to 3 contacts',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false
    },
    {
      id: '2',
      title: 'Location Updated',
      message: 'Your current location has been updated',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false
    },
    {
      id: '3',
      title: 'New Emergency Contact',
      message: 'Family member was added to your contacts',
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleClearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification removed",
      description: "The notification has been removed.",
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-full shadow-md">
            <img 
              src="/lovable-uploads/b057a3c7-4a25-401b-bc21-807d4a6e130b.png" 
              alt="SafeGuardian Logo" 
              className="h-12 w-12" 
            />
          </div>
          <h1 className="text-xl font-bold text-red-600">
            SafeGuardian
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-neutral-DEFAULT" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`flex flex-col items-start p-3 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-slate-50'}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex w-full justify-between">
                        <span className="font-medium">{notification.title}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 ml-2 -mr-2"
                          onClick={(e) => handleClearNotification(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">{notification.message}</span>
                      <span className="text-xs text-muted-foreground mt-1">{formatTime(notification.timestamp)}</span>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-red-600 rounded-full absolute top-3 right-3"></span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-neutral-DEFAULT" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>App Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Account</h3>
                    <p className="text-sm text-muted-foreground mb-2">Manage your account settings</p>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Profile Settings
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">App Appearance</h3>
                    <p className="text-sm text-muted-foreground mb-2">Customize how the app looks</p>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Theme Settings
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Emergency Settings</h3>
                    <p className="text-sm text-muted-foreground mb-2">Configure emergency response</p>
                    <SheetClose asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                        // Get the settings tab and programmatically click it
                        const settingsTab = document.querySelector('[value="settings"]') as HTMLElement;
                        if (settingsTab) {
                          settingsTab.click();
                        }
                      }}>
                        Open Emergency Settings
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground mb-2">App information</p>
                    <div className="text-sm text-muted-foreground">
                      <p>SafeGuardian v1.0.0</p>
                      <p className="mt-1">Your personal safety companion</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
