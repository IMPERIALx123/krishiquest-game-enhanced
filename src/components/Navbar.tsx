import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, Trophy, Users, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { NotificationDrawer } from './NotificationDrawer';
import { ProfileDrawer } from './ProfileDrawer';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentPoints } = useGame();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('tasks'), href: '/tasks', icon: Calendar },
    { name: t('marketplace'), href: '/marketplace', icon: ShoppingCart },
    { name: t('rewards'), href: '/rewards', icon: Trophy },
    { name: t('community'), href: '/community', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <span className="ml-2 text-xl font-bold text-foreground">KrishiQuest</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Points Display */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{t('points')}:</span>
                <Badge variant="secondary" className="font-bold">
                  {currentPoints}
                </Badge>
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(true)}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-1 text-xs ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Drawers */}
      <NotificationDrawer 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <ProfileDrawer 
        open={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  );
};