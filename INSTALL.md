# Versuni Frontline PWA - Installation Guide

## Installation Steps

### 1. Clone or navigate to the project

```bash
cd c:\repo\pwa-manufacturing-demo
```

### 2. Install dependencies

Using **pnpm** (recommended for ARM64):

```bash
pnpm install
```

Or using **npm**:

```bash
npm install
```

### 3. Copy environment file

```bash
cp .env.example .env
```

### 4. Configure environment variables

Edit `.env` and set your Azure credentials:

```env
VITE_AAD_CLIENT_ID=your-azure-ad-client-id
VITE_AAD_TENANT_ID=your-azure-ad-tenant-id
VITE_AAD_REDIRECT_URI=http://localhost:5173
```

**For development with mocks (no backend required):**

```env
VITE_USE_MOCKS=true
```

### 5. Run the development server

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for production

```bash
pnpm run build
pnpm run preview
```

## ARM64 Compatibility

This project is **100% ARM64 compatible**:

- ✅ No native dependencies
- ✅ Pure JavaScript/TypeScript
- ✅ Works on Apple Silicon (M1/M2/M3)
- ✅ Works on Windows ARM
- ✅ Works on Linux ARM

## PWA Installation

Once the app is running:

### Desktop (Chrome/Edge)

1. Look for the install icon in the address bar
2. Click "Install"

### Mobile (iOS)

1. Open in Safari
2. Tap Share → Add to Home Screen

### Mobile (Android)

1. Open in Chrome
2. Tap Menu → Add to Home Screen

## Next Steps

- Configure Azure AI Foundry endpoints in `.env`
- Set up Digital Twin service endpoints
- Configure Media service for voice handovers
- Deploy to production (Azure Static Web Apps, Vercel, etc.)

## Troubleshooting

### Dependencies fail to install

- Ensure Node.js ≥18 is installed
- Try clearing cache: `pnpm store prune` or `npm cache clean --force`

### Service worker not registering

- Service workers require HTTPS in production (or localhost in dev)
- Check browser console for errors

### Auth not working

- Verify Azure AD client ID and tenant ID
- Check redirect URI matches Azure AD app registration
- In development with mocks, auth is optional

## Support

For issues or questions:

- Check the main [README.md](README.md)
- Review the Azure AD setup section
- Check browser console for errors
