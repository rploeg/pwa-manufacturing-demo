/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_BASE: string;
  readonly VITE_ORCHESTRATOR_ENDPOINT: string;
  readonly VITE_AGENT_ENDPOINT: string;
  readonly VITE_TWIN_BASE: string;
  readonly VITE_MEDIA_BASE: string;
  readonly VITE_AAD_CLIENT_ID: string;
  readonly VITE_AAD_TENANT_ID: string;
  readonly VITE_AAD_REDIRECT_URI: string;
  readonly VITE_FEATURE_FLAGS: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
