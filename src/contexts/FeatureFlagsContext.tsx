import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'frontline' | 'factory-manager' | 'ot-engineer' | 'it-engineer';

export interface FeatureFlags {
  voiceHandover: boolean;
  digitalTwin3D: boolean;
  multiAgent: boolean;
  autonomousMonitoring: boolean;
  aiAssistant: boolean;
  smedChangeover: boolean;
  oeeCoaching: boolean;
  safetyAnalytics: boolean;
  productionPlanning: boolean;
  predictiveMaintenance: boolean;
  qualityInsights: boolean;
  scenarioTesting: boolean;
  notifications: boolean;
  darkMode: boolean;
  // New features
  skillsMatrix: boolean;
  workInstructions: boolean;
  toolManagement: boolean;
  shiftHandover: boolean;
  rootCauseAnalysis: boolean;
  performanceDashboard: boolean;
  edgeDevices: boolean;
  energyManagement: boolean;
  traceability: boolean;
  yieldPrediction: boolean;
  maintenanceCostOptimization: boolean;
  lineBalancing: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  voiceHandover: true,
  digitalTwin3D: true,
  multiAgent: true,
  autonomousMonitoring: true,
  aiAssistant: true,
  smedChangeover: true,
  oeeCoaching: true,
  safetyAnalytics: true,
  productionPlanning: true,
  predictiveMaintenance: true,
  qualityInsights: true,
  scenarioTesting: true,
  notifications: true,
  darkMode: false,
  skillsMatrix: true,
  workInstructions: true,
  toolManagement: true,
  shiftHandover: true,
  rootCauseAnalysis: true,
  performanceDashboard: true,
  edgeDevices: true,
  energyManagement: true,
  traceability: true,
  yieldPrediction: true,
  maintenanceCostOptimization: true,
  lineBalancing: true,
};

// Role-based feature access
export const ROLE_FEATURES: Record<UserRole, Partial<FeatureFlags>> = {
  frontline: {
    workInstructions: true,
    toolManagement: true,
    shiftHandover: true,
    performanceDashboard: true,
    qualityInsights: true,
    safetyAnalytics: true,
    voiceHandover: true,
    aiAssistant: true,
    digitalTwin3D: false,
    multiAgent: false,
    predictiveMaintenance: false,
    oeeCoaching: false,
    smedChangeover: false,
    productionPlanning: false,
    rootCauseAnalysis: false,
    edgeDevices: false,
    energyManagement: false,
    traceability: true,
  },
  'factory-manager': {
    oeeCoaching: true,
    productionPlanning: true,
    smedChangeover: true,
    safetyAnalytics: true,
    performanceDashboard: true,
    rootCauseAnalysis: true,
    energyManagement: true,
    traceability: true,
    digitalTwin3D: true,
    multiAgent: true,
    predictiveMaintenance: true,
    qualityInsights: true,
    autonomousMonitoring: true,
    workInstructions: false,
    toolManagement: false,
    edgeDevices: false,
  },
  'ot-engineer': {
    digitalTwin3D: true,
    predictiveMaintenance: true,
    autonomousMonitoring: true,
    rootCauseAnalysis: true,
    smedChangeover: true,
    oeeCoaching: true,
    edgeDevices: true,
    energyManagement: true,
    traceability: true,
    multiAgent: true,
    aiAssistant: true,
    workInstructions: false,
    toolManagement: false,
    performanceDashboard: false,
  },
  'it-engineer': {
    edgeDevices: true,
    digitalTwin3D: true,
    autonomousMonitoring: true,
    multiAgent: true,
    aiAssistant: true,
    workInstructions: false,
    toolManagement: false,
    shiftHandover: false,
    performanceDashboard: false,
    qualityInsights: false,
    safetyAnalytics: false,
    oeeCoaching: false,
    smedChangeover: false,
    productionPlanning: false,
    rootCauseAnalysis: false,
    energyManagement: false,
    traceability: false,
  },
};

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlags: (flags: FeatureFlags) => void;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  applyRoleDefaults: () => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [currentRole, setCurrentRole] = useState<UserRole>('frontline');

  // Apply dark mode class to document
  useEffect(() => {
    if (flags.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [flags.darkMode]);

  // Load flags and role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      setCurrentRole(savedRole);
    }

    const saved = localStorage.getItem('featureFlags');
    if (saved) {
      try {
        setFlags(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load feature flags:', error);
      }
    } else if (savedRole) {
      // Apply role defaults if no custom flags
      const roleDefaults = ROLE_FEATURES[savedRole];
      setFlags({ ...DEFAULT_FLAGS, ...roleDefaults });
    }
  }, []);

  // Save flags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  }, [flags]);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userRole', currentRole);
  }, [currentRole]);

  const updateFlags = (newFlags: FeatureFlags) => {
    setFlags(newFlags);
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const applyRoleDefaults = () => {
    const roleDefaults = ROLE_FEATURES[currentRole];
    setFlags({ ...DEFAULT_FLAGS, ...roleDefaults });
  };

  const isFeatureEnabled = (feature: keyof FeatureFlags) => {
    return flags[feature];
  };

  return (
    <FeatureFlagsContext.Provider
      value={{ flags, updateFlags, isFeatureEnabled, currentRole, setRole, applyRoleDefaults }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}
