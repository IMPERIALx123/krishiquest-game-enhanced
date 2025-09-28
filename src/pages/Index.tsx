import React, { useState } from 'react';
import { ShoppingCart, Calendar, Trophy, Users, Camera, Thermometer, Droplets, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { FieldScanner } from '@/components/FieldScanner';
import { FieldGame } from '@/components/FieldGame';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();
  const { currentPoints, field, tasks } = useGame();
  const [showScanner, setShowScanner] = useState(false);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  const modules = [
    {
      title: t('marketplace'),
      description: t('aiPowered'),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/marketplace',
    },
    {
      title: t('smartPlanning'),
      description: t('perfectTiming'),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/tasks',
    },
    {
      title: t('rewardPoints'),
      description: t('completeTasks'),
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/rewards',
    },
    {
      title: t('farmerNetwork'),
      description: t('shareExperience'),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/community',
    },
  ];

  const weatherInsights = [
    {
      title: '7-Day Forecast',
      description: 'Light rain expected in 2 days - ideal for recent plantings',
      icon: Droplets,
      color: 'text-blue-600',
    },
    {
      title: 'Temperature Alert',
      description: 'Temperatures dropping next week - protect sensitive crops',
      icon: Thermometer,
      color: 'text-orange-600',
    },
    {
      title: 'Optimal Conditions',
      description: 'Perfect weather for field preparation activities',
      icon: Sun,
      color: 'text-yellow-600',
    },
  ];

  const cropCalendar = [
    {
      task: t('fieldPreparation'),
      crop: 'Wheat',
      date: 'Nov 15-30',
      status: 'upcoming',
    },
    {
      task: t('sowing'),
      crop: 'Tomato',
      date: 'Oct 20-25',
      status: 'current',
    },
    {
      task: t('irrigation'),
      crop: 'Rice',
      date: 'Oct 18',
      status: 'completed',
    },
    {
      task: t('harvesting'),
      crop: 'Corn',
      date: 'Nov 5-10',
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome to KrishiQuest
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered farming companion for smarter agriculture
        </p>
      </div>

      {/* Scan Field CTA */}
      {!field && (
        <Card className="farming-card border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center text-center py-8">
            <Camera className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{t('scanYourField')}</h2>
            <p className="text-muted-foreground mb-4">
              Get started by scanning your field to receive personalized recommendations
            </p>
            <Button onClick={() => setShowScanner(true)} size="lg" className="farming-button">
              <Camera className="h-5 w-5 mr-2" />
              {t('scanYourField')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.title} to={module.href}>
              <Card className="farming-card hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className={`p-4 rounded-full ${module.bgColor} mb-4`}>
                    <Icon className={`h-8 w-8 ${module.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Field Game Section */}
      {field && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FieldGame />
          
          {/* Live Tasks */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Live Tasks
                <Badge variant="secondary">
                  {completedTasksCount}/{totalTasksCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={task.completed ? 'default' : 'outline'} className="text-xs">
                      {task.completed ? 'Complete' : 'Pending'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">+{task.points}</span>
                  </div>
                </div>
              ))}
              <Link to="/tasks">
                <Button variant="outline" className="w-full">
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Planning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Calendar */}
        <Card className="farming-card">
          <CardHeader>
            <CardTitle>{t('cropCalendar')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cropCalendar.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-l-4 border-primary/20 bg-secondary/50 rounded-r-lg">
                <div>
                  <h4 className="font-medium">{item.task}</h4>
                  <p className="text-sm text-muted-foreground">Crop: {item.crop}</p>
                  <p className="text-sm text-muted-foreground">Date: {item.date}</p>
                </div>
                <Badge className={`status-badge status-${item.status}`}>
                  {t(item.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather Insights */}
        <Card className="farming-card">
          <CardHeader>
            <CardTitle>{t('weatherInsights')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weatherInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Field Scanner Modal */}
      <FieldScanner open={showScanner} onClose={() => setShowScanner(false)} />
    </div>
  );
};

export default Index;