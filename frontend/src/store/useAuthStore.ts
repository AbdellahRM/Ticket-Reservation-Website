import { create } from 'zustand';

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: 'client' | 'organisateur' | 'administrateur';
    photo_profil: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

import { api } from '../api/axios';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    checkAuth: async () => {
        try {
            const response = await api.get('?action=check_auth_api');
            if (response.data.success) {
                set({ user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    }
}));
