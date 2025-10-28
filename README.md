# Versuni Frontline PWA

Production-ready **React + TypeScript + Vite** Progressive Web App for frontline manufacturing workers, powered by **Azure AI Foundry Agent Service**.

## 🚀 Features

- ✅ **Installable PWA** – Works offline, install on any device
- ✅ **ARM64-friendly** – No native dependencies, works on Apple Silicon, Windows ARM, Linux ARM
- ✅ **Multi-agent AI** – Azure AI Foundry orchestration with specialized agents
- ✅ **Digital Twin** – Real-time manufacturing context (sites → lines → machines → sensors)
- ✅ **Voice Handovers** – Record → Transcribe → Summarize → Action Items
- ✅ **Guided Scenarios** – Quality checks, maintenance, downtime analysis
- ✅ **Responsive Design** – Phone, tablet, and desktop layouts
- ✅ **Offline-first** – IndexedDB caching with sync queue
- ✅ **TypeScript** – Full type safety with strict mode
- ✅ **Accessible** – WCAG 2.1 AA compliant with keyboard navigation

## 📋 Prerequisites

- **Node.js** ≥ 18.0.0 (ARM64 supported)
- **pnpm** ≥ 8.0.0 (recommended) or npm/yarn
- **Azure AD** application registration (for auth)
- **Azure AI Foundry** endpoint (for agents)

## 🛠️ Quick Start (ARM64-friendly)

### 1. Install dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Azure AI Foundry Agent Service
VITE_AGENT_BASE=https://your-ai-foundry.azure.com/api
VITE_ORCHESTRATOR_ENDPOINT=/orchestrator/invoke
VITE_AGENT_ENDPOINT=/agents

# Digital Twin Service
VITE_TWIN_BASE=https://your-digital-twin.azure.com/api

# Media/Handover Service
VITE_MEDIA_BASE=https://your-media-service.azure.com/api

# Azure AD (MSAL)
VITE_AAD_CLIENT_ID=your-client-id-here
VITE_AAD_TENANT_ID=your-tenant-id-here
VITE_AAD_REDIRECT_URI=http://localhost:5173

# Feature Flags
VITE_FEATURE_FLAGS=voice-handover,digital-twin,multi-agent

# Mock Mode (set to 'false' to use real endpoints)
VITE_USE_MOCKS=true

# Environment
VITE_ENV=development
```

### 3. Run development server

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
pnpm run build
pnpm run preview
```

## 🏗️ Project Structure

```
src/
├── app/                   # App shell (Router, Layout, Providers)
├── components/
│   ├── ui/                # Radix UI primitives (shadcn/ui)
│   └── navigation/        # Bottom/Desktop/Tablet nav
├── features/
│   ├── auth/              # Azure AD authentication (MSAL)
│   ├── chat/              # Agent conversations with streaming
│   ├── scenarios/         # Guided scenario templates
│   ├── twin/              # Digital Twin explorer
│   ├── quality/           # Quality checklists
│   ├── maintenance/       # Work orders & PM tasks
│   ├── handover/          # Voice handover flow
│   ├── knowledge/         # SOPs & troubleshooting
│   ├── home/              # Dashboard
│   └── settings/          # Configuration
├── data/
│   ├── clients/           # HTTP & WebSocket clients
│   ├── types.ts           # TypeScript models
│   ├── config.ts          # Environment config
│   └── db.ts              # IndexedDB (Dexie)
├── mocks/                 # MSW handlers for development
├── utils/                 # Helpers & hooks
├── index.css              # Tailwind + global styles
└── main.tsx               # Entry point

```

## 🔑 Azure AD Authentication Setup

### 1. Register Application in Azure Portal

1. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
2. Name: `Versuni Frontline PWA`
3. Supported account types: **Accounts in this organizational directory only**
4. Redirect URI: **Single-page application (SPA)** → `http://localhost:5173` (add production URL later)
5. Click **Register**

### 2. Configure Application

After registration:

1. Copy **Application (client) ID** → set as `VITE_AAD_CLIENT_ID`
2. Copy **Directory (tenant) ID** → set as `VITE_AAD_TENANT_ID`
3. Go to **Authentication**:
   - Enable **Access tokens** and **ID tokens**
   - Add additional redirect URIs for production
4. Go to **API permissions**:
   - Add **Microsoft Graph** → **User.Read** (Delegated)
   - Add custom scopes if your backend requires them

### 3. Token Acquisition Flow

The app uses **MSAL Browser** with **PKCE flow** (no client secret required for SPAs).

```typescript
// Token is automatically injected via Axios interceptor
// See: src/data/clients/http.ts
```

## 🤖 Azure AI Foundry Agent Service Integration

### Agent Architecture

The app supports **multi-agent orchestration**:

- **OrchestratorAgent** – Routes queries to specialized agents
- **DataAgent** – Manufacturing KPIs (OEE, throughput, scrap)
- **QualityAgent** – Defect taxonomy, SPC alerts
- **MaintenanceAgent** – PM schedule, RUL, parts
- **SafetyAgent** – Near-miss logging, LOTO checklists
- **KnowledgeAgent** – SOPs, past fixes, semantic search
- **HandoverAgent** – Shift handover processing

### API Contract

#### Single Agent Invocation

```http
POST /agents/{agentId}/invoke
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "What's the OEE for Line-B this shift?"
    }
  ],
  "maxTokens": 1000,
  "temperature": 0.3,
  "stream": true
}
```

#### Orchestrated Multi-Agent

```http
POST /orchestrator/invoke
Content-Type: application/json

{
  "messages": [...],
  "stream": true
}
```

#### Streaming Response (SSE)

```
data: {"delta": "Line", "agentId": "data-agent", "done": false}
data: {"delta": "-B", "agentId": "data-agent", "done": false}
...
data: [DONE]
```

### Mock Mode

By default (`VITE_USE_MOCKS=true`), the app uses **MSW (Mock Service Worker)** to simulate agent responses. This allows full offline development without backend dependencies.

## 📱 PWA Installation

### Desktop (Chrome/Edge)

1. Click the **install icon** in the address bar
2. Or: **Settings** → **Install Versuni Frontline**

### iOS (Safari)

1. Tap **Share** button
2. Scroll down → **Add to Home Screen**

### Android (Chrome)

1. Tap **menu** (⋮)
2. **Add to Home Screen**

### Offline Capabilities

- **Cached routes**: All app shell and static assets
- **IndexedDB**: Conversations, scenarios, twin snapshots, handover notes
- **Offline queue**: API requests made offline are queued and synced when online

## 🎨 Responsive Design

### Breakpoints

- **Phone**: ≤640px
- **Tablet**: 641–1024px
- **Desktop**: ≥1025px

### Navigation

| Device  | Navigation                                     |
| ------- | ---------------------------------------------- |
| Phone   | Bottom nav + floating "Ask" FAB                |
| Tablet  | Left rail (icons) + top tabs                   |
| Desktop | Persistent left sidebar + resizable split pane |

### Key Screens

- **Home**: Shift KPIs, alerts, quick actions
- **Chat**: Token-streaming conversations with agent switcher
- **Scenarios**: Card grid → stepper → results history
- **Digital Twin**: Tree search + machine detail + live metrics
- **Quality**: Guided checklist with photo/audio notes
- **Maintenance**: PM calendar + work orders + SOP steps
- **Handover**: Voice recording → transcription → summary → actions
- **Knowledge**: Search SOPs/fixes with preview pane

## 🧪 Testing

### Unit Tests (Vitest)

```bash
pnpm test
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

## 🚀 CI/CD (GitHub Actions)

`.github/workflows/ci.yml` includes:

- ✅ Type checking
- ✅ Linting
- ✅ Unit tests
- ✅ Build verification
- ✅ Lighthouse PWA audit

## 🌍 i18n (Internationalization)

The app uses **i18next** with scaffolding for `en` and `nl` locales.

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
t('home.welcome'); // "Welcome"
```

## 🔒 Security

- **CSP**: Content Security Policy headers recommended in production
- **Auth tokens**: Stored in memory (MSAL handles refresh)
- **PII**: Logs are sanitized; no secrets in console
- **HTTPS**: Required for service worker in production

## 📊 Scenarios (Ready-to-Run)

1. **"Why did Line-B OEE drop this shift?"** → Multi-agent aggregation
2. **"Top 3 downtime causes today + fixes"** → Ranked insights
3. **"Start visual quality spot-check for SKU X"** → Guided checklist
4. **"Create PM task for Machine M after 1200 cycles"** → Action card
5. **"Summarize shift handover for Line-A"** → Voice → summary
6. **"Temperature trend on Filler-3"** → Live chart with anomalies

## 🐛 Troubleshooting

### Dependencies won't install on ARM64

- Ensure you're using Node.js ≥18 (ARM64 build)
- This project has **no native dependencies** – pure JavaScript/TypeScript

### PWA doesn't install

- Service worker requires **HTTPS** in production (or `localhost` in dev)
- Check browser console for service worker errors

### Agent streaming fails

- If `VITE_USE_MOCKS=false`, ensure backend supports **Server-Sent Events (SSE)**
- Check CORS headers on backend

### Auth fails

- Verify `VITE_AAD_CLIENT_ID` and `VITE_AAD_TENANT_ID`
- Ensure redirect URI matches Azure AD app registration
- Check browser console for MSAL errors

## 📦 Tech Stack

| Category           | Technology                         |
| ------------------ | ---------------------------------- |
| **Framework**      | React 18 + TypeScript              |
| **Build**          | Vite 5                             |
| **UI Components**  | Radix UI (shadcn/ui)               |
| **Styling**        | Tailwind CSS                       |
| **State**          | Zustand + TanStack Query           |
| **Routing**        | React Router                       |
| **Auth**           | MSAL Browser (Azure AD)            |
| **HTTP**           | Axios + SSE/WebSocket              |
| **Offline**        | IndexedDB (Dexie)                  |
| **PWA**            | vite-plugin-pwa (Workbox)          |
| **Charts**         | Recharts                           |
| **i18n**           | i18next                            |
| **Testing**        | Vitest + React Testing Library     |
| **E2E**            | Playwright                         |
| **Mocking**        | MSW (Mock Service Worker)          |
| **Package Manager**| pnpm (or npm/yarn)                 |

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Azure AI Foundry** for agent orchestration
- **Radix UI** for accessible primitives
- **shadcn/ui** for beautiful components
- **Versuni** frontline workers for inspiration

---

**Built with ❤️ for frontline manufacturing workers**
