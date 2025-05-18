import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'hr' | 'finance' | 'operations' | 'client';

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User & { token?: string }) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User & { token?: string }) => {
    // If token is not present but exists in localStorage, preserve it
    let token = userData.token;
    if (!token) {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) token = parsed.token;
      }
    }
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const userRole = user.role.toLowerCase();
    if (userRole === 'admin') return true; // Admin has access to everything
    if (Array.isArray(roles)) {
      return roles.map(r => r.toLowerCase()).includes(userRole);
    }
    return userRole === (roles as string).toLowerCase();
  };

  // Check for stored user data on mount
  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}; 