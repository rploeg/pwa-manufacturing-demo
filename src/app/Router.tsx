import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@/features/home/HomePage';
import { ChatPage } from '@/features/chat/ChatPage';
import { ScenariosPage } from '@/features/scenarios/ScenariosPage';
import { TwinPage } from '@/features/twin/TwinPage';
import { QualityPage } from '@/features/quality/QualityPage';
import { MaintenancePage } from '@/features/maintenance/MaintenancePage';
import { PredictivePage } from '@/features/predictive/PredictivePage';
import { HandoverPage } from '@/features/handover/HandoverPage';
import { KnowledgePage } from '@/features/knowledge/KnowledgePage';
import { SettingsPage } from '@/features/settings/SettingsPage';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="scenarios/:scenarioId" element={<ScenariosPage />} />
          <Route path="twin" element={<TwinPage />} />
          <Route path="twin/:nodeId" element={<TwinPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="predictive" element={<PredictivePage />} />
          <Route path="handover" element={<HandoverPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
