import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useThemeStore } from '../../store/useThemeStore';
import { useEffect } from 'react';

export const Layout = () => {
    const { theme } = useThemeStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={theme} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--c-bg)', color: 'var(--c-text)', transition: 'background 0.4s ease, color 0.4s ease' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
