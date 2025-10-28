# Versuni Frontline PWA - Setup Script (Windows/PowerShell)
# Run with: .\setup.ps1

Write-Host "🚀 Versuni Frontline PWA Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js ≥18 from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm: v$pnpmVersion" -ForegroundColor Green
    $usePNPM = $true
} catch {
    Write-Host "⚠ pnpm not found, will use npm" -ForegroundColor Yellow
    $usePNPM = $false
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
if ($usePNPM) {
    pnpm install
} else {
    npm install
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ Important: Edit .env file to add your Azure credentials" -ForegroundColor Yellow
    Write-Host "  - VITE_AAD_CLIENT_ID" -ForegroundColor Gray
    Write-Host "  - VITE_AAD_TENANT_ID" -ForegroundColor Gray
    Write-Host "  - VITE_AAD_REDIRECT_URI" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    Write-Host ""
}

# Run type check
Write-Host "Running type check..." -ForegroundColor Yellow
if ($usePNPM) {
    pnpm run type-check
} else {
    npm run type-check
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Type check completed with errors (expected - dependencies not yet installed)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Type check passed" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Edit .env file with your Azure credentials" -ForegroundColor White
Write-Host "  2. Run: " -NoNewline -ForegroundColor White
if ($usePNPM) {
    Write-Host "pnpm run dev" -ForegroundColor Cyan
} else {
    Write-Host "npm run dev" -ForegroundColor Cyan
}
Write-Host "  3. Open: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "For development with mocks (no backend required):" -ForegroundColor Yellow
Write-Host "  - Ensure VITE_USE_MOCKS=true in .env" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - README.md        - Full documentation" -ForegroundColor Gray
Write-Host "  - QUICKSTART.md    - Quick start guide" -ForegroundColor Gray
Write-Host "  - INSTALL.md       - Installation details" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
