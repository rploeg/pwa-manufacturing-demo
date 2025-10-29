// Environment configuration with type-safe access

interface EnvConfig {
  agentBase: string;
  orchestratorEndpoint: string;
  agentEndpoint: string;
  twinBase: string;
  mediaBase: string;
  aadClientId: string;
  aadTenantId: string;
  aadRedirectUri: string;
  useMocks: boolean;
  env: 'development' | 'production' | 'test';
  featureFlags: {
    voiceHandover: boolean;
    digitalTwin: boolean;
    multiAgent: boolean;
    offlineMode: boolean;
  };
}

const parseFeatureFlags = (flagsStr?: string) => {
  const flags = flagsStr?.split(',').map((f) => f.trim()) || [];
  return {
    voiceHandover: flags.includes('voice-handover'),
    digitalTwin: flags.includes('digital-twin'),
    multiAgent: flags.includes('multi-agent'),
    offlineMode: flags.includes('offline-mode'),
  };
};

export const env: EnvConfig = {
  agentBase: import.meta.env.VITE_AGENT_BASE || 'https://localhost:7071/api',
  orchestratorEndpoint: import.meta.env.VITE_ORCHESTRATOR_ENDPOINT || '/orchestrator/invoke',
  agentEndpoint: import.meta.env.VITE_AGENT_ENDPOINT || '/agents',
  twinBase: import.meta.env.VITE_TWIN_BASE || 'https://localhost:7072/api',
  mediaBase: import.meta.env.VITE_MEDIA_BASE || 'https://localhost:7073/api',
  aadClientId: import.meta.env.VITE_AAD_CLIENT_ID || '',
  aadTenantId: import.meta.env.VITE_AAD_TENANT_ID || '',
  aadRedirectUri: import.meta.env.VITE_AAD_REDIRECT_URI || window.location.origin,
  // Default to mocks in production unless explicitly set to false
  // In development, only use mocks if explicitly set to true
  useMocks: import.meta.env.VITE_USE_MOCKS 
    ? import.meta.env.VITE_USE_MOCKS === 'true'
    : import.meta.env.PROD, // Use mocks in production by default
  env: (import.meta.env.VITE_ENV as EnvConfig['env']) || 'development',
  featureFlags: parseFeatureFlags(import.meta.env.VITE_FEATURE_FLAGS),
};

// Log configuration on startup to help debugging
console.log('Environment Configuration:', {
  isProd: import.meta.env.PROD,
  useMocks: env.useMocks,
  mode: import.meta.env.MODE,
});

export const isDev = env.env === 'development';
export const isProd = env.env === 'production';
export const isTest = env.env === 'test';
