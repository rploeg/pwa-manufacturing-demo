import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { env } from '@/data/config';
import { setTokenProvider } from '@/data/clients/http';

const msalConfig = {
  auth: {
    clientId: env.aadClientId,
    authority: `https://login.microsoftonline.com/${env.aadTenantId}`,
    redirectUri: env.aadRedirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setUser(accounts[0]);
        setIsAuthenticated(true);
      }
    });
  }, []);

  const getToken = async (): Promise<string | null> => {
    if (!env.aadClientId || env.useMocks) {
      return null; // Skip auth in mock mode
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      // Silent token acquisition failed, try interactive
      try {
        const response = await msalInstance.acquireTokenPopup({
          scopes: ['User.Read'],
        });
        return response.accessToken;
      } catch (e) {
        console.error('Token acquisition failed:', e);
        return null;
      }
    }
  };

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ['User.Read'],
      });
      setUser(response.account);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    await msalInstance.logoutPopup();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set token provider for HTTP clients
  useEffect(() => {
    setTokenProvider({ getToken });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
