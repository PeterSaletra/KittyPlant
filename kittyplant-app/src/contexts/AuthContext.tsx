import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService, register as registerService } from '@/lib/auth';
import { getUserDetail } from '@/lib/users';
import { toast } from 'sonner';

interface User {
    id: number;
    username: string;
    created_at: string;
    updated_at: string;
    devices_count: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on mount
    const checkAuth = async () => {
        try {
            const userData = await getUserDetail();
            setUser(userData);
        } catch (error) {
            // User is not authenticated or session expired
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            await loginService(username, password);
            const userData = await getUserDetail();
            setUser(userData);
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Login failed');
            throw error;
        }
    };

    const register = async (username: string, password: string) => {
        try {
            await registerService(username, password);
            toast.success('Registration successful! You can now log in.');
        } catch (error) {
            toast.error('Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutService();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
            throw error;
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await getUserDetail();
            setUser(userData);
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
