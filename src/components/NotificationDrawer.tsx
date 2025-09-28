import React from 'react';
import { X, Thermometer, Calendar, Droplets, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'temperature' | 'task' | 'weather' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'temperature',
    title: 'Temperature Alert',
    message: 'High temperature expected tomorrow (38°C). Consider early morning watering.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'task',
    title: 'Task Due',
    message: 'Field irrigation is due today for Plot A.',
    time: '4 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'weather',
    title: 'Weather Update',
    message: 'Light rain expected in 2 days - perfect for recent plantings.',
    time: '1 day ago',
    read: true,
  },
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { t } = useLanguage();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 'task':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'weather':
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">{t('notifications')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b border-border p-4 hover:bg-secondary/50 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="destructive" className="ml-2 h-2 w-2 rounded-full p-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full">
              Mark All as Read
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};