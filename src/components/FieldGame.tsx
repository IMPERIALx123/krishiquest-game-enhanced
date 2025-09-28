import React, { useState } from 'react';
import { Droplets, Shovel, Scissors, RotateCcw, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame, FieldTile, FieldTileType } from '@/contexts/GameContext';
import { toast } from 'sonner';

type ToolType = 'plough' | 'sow' | 'water' | 'harvest';

export const FieldGame: React.FC = () => {
  const { t } = useLanguage();
  const { field, updateFieldTile, tasks, completeTask } = useGame();
  const [selectedTool, setSelectedTool] = useState<ToolType>('plough');
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  if (!field) {
    return (
      <Card className="farming-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto">
              <Sprout className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{t('addYourField')}</h3>
            <p className="text-muted-foreground">{t('clickToAdd')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTileClick = (tile: FieldTile) => {
    if (selectedTile === tile.id) {
      setSelectedTile(null);
      return;
    }

    setSelectedTile(tile.id);
    
    // Apply tool action based on selected tool and current tile state
    let newType: FieldTileType = tile.type;
    let taskCompleted = false;

    switch (selectedTool) {
      case 'plough':
        if (tile.type === 'empty') {
          newType = 'soil';
          taskCompleted = true;
        }
        break;
      case 'sow':
        if (tile.type === 'soil') {
          newType = 'planted';
          taskCompleted = true;
        }
        break;
      case 'water':
        if (tile.type === 'planted') {
          newType = 'watered';
          // After watering, simulate growth
          setTimeout(() => {
            updateFieldTile(tile.id, 'grown');
          }, 2000);
          taskCompleted = true;
        }
        break;
      case 'harvest':
        if (tile.type === 'grown') {
          newType = 'harvested';
          taskCompleted = true;
        }
        break;
    }

    if (newType !== tile.type) {
      updateFieldTile(tile.id, newType);
      
      // Check if task should be completed
      if (taskCompleted) {
        const relatedTask = tasks.find(task => 
          !task.completed && 
          ((selectedTool === 'plough' && task.type === 'plough') ||
           (selectedTool === 'sow' && task.type === 'sow') ||
           (selectedTool === 'water' && task.type === 'water') ||
           (selectedTool === 'harvest' && task.type === 'harvest'))
        );
        
        if (relatedTask) {
          completeTask(relatedTask.id);
          toast.success(`Task completed: ${relatedTask.title}`);
        }
      }
    }
  };

  const getTileClass = (tile: FieldTile) => {
    const baseClass = 'field-tile cursor-pointer border';
    const selectedClass = selectedTile === tile.id ? 'ring-2 ring-primary' : '';
    
    switch (tile.type) {
      case 'empty':
        return `${baseClass} field-empty ${selectedClass}`;
      case 'soil':
        return `${baseClass} field-soil ${selectedClass}`;
      case 'planted':
        return `${baseClass} field-planted ${selectedClass} animate-grow-plant`;
      case 'watered':
        return `${baseClass} field-watered ${selectedClass}`;
      case 'grown':
        return `${baseClass} field-planted ${selectedClass} animate-float`;
      case 'harvested':
        return `${baseClass} bg-yellow-200 ${selectedClass} animate-harvest-bounce`;
      default:
        return `${baseClass} field-empty ${selectedClass}`;
    }
  };

  const getTileContent = (tile: FieldTile) => {
    switch (tile.type) {
      case 'planted':
        return <Sprout className="h-4 w-4 text-green-600" />;
      case 'watered':
        return <Droplets className="h-3 w-3 text-blue-500" />;
      case 'grown':
        return <Sprout className="h-5 w-5 text-green-700" />;
      case 'harvested':
        return <span className="text-xs">✓</span>;
      default:
        return null;
    }
  };

  const tools = [
    { type: 'plough' as ToolType, icon: Shovel, label: t('ploughField'), color: 'text-amber-600' },
    { type: 'sow' as ToolType, icon: Sprout, label: t('sowSeeds'), color: 'text-green-600' },
    { type: 'water' as ToolType, icon: Droplets, label: t('waterCrops'), color: 'text-blue-600' },
    { type: 'harvest' as ToolType, icon: Scissors, label: t('harvestCrops'), color: 'text-orange-600' },
  ];

  return (
    <Card className="farming-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Field Game</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Size: {field.tiles.length} tiles</Badge>
            <Badge variant="secondary">
              Moisture: {field.moistureLevel}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool(tool.type)}
                className="flex flex-col items-center h-auto py-3"
              >
                <Icon className={`h-5 w-5 mb-1 ${tool.color}`} />
                <span className="text-xs">{tool.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Field Grid */}
        <div className="relative">
          <div className="grid grid-cols-10 gap-1 bg-secondary p-4 rounded-lg">
            {field.tiles.map((tile) => (
              <div
                key={tile.id}
                className={getTileClass(tile)}
                onClick={() => handleTileClick(tile)}
                title={`Tile ${tile.x}-${tile.y}: ${tile.type}`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {getTileContent(tile)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Selected tool: <span className="font-medium text-primary">{tools.find(t => t.type === selectedTool)?.label}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click on tiles to use the selected tool. Follow the sequence: Plough → Sow → Water → Harvest
            </p>
          </div>
        </div>

        {/* Field Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground">Soil Condition</div>
            <div className="font-semibold">{field.soilCondition}</div>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground">Tiles Planted</div>
            <div className="font-semibold">
              {field.tiles.filter(t => ['planted', 'watered', 'grown', 'harvested'].includes(t.type)).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};