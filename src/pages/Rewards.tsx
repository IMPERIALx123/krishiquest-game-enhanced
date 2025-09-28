import React from 'react';
import { Trophy, Gift, Star, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  type: 'equipment' | 'coupon' | 'access' | 'seed';
  available: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const availableRewards: Reward[] = [
  {
    id: '1',
    title: 'Equipment Discount (25% off)',
    description: 'Get 25% off on all farming equipment purchases',
    pointsRequired: 500,
    type: 'equipment',
    available: true,
  },
  {
    id: '2',
    title: 'Fertilizer Coupon (₹500)',
    description: 'Premium organic fertilizer coupon worth ₹500',
    pointsRequired: 300,
    type: 'coupon',
    available: true,
  },
  {
    id: '3',
    title: 'Premium Tools Access',
    description: 'Access to advanced farming tools and analytics',
    pointsRequired: 800,
    type: 'access',
    available: true,
  },
  {
    id: '4',
    title: 'Seed Variety Pack',
    description: 'Premium hybrid seed collection for next season',
    pointsRequired: 600,
    type: 'seed',
    available: true,
  },
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Master Planner',
    description: 'Complete 10 planning tasks',
    unlocked: true,
    progress: 10,
    maxProgress: 10,
  },
  {
    id: '2',
    title: 'Community Helper',
    description: 'Help 5 farmers in the community',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: '3',
    title: 'Early Adopter',
    description: 'Use the app for 30 consecutive days',
    unlocked: false,
    progress: 15,
    maxProgress: 30,
  },
];

export default function Rewards() {
  const { t } = useLanguage();
  const { currentPoints, completedTasks } = useGame();

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Target className="h-8 w-8 text-blue-600" />;
      case 'coupon':
        return <Gift className="h-8 w-8 text-green-600" />;
      case 'access':
        return <Star className="h-8 w-8 text-purple-600" />;
      case 'seed':
        return <Trophy className="h-8 w-8 text-orange-600" />;
      default:
        return <Gift className="h-8 w-8 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('rewards')}</h1>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{currentPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rewards */}
        <div className="lg:col-span-2">
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete tasks and earn points for farm supplies
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getRewardIcon(reward.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {reward.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline">
                            {reward.pointsRequired} points
                          </Badge>
                          <Button
                            size="sm"
                            disabled={currentPoints < reward.pointsRequired}
                            className="text-xs"
                          >
                            {currentPoints >= reward.pointsRequired ? 'Redeem Now' : 'Not Enough Points'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points History & Achievements */}
        <div className="space-y-6">
          {/* Points Statistics */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Your Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{currentPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
                <div className="text-xs text-muted-foreground mt-1">
                  You're in the top 15% of farmers!
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Field scan completed</span>
                  <span className="text-green-600">+50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Task completed</span>
                  <span className="text-green-600">+75</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Daily login bonus</span>
                  <span className="text-green-600">+10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    {achievement.unlocked && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                      <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Earn More Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Complete daily task (+50 pts)
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Star className="h-4 w-4 mr-2" />
                Share farming tip (+30 pts)
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Target className="h-4 w-4 mr-2" />
                Refer a farmer (+100 pts)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}