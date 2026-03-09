import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Home, LogOut, Ticket, CalendarDays, KeyRound, Menu, X, User, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../api/axios';

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.get('?action=deconnexion_api');
            logout();
            navigate('/login');
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    const dropdownStyle: React.CSSProperties = {
        position: 'absolute',
        right: 0,
        top: '100%',
        marginTop: '12px',
        width: '240px',
        background: 'var(--c-surface)',
        border: '1.5px solid var(--c-border)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px var(--c-shadow)',
        zIndex: 100,
    };

    const dropdownMenuItems = [
        { to: '/profile', label: 'Mon Profil', icon: <User style={{ width: 15, height: 15 }} /> },
        ...(user?.role === 'administrateur' ? [{ to: '/admin', label: 'Administration', icon: <ShieldCheck style={{ width: 15, height: 15 }} /> }] : []),
        ...(user?.role === 'organisateur' ? [
            { to: '/dashboard', label: 'Tableau de bord', icon: <CalendarDays style={{ width: 15, height: 15 }} /> },
            { to: '/creer-evenement', label: 'Créer un Événement', icon: <Ticket style={{ width: 15, height: 15 }} /> },
        ] : []),
    ];

    return (
        <nav style={{ background: 'var(--c-surface)', borderBottom: '1.5px solid var(--c-border)', position: 'sticky', top: 0, zIndex: 50, transition: 'background 0.4s ease' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div
                        style={{ width: 38, height: 38, background: 'var(--c-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(12deg)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0)')}
                    >
                        <Flame style={{ color: '#fff', width: 20, height: 20 }} />
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', color: 'var(--c-text)' }}>
                        Event<span style={{ color: 'var(--c-primary)' }}>Z&A</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: '32px', display: 'flex' }}>
                    <Link to="/"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--c-primary)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--c-muted)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Home style={{ width: 16, height: 16 }} /> Accueil
                    </Link>

                    <Link to="/events"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--c-primary)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--c-muted)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <CalendarDays style={{ width: 16, height: 16 }} /> Événements
                    </Link>

                    <div style={{ width: 1.5, height: 20, background: 'var(--c-border)', margin: '0 8px' }} />

                    <motion.button
                        whileHover={{ scale: 1.05, background: 'var(--c-surface2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        style={{ width: 40, height: 40, borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        {theme === 'light' ? <Moon style={{ width: 18, height: 18 }} /> : <Sun style={{ width: 18, height: 18 }} />}
                    </motion.button>

                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--c-bg)', border: '1.5px solid var(--c-border)', borderRadius: '14px', padding: '6px 14px 6px 6px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px var(--c-shadow)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--c-primary)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--c-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=f53003&color=fff&size=32&bold=true`}
                                    alt="Avatar"
                                    style={{ width: 32, height: 32, borderRadius: '10px' }}
                                />
                                <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--c-text)' }}>{user?.prenom}</span>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                        style={dropdownStyle}
                                    >
                                        <div style={{ padding: '8px' }}>
                                            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--c-border)', marginBottom: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connecté en tant que</div>
                                                <div style={{ fontWeight: 800, color: 'var(--c-text)', fontSize: '0.9rem' }}>{user?.prenom} {user?.nom}</div>
                                            </div>
                                            {dropdownMenuItems.map(item => (
                                                <Link key={item.to} to={item.to} onClick={() => setIsProfileOpen(false)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', textDecoration: 'none', color: 'var(--c-text)', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s ease' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface2)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                                >
                                                    <span style={{ color: 'var(--c-primary)' }}>{item.icon}</span>
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <div style={{ height: 1, background: 'var(--c-border)', margin: '8px 14px' }} />
                                            <button onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontWeight: 800, fontSize: '0.875rem', transition: 'all 0.2s ease' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <LogOut style={{ width: 16, height: 16 }} /> Déconnexion
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Link to="/login"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
                            >
                                <KeyRound style={{ width: 16, height: 16 }} /> Connexion
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: '14px', fontWeight: 800 }}>
                                S'inscrire
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="flex md:hidden" style={{ alignItems: 'center', gap: '12px', display: 'flex' }}>
                    <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--c-text)', cursor: 'pointer' }}>
                        {theme === 'light' ? <Moon style={{ width: 20, height: 20 }} /> : <Sun style={{ width: 20, height: 20 }} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'var(--c-text)', cursor: 'pointer' }}>
                        {isOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', overflow: 'hidden' }}
                    >
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Link to="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--c-text)', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none' }}>
                                <Home style={{ width: 18, height: 18, color: 'var(--c-primary)' }} /> Accueil
                            </Link>
                            <Link to="/events" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--c-text)', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none' }}>
                                <CalendarDays style={{ width: 18, height: 18, color: 'var(--c-primary)' }} /> Événements
                            </Link>
                            <div style={{ height: 1, background: 'var(--c-border)', margin: '4px 0' }} />
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: 'var(--c-text)', fontWeight: 800, textDecoration: 'none', fontSize: '1.1rem' }}>Connexion</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', padding: '14px', borderRadius: '12px' }}>S'inscrire</Link>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '8px' }}>
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=f53003&color=fff&size=40&bold=true`}
                                            alt="Avatar"
                                            style={{ width: 40, height: 40, borderRadius: '10px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--c-text)' }}>{user?.prenom} {user?.nom}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', fontWeight: 600 }}>{user?.role}</div>
                                        </div>
                                    </div>
                                    {dropdownMenuItems.map(item => (
                                        <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--c-text)', fontWeight: 700, textDecoration: 'none' }}>
                                            <span style={{ color: 'var(--c-primary)' }}>{item.icon}</span> {item.label}
                                        </Link>
                                    ))}
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '1.1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                        <LogOut style={{ width: 18, height: 18 }} /> Déconnexion
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
