import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FieldTileType = 'empty' | 'soil' | 'planted' | 'watered' | 'grown' | 'harvested';

export interface FieldTile {
  id: string;
  type: FieldTileType;
  x: number;
  y: number;
  progress: number; // 0-100
  lastUpdated: Date;
}

export interface GameTask {
  id: string;
  type: 'plough' | 'sow' | 'water' | 'harvest';
  title: string;
  description: string;
  completed: boolean;
  points: number;
  strategy?: string;
}

export interface FieldData {
  id: string;
  name: string;
  tiles: FieldTile[];
  moistureLevel: number;
  soilCondition: string;
  recommendations: string[];
  imageUrl?: string;
}

interface GameContextType {
  field: FieldData | null;
  setField: (field: FieldData | null) => void;
  tasks: GameTask[];
  completedTasks: GameTask[];
  completeTask: (taskId: string) => void;
  updateFieldTile: (tileId: string, newType: FieldTileType) => void;
  addField: (field: FieldData) => void;
  currentPoints: number;
  addPoints: (points: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialTasks: GameTask[] = [
  {
    id: '1',
    type: 'plough',
    title: 'Plough Your Field',
    description: 'Prepare the soil for planting by ploughing',
    completed: false,
    points: 50,
    strategy: 'Plough when soil moisture is optimal (20-30%). Use cross-ploughing for better soil structure.',
  },
  {
    id: '2',
    type: 'sow',
    title: 'Sow Seeds',
    description: 'Plant seeds in the prepared field',
    completed: false,
    points: 75,
    strategy: 'Choose seeds based on season and soil type. Maintain proper spacing and depth.',
  },
  {
    id: '3',
    type: 'water',
    title: 'Water Crops',
    description: 'Provide adequate irrigation to your crops',
    completed: false,
    points: 40,
    strategy: 'Water early morning or evening. Check soil moisture before watering.',
  },
  {
    id: '4',
    type: 'harvest',
    title: 'Harvest Crops',
    description: 'Harvest your mature crops',
    completed: false,
    points: 100,
    strategy: 'Harvest at optimal maturity. Use proper tools to minimize crop damage.',
  },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [field, setField] = useState<FieldData | null>(null);
  const [tasks, setTasks] = useState<GameTask[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<GameTask[]>([]);
  const [currentPoints, setCurrentPoints] = useState(1285);

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ));
      setCompletedTasks(prev => [...prev, { ...task, completed: true }]);
      addPoints(task.points);
    }
  };

  const updateFieldTile = (tileId: string, newType: FieldTileType) => {
    if (!field) return;
    
    setField({
      ...field,
      tiles: field.tiles.map(tile =>
        tile.id === tileId 
          ? { ...tile, type: newType, lastUpdated: new Date(), progress: newType === 'grown' ? 100 : tile.progress }
          : tile
      )
    });
  };

  const addField = (newField: FieldData) => {
    setField(newField);
  };

  const addPoints = (points: number) => {
    setCurrentPoints(prev => prev + points);
  };

  return (
    <GameContext.Provider value={{
      field,
      setField,
      tasks,
      completedTasks,
      completeTask,
      updateFieldTile,
      addField,
      currentPoints,
      addPoints,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};