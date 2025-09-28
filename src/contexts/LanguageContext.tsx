import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    tasks: 'Tasks',
    marketplace: 'MarketPlace',
    rewards: 'Rewards',
    community: 'Community',
    profile: 'Profile',
    points: 'Points',
    smartPlanning: 'Smart Planning',
    perfectTiming: 'Perfect timing for plowing, planting, and harvesting',
    cropCalendar: 'Crop Calendar',
    weatherInsights: 'Weather Insights',
    scanYourField: 'Scan Your Field',
    aiPowered: 'AI-powered crop recommendations and market prices',
    rewardPoints: 'Reward Points',
    completeTasks: 'Complete tasks and earn points for farm supplies',
    farmerNetwork: 'Farmer Network',
    shareExperience: 'Share experiences and learn from other farmers',
    addYourField: 'Add Your Field',
    clickToAdd: 'Click here to scan and add your field',
    fieldPreparation: 'Field Preparation',
    sowing: 'Sowing',
    irrigation: 'Irrigation',
    harvesting: 'Harvesting',
    upcoming: 'upcoming',
    current: 'current',
    completed: 'completed',
    moistureLevel: 'Moisture Level',
    soilCondition: 'Soil Condition',
    recommendations: 'Recommendations',
    ploughField: 'Plough Your Field',
    sowSeeds: 'Sow Seeds',
    waterCrops: 'Water Crops',
    harvestCrops: 'Harvest Crops',
    viewProfile: 'View Profile',
    notifications: 'Notifications',
    settings: 'Settings',
  },
  hi: {
    home: 'होम',
    tasks: 'कार्य',
    marketplace: 'बाज़ार',
    rewards: 'पुरस्कार',
    community: 'समुदाय',
    profile: 'प्रोफ़ाइल',
    points: 'अंक',
    smartPlanning: 'स्मार्ट योजना',
    perfectTiming: 'जुताई, रोपण और कटाई के लिए सही समय',
    cropCalendar: 'फसल कैलेंडर',
    weatherInsights: 'मौसम की जानकारी',
    scanYourField: 'अपना खेत स्कैन करें',
    aiPowered: 'AI-संचालित फसल सिफारिशें और बाजार की कीमतें',
    rewardPoints: 'पुरस्कार अंक',
    completeTasks: 'कार्य पूरे करें और खेती की आपूर्ति के लिए अंक अर्जित करें',
    farmerNetwork: 'किसान नेटवर्क',
    shareExperience: 'अनुभव साझा करें और अन्य किसानों से सीखें',
    addYourField: 'अपना खेत जोड़ें',
    clickToAdd: 'अपना खेत स्कैन करने और जोड़ने के लिए यहां क्लिक करें',
    fieldPreparation: 'खेत की तैयारी',
    sowing: 'बुआई',
    irrigation: 'सिंचाई',
    harvesting: 'कटाई',
    upcoming: 'आगामी',
    current: 'वर्तमान',
    completed: 'पूर्ण',
    moistureLevel: 'नमी स्तर',
    soilCondition: 'मिट्टी की स्थिति',
    recommendations: 'सिफारिशें',
    ploughField: 'खेत जोतें',
    sowSeeds: 'बीज बोएं',
    waterCrops: 'फसलों को पानी दें',
    harvestCrops: 'फसल काटें',
    viewProfile: 'प्रोफ़ाइल देखें',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
  },
  // Add more translations for other languages as needed
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};