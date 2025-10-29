import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@/features/home/HomePage';
import { ChatPage } from '@/features/chat/ChatPage';
import { TwinPage } from '@/features/twin/TwinPage';
import { QualityPage } from '@/features/quality/QualityPage';
import { MaintenancePage } from '@/features/maintenance/MaintenancePage';
import { PredictivePage } from '@/features/predictive/PredictivePage';
import { KnowledgePage } from '@/features/knowledge/KnowledgePage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import ChangeoverPage from '@/features/changeover/ChangeoverPage';
import SafetyPage from '@/features/safety/SafetyPage';
import OEECoachingPage from '@/features/oee-coaching/OEECoachingPage';
import ProductionPlanningPage from '@/features/planning/ProductionPlanningPage';
import { SkillsMatrixPage } from '@/features/skills/SkillsMatrixPage';
import { WorkInstructionsPage } from '@/features/work-instructions/WorkInstructionsPage';
import { ToolManagementPage } from '@/features/tools/ToolManagementPage';
import { EdgeDevicesPage } from '@/features/edge/EdgeDevicesPage';
import { ShiftHandoverPage } from '@/features/handover/ShiftHandoverPage';
import { RootCauseAnalysisPage } from '@/features/rca/RootCauseAnalysisPage';
import { PerformanceDashboardPage } from '@/features/performance/PerformanceDashboardPage';
import { EnergyManagementPage } from '@/features/energy/EnergyManagementPage';
import { TraceabilityPage } from '@/features/traceability/TraceabilityPage';
import SAPIntegrationPage from '@/pages/SAPIntegrationPage';
import PredictiveScenariosPage from '@/pages/PredictiveScenariosPage';
import OptimizationPage from '@/pages/OptimizationPage';
import { YieldPredictionPage } from '@/features/yield/YieldPredictionPage';
import { AIScenariosDashboard } from '@/features/ai-scenarios/AIScenariosDashboard';
import { LineBalancingPage } from '@/features/line-balancing/LineBalancingPage';
import { MaintenanceCostPage } from '@/features/maintenance-cost/MaintenanceCostPage';

export function Router() {
  return (
    <BrowserRouter basename="/pwa-manufacturing-demo">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
          <Route path="twin" element={<TwinPage />} />
          <Route path="twin/:nodeId" element={<TwinPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="predictive" element={<PredictivePage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="changeover" element={<ChangeoverPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="oee-coaching" element={<OEECoachingPage />} />
          <Route path="planning" element={<ProductionPlanningPage />} />
          <Route path="skills" element={<SkillsMatrixPage />} />
          <Route path="work-instructions" element={<WorkInstructionsPage />} />
          <Route path="tools" element={<ToolManagementPage />} />
          <Route path="edge-devices" element={<EdgeDevicesPage />} />
          <Route path="shift-handover" element={<ShiftHandoverPage />} />
          <Route path="rca" element={<RootCauseAnalysisPage />} />
          <Route path="performance" element={<PerformanceDashboardPage />} />
          <Route path="energy" element={<EnergyManagementPage />} />
          <Route path="traceability" element={<TraceabilityPage />} />
          <Route path="sap-integration" element={<SAPIntegrationPage />} />
          <Route path="predictive-scenarios" element={<PredictiveScenariosPage />} />
          <Route path="optimization" element={<OptimizationPage />} />
          <Route path="yield-prediction" element={<YieldPredictionPage />} />
          <Route path="ai-scenarios" element={<AIScenariosDashboard />} />
          <Route path="line-balancing" element={<LineBalancingPage />} />
          <Route path="maintenance-cost" element={<MaintenanceCostPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
