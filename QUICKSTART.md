# Quick Start Guide - Versuni Frontline PWA

Get up and running in **5 minutes** on your ARM64 machine.

## ⚡ Fast Track

```bash
# 1. Navigate to project
cd c:\repo\pwa-manufacturing-demo

# 2. Install dependencies (ARM64-compatible)
pnpm install
# or: npm install

# 3. Start development server with mocks
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

That's it! The app runs with **MSW mocks** - no backend required.

## 🎯 What You Get Out of the Box

- ✅ **Installable PWA** - Works offline after first visit
- ✅ **Responsive UI** - Phone, tablet, and desktop layouts
- ✅ **Mock Agents** - Azure AI Foundry simulation
- ✅ **Digital Twin** - Mock manufacturing hierarchy
- ✅ **Voice Handover** - MediaRecorder API ready
- ✅ **Offline Storage** - IndexedDB with Dexie

## 🗂️ Key Files to Explore

### Configuration
- **`.env.example`** - Environment variable template
- **`vite.config.ts`** - Vite + PWA configuration
- **`tailwind.config.js`** - Theme and colors

### Core Application
- **`src/app/App.tsx`** - Main app component
- **`src/app/Router.tsx`** - Route definitions
- **`src/app/Layout.tsx`** - Responsive layout shell

### Features
- **`src/features/home/`** - Dashboard
- **`src/features/chat/`** - Agent conversations
- **`src/features/twin/`** - Digital Twin explorer
- **`src/features/handover/`** - Voice handovers

### Data Layer
- **`src/data/clients/`** - HTTP clients (agent, twin, handover)
- **`src/data/types.ts`** - TypeScript models
- **`src/data/db.ts`** - IndexedDB schema
- **`src/mocks/handlers.ts`** - MSW mock handlers

## 🔧 Common Tasks

### Switch to Real Azure Backend

Edit `.env`:

```env
VITE_USE_MOCKS=false
VITE_AGENT_BASE=https://your-ai-foundry.azure.com/api
VITE_AAD_CLIENT_ID=your-client-id
VITE_AAD_TENANT_ID=your-tenant-id
```

### Add a New Agent

1. Update `src/mocks/handlers.ts`:
   ```typescript
   const mockAgents = [
     // ... existing agents
     {
       id: 'inventory-agent',
       name: 'Inventory Agent',
       description: 'Parts availability and reordering',
       capabilities: ['stock-levels', 'reorder-points'],
       tools: [],
       inputSchema: {},
       outputSchema: {},
     },
   ];
   ```

2. The agent is now available via:
   - List: `GET /agents`
   - Invoke: `POST /agents/inventory-agent/invoke`

### Add a New Page

1. Create component:
   ```typescript
   // src/features/reports/ReportsPage.tsx
   export function ReportsPage() {
     return <div>Reports</div>;
   }
   ```

2. Add route in `src/app/Router.tsx`:
   ```typescript
   <Route path="reports" element={<ReportsPage />} />
   ```

3. Add nav item in navigation components:
   - `src/components/navigation/BottomNav.tsx`
   - `src/components/navigation/DesktopNav.tsx`
   - `src/components/navigation/TabletNav.tsx`

### Build for Production

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Run tests
pnpm test

# Build
pnpm build

# Preview production build
pnpm preview
```

## 📱 Install as PWA

### Desktop (Chrome/Edge)
1. Look for install icon (⊕) in address bar
2. Click "Install Versuni Frontline"

### iOS
1. Safari → Share button
2. "Add to Home Screen"

### Android
1. Chrome → Menu (⋮)
2. "Add to Home Screen"

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Vite will auto-increment to 5174, 5175, etc.
# Or specify a port:
pnpm run dev -- --port 3000
```

### TypeScript errors in editor
```bash
# Restart TypeScript server in VS Code:
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or install types:
pnpm install --save-dev @types/node
```

### MSW not intercepting requests
- MSW only works in browser (not Node)
- Check browser console for `[MSW] Mocking enabled.`
- Ensure `VITE_USE_MOCKS=true` in `.env`

### Service worker not updating
```bash
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Or: DevTools → Application → Service Workers → Unregister
```

## 🚀 Next Steps

1. **Read the full README**: [README.md](README.md)
2. **Configure Azure AD**: See Azure AD section in README
3. **Set up backend**: Connect real Azure AI Foundry endpoints
4. **Customize branding**: Update colors in `tailwind.config.js`
5. **Add more agents**: Extend `src/mocks/handlers.ts`
6. **Deploy**: Azure Static Web Apps, Vercel, Netlify, etc.

## 💡 Pro Tips

- **Use DevTools**: React Query Devtools enabled in dev mode
- **Mock first**: Build features with MSW mocks before connecting backend
- **TypeScript**: Strict mode enforced - embrace the safety!
- **Offline**: Test offline mode by disabling network in DevTools
- **Lighthouse**: Run PWA audit regularly

---

Happy coding! 🎉

For detailed documentation, see [README.md](README.md) and [INSTALL.md](INSTALL.md).
