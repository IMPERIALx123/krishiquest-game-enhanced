import React from 'react';
import { Calendar, CheckCircle, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { FieldGame } from '@/components/FieldGame';

export default function Tasks() {
  const { t } = useLanguage();
  const { tasks, completedTasks, completeTask } = useGame();

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('tasks')}</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {completedTasks.length} completed
          </Badge>
          <Badge variant="outline">
            {tasks.filter(t => !t.completed).length} pending
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <Card className="farming-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.filter(task => !task.completed).map((task) => (
              <div key={task.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    +{task.points} pts
                  </Badge>
                </div>
                
                {task.strategy && (
                  <div className="p-3 bg-primary/5 rounded-md">
                    <p className="text-sm font-medium text-primary mb-1">Strategy:</p>
                    <p className="text-sm text-muted-foreground">{task.strategy}</p>
                  </div>
                )}
                
                <Button 
                  onClick={() => handleCompleteTask(task.id)}
                  className="w-full"
                >
                  Mark as Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="farming-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks completed yet. Start with your field game below!
              </p>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="p-4 border border-border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">{task.title}</h3>
                      <p className="text-sm text-green-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-green-600">
                        +{task.points} pts
                      </Badge>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Game */}
      <FieldGame />
    </div>
  );
}