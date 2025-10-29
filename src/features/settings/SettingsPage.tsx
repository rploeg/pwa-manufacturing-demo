import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import { useFeatureFlags, DEFAULT_FLAGS } from '@/contexts/FeatureFlagsContext';
import type { FeatureFlags, UserRole } from '@/contexts/FeatureFlagsContext';

export function SettingsPage() {
  const { flags, updateFlags, currentRole, setRole, applyRoleDefaults } = useFeatureFlags();
  const [localFlags, setLocalFlags] = useState<FeatureFlags>(flags);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setLocalFlags(flags);
  }, [flags]);

  useEffect(() => {
    const changed = JSON.stringify(localFlags) !== JSON.stringify(flags);
    setHasChanges(changed);
  }, [localFlags, flags]);

  const handleToggle = (key: keyof FeatureFlags) => {
    setLocalFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleSave = () => {
    updateFlags(localFlags);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setLocalFlags(DEFAULT_FLAGS);
    updateFlags(DEFAULT_FLAGS);
    setHasChanges(false);
    setSaveSuccess(false);
  };

  const handleClearCache = (type: string) => {
    switch (type) {
      case 'conversations':
        localStorage.removeItem('chatMessages');
        alert('Conversation cache cleared');
        break;
      case 'twin':
        localStorage.removeItem('twinCache');
        alert('Digital Twin cache cleared');
        break;
      case 'all':
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
          localStorage.clear();
          alert('All data cleared. The page will reload.');
          window.location.reload();
        }
        break;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
        {saveSuccess && <span className="text-sm text-green-600 font-medium">Settings saved</span>}
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">User Role</h2>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-3">
              Select your role to apply appropriate feature access
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="frontline"
                  checked={currentRole === 'frontline'}
                  onChange={(e) => {
                    setRole(e.target.value as UserRole);
                    applyRoleDefaults();
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium">Frontline Worker</div>
                  <div className="text-xs text-muted-foreground">
                    Work instructions, tools, handover, performance
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="factory-manager"
                  checked={currentRole === 'factory-manager'}
                  onChange={(e) => {
                    setRole(e.target.value as UserRole);
                    applyRoleDefaults();
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium">Factory Manager</div>
                  <div className="text-xs text-muted-foreground">
                    OEE, planning, analytics, root cause analysis
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ot-engineer"
                  checked={currentRole === 'ot-engineer'}
                  onChange={(e) => {
                    setRole(e.target.value as UserRole);
                    applyRoleDefaults();
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium">OT Engineer</div>
                  <div className="text-xs text-muted-foreground">
                    Digital twin, predictive maintenance, edge devices
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="it-engineer"
                  checked={currentRole === 'it-engineer'}
                  onChange={(e) => {
                    setRole(e.target.value as UserRole);
                    applyRoleDefaults();
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium">IT Engineer</div>
                  <div className="text-xs text-muted-foreground">
                    Edge devices, infrastructure, system monitoring
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Environment</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode:</span>
              <span className="font-mono">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Using Mocks:</span>
              <span className="font-mono text-versuni-success">True</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Voice Handover</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.voiceHandover}
                onChange={() => handleToggle('voiceHandover')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Digital Twin 3D View</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.digitalTwin3D}
                onChange={() => handleToggle('digitalTwin3D')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Multi-Agent System</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.multiAgent}
                onChange={() => handleToggle('multiAgent')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Autonomous Monitoring</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.autonomousMonitoring}
                onChange={() => handleToggle('autonomousMonitoring')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">AI Assistant (Knowledge Base)</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.aiAssistant}
                onChange={() => handleToggle('aiAssistant')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">SMED Changeover Analysis</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.smedChangeover}
                onChange={() => handleToggle('smedChangeover')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">OEE Coaching & Benchmarking</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.oeeCoaching}
                onChange={() => handleToggle('oeeCoaching')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Safety Analytics</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.safetyAnalytics}
                onChange={() => handleToggle('safetyAnalytics')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Production Planning Optimizer</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.productionPlanning}
                onChange={() => handleToggle('productionPlanning')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Predictive Maintenance</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.predictiveMaintenance}
                onChange={() => handleToggle('predictiveMaintenance')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Quality Insights</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.qualityInsights}
                onChange={() => handleToggle('qualityInsights')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Scenario Testing</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.scenarioTesting}
                onChange={() => handleToggle('scenarioTesting')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Real-time Notifications</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.notifications}
                onChange={() => handleToggle('notifications')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Dark Mode</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
            </label>
            <hr className="my-2 border-border" />
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Skills Matrix</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.skillsMatrix}
                onChange={() => handleToggle('skillsMatrix')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Work Instructions</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.workInstructions}
                onChange={() => handleToggle('workInstructions')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Tool Management</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.toolManagement}
                onChange={() => handleToggle('toolManagement')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Shift Handover</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.shiftHandover}
                onChange={() => handleToggle('shiftHandover')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Root Cause Analysis</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.rootCauseAnalysis}
                onChange={() => handleToggle('rootCauseAnalysis')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Performance Dashboard</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.performanceDashboard}
                onChange={() => handleToggle('performanceDashboard')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Edge Devices</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.edgeDevices}
                onChange={() => handleToggle('edgeDevices')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Energy Management</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.energyManagement}
                onChange={() => handleToggle('energyManagement')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Traceability</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.traceability}
                onChange={() => handleToggle('traceability')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Yield Prediction</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.yieldPrediction}
                onChange={() => handleToggle('yieldPrediction')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Maintenance Cost Optimization</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.maintenanceCostOptimization}
                onChange={() => handleToggle('maintenanceCostOptimization')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Line Balancing AI</span>
              <input
                type="checkbox"
                className="toggle"
                checked={localFlags.lineBalancing}
                onChange={() => handleToggle('lineBalancing')}
              />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Cache Management</h2>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => handleClearCache('conversations')}
            >
              Clear Conversation Cache
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => handleClearCache('twin')}>
              Clear Twin Cache
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleClearCache('all')}
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
