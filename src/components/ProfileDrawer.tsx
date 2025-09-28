import React from 'react';
import { X, User, MapPin, Phone, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const { currentPoints, completedTasks } = useGame();

  const profileData = {
    name: 'Rajesh Kumar',
    location: 'Pune, Maharashtra',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    joinDate: 'January 2024',
    farmSize: '5 acres',
    primaryCrops: 'Wheat, Rice, Sugarcane',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">{t('profile')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-lg">RK</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{profileData.name}</h3>
              <p className="text-muted-foreground flex items-center justify-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {profileData.location}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-primary">{currentPoints}</div>
                <div className="text-sm text-muted-foreground">{t('points')}</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-primary">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Tasks Done</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Farm Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Farm Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Farm Size:</span>
                  <span className="ml-2 font-medium">{profileData.farmSize}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Primary Crops:</span>
                  <span className="ml-2 font-medium">{profileData.primaryCrops}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                {t('settings')}
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};