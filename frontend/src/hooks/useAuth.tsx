import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, tokenStorage } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
  loyalty_points: number;
  loyalty_tier: string;
  total_purchases: number;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = tokenStorage.get('access_token');
      if (token) {
        const data = await authService.getProfile();
        setUser(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      tokenStorage.remove('access_token');
      tokenStorage.remove('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, remember?: boolean) => {
    try {
      const data = await authService.login(email, password, remember);
      setUser(data.user);
      if (data.user.is_staff || data.user.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/espace-utilisateur');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur de connexion');
    }
  };

  const register = async (data: any) => {
    try {
      await authService.register(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur d\'inscription');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur de mise à jour du profil');
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const response = await authService.uploadAvatar(file);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur de téléchargement de l\'avatar');
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};