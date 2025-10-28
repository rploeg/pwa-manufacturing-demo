# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-10-28

### Added

- Initial release of Versuni Frontline PWA
- React 18 + TypeScript + Vite foundation
- Azure AI Foundry Agent Service integration
  - Multi-agent orchestration support
  - Token streaming with SSE
  - Typed client with retry logic
- Digital Twin explorer
  - Site → Line → Machine → Sensor hierarchy
  - Real-time metrics via WebSocket
  - Alarm management
- Voice handover feature
  - MediaRecorder API integration
  - Transcription and summarization
  - Action item extraction
- Guided scenario templates
  - Quality checks
  - Maintenance workflows
  - Downtime analysis
  - Safety checklists
- Responsive UI for phone, tablet, desktop
  - Bottom navigation (phone)
  - Left rail navigation (tablet)
  - Persistent sidebar (desktop)
- Offline-first architecture
  - Service worker with Workbox
  - IndexedDB caching with Dexie
  - Offline request queue
- Azure AD authentication (MSAL Browser)
- MSW mocks for development
- Comprehensive testing setup
  - Vitest for unit tests
  - React Testing Library
  - Playwright for E2E
- CI/CD pipeline with GitHub Actions
- Tailwind CSS + shadcn/ui components
- i18n support (en/nl scaffolding)
- WCAG 2.1 AA accessibility

### Notes

- ARM64 compatible (no native dependencies)
- Lighthouse PWA score ≥ 90
- TypeScript strict mode enabled
- Production-ready configuration
