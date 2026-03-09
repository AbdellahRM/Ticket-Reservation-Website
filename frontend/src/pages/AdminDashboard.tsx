import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, CalendarDays, BarChart3, ShieldCheck,
    Trash2, Eye, TrendingUp, Loader2, Mail,
    Crown, Ticket, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

export const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'administrateur') {
            navigate('/login');
            return;
        }
        const fetchAdminStats = async () => {
            try {
                const response = await api.get('?action=admin_stats_api');
                if (response.data.success) setData(response.data.data);
            } catch (error) {
                console.error('Erreur admin stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdminStats();
    }, [isAuthenticated, user, navigate]);

    if (isLoading) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <Loader2 style={{ width: 48, height: 48, color: 'var(--c-primary)', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--c-muted)', fontWeight: 700 }}>Chargement de l'administration...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const { stats, utilisateurs, evenements } = data;

    const roleConfig: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
        administrateur: { label: 'Admin', bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: <Crown style={{ width: 11, height: 11 }} /> },
        organisateur: { label: 'Organisateur', bg: 'rgba(245,48,3,0.1)', color: 'var(--c-primary)', icon: <Star style={{ width: 11, height: 11 }} /> },
        client: { label: 'Client', bg: 'rgba(248,184,3,0.1)', color: 'var(--c-accent2)', icon: <Ticket style={{ width: 11, height: 11 }} /> },
    };

    const statCards = [
        {
            label: 'Utilisateurs',
            value: utilisateurs?.length ?? 0,
            sub: 'membres inscrits',
            icon: <Users style={{ width: 24, height: 24 }} />,
            bg: 'rgba(245, 48, 3, 0.1)',
            color: 'var(--c-primary)',
            border: 'rgba(245, 48, 3, 0.2)',
        },
        {
            label: 'Événements',
            value: evenements?.length ?? 0,
            sub: 'événements actifs',
            icon: <CalendarDays style={{ width: 24, height: 24 }} />,
            bg: 'rgba(248, 184, 3, 0.1)',
            color: 'var(--c-accent2)',
            border: 'rgba(248, 184, 3, 0.2)',
        },
        {
            label: "Chiffre d'Affaires",
            value: `${parseFloat(stats?.revenu_total || 0).toFixed(0)} DH`,
            sub: 'revenus totaux',
            icon: <BarChart3 style={{ width: 24, height: 24 }} />,
            bg: 'rgba(225, 89, 113, 0.1)',
            color: 'var(--c-muted)',
            border: 'rgba(225, 89, 113, 0.2)',
        },
        {
            label: 'Reservations',
            value: stats?.total_reservations ?? 0,
            sub: 'réservations totales',
            icon: <TrendingUp style={{ width: 24, height: 24 }} />,
            bg: 'rgba(29, 0, 2, 0.08)',
            color: 'var(--c-text)',
            border: 'var(--c-border)',
        },
    ];

    const headerStyle: React.CSSProperties = {
        padding: '14px 20px',
        textAlign: 'left',
        fontSize: '0.72rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: 'var(--c-muted)',
        whiteSpace: 'nowrap',
    };
    const cellStyle: React.CSSProperties = {
        padding: '14px 20px',
        borderTop: '1px solid var(--c-border)',
    };

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* ── PAGE HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                        <ShieldCheck style={{ width: 14, height: 14 }} /> Panneau d'Administration
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Vue d'Ensemble <span className="gradient-text">Système</span>
                    </h1>
                    <p style={{ color: 'var(--c-muted)', fontWeight: 500, marginTop: '8px' }}>
                        Surveillance globale de la plateforme, des utilisateurs et des ventes.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--c-surface)', border: '1.5px solid var(--c-border)', borderRadius: '16px', padding: '12px 18px' }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=f53003&color=fff&size=40&bold=true`}
                        style={{ width: 36, height: 36, borderRadius: '10px' }}
                        alt="admin"
                    />
                    <div>
                        <div style={{ fontWeight: 800, color: 'var(--c-text)', fontSize: '0.875rem' }}>{user?.prenom} {user?.nom}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--c-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Super Admin</div>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="card"
                        style={{ padding: '24px', position: 'relative', overflow: 'hidden', borderColor: card.border }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 0 0 80px', background: card.bg, pointerEvents: 'none' }} />
                        <div style={{ width: 48, height: 48, borderRadius: '14px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, marginBottom: '16px' }}>
                            {card.icon}
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--c-text)', lineHeight: 1, letterSpacing: '-0.02em' }}>{card.value}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</div>
                        <div style={{ fontSize: '0.72rem', color: card.color, fontWeight: 700, marginTop: '4px' }}>{card.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* ── TAB SWITCHER ── */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--c-surface)', border: '1.5px solid var(--c-border)', borderRadius: '16px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
                {([
                    { key: 'users', label: 'Utilisateurs', icon: <Users style={{ width: 15, height: 15 }} />, count: utilisateurs?.length ?? 0 },
                    { key: 'events', label: 'Événements', icon: <CalendarDays style={{ width: 15, height: 15 }} />, count: evenements?.length ?? 0 },
                ] as const).map(tab => {
                    const active = activeTab === tab.key;
                    return (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px',
                                border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.875rem',
                                background: active ? 'var(--c-primary)' : 'transparent',
                                color: active ? '#fff' : 'var(--c-muted)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            <span style={{ background: active ? 'rgba(255,255,255,0.2)' : 'var(--c-surface2)', color: active ? '#fff' : 'var(--c-muted)', borderRadius: '100px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 900 }}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── TABLES ── */}
            <AnimatePresence mode="wait">
                {activeTab === 'users' ? (
                    <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="card" style={{ padding: 0, overflow: 'hidden' }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1.5px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users style={{ width: 18, height: 18, color: 'var(--c-primary)' }} /> Gestion des Utilisateurs
                            </div>
                            <span className="badge badge-primary">{utilisateurs?.length ?? 0} Membres</span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--c-surface2)' }}>
                                        <th style={headerStyle}>Utilisateur</th>
                                        <th style={headerStyle}>Email</th>
                                        <th style={headerStyle}>Rôle</th>
                                        <th style={{ ...headerStyle, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilisateurs?.map((u: any, i: number) => {
                                        const role = roleConfig[u.role] ?? roleConfig.client;
                                        return (
                                            <motion.tr key={u.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.04 }}
                                                style={{ transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <td style={cellStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${u.prenom}+${u.nom}&background=f53003&color=fff&size=36&bold=true`}
                                                            alt={u.nom}
                                                            style={{ width: 36, height: 36, borderRadius: '10px', flexShrink: 0 }}
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: 'var(--c-text)', fontSize: '0.9rem' }}>{u.prenom} {u.nom}</div>
                                                            <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', fontWeight: 600 }}>ID #{u.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={cellStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                                                        <Mail style={{ width: 13, height: 13 }} /> {u.email}
                                                    </div>
                                                </td>
                                                <td style={cellStyle}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: role.bg, color: role.color, borderRadius: '100px', padding: '4px 12px', fontWeight: 800, fontSize: '0.75rem' }}>
                                                        {role.icon} {role.label}
                                                    </span>
                                                </td>
                                                <td style={{ ...cellStyle, textAlign: 'right' }}>
                                                    <button title="Supprimer l'utilisateur"
                                                        style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                                                    >
                                                        <Trash2 style={{ width: 15, height: 15 }} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="card" style={{ padding: 0, overflow: 'hidden' }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1.5px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CalendarDays style={{ width: 18, height: 18, color: 'var(--c-primary)' }} /> Gestion des Événements
                            </div>
                            <span className="badge badge-primary">{evenements?.length ?? 0} Événements</span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--c-surface2)' }}>
                                        <th style={headerStyle}>Événement</th>
                                        <th style={headerStyle}>Organisateur</th>
                                        <th style={headerStyle}>Date</th>
                                        <th style={headerStyle}>Prix Base</th>
                                        <th style={{ ...headerStyle, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evenements?.map((ev: any, i: number) => (
                                        <motion.tr key={ev.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            style={{ transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img
                                                        src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${ev.image || 'default.jpg'}`}
                                                        alt={ev.titre}
                                                        style={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover', flexShrink: 0, border: '1.5px solid var(--c-border)' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: 'var(--c-text)', fontSize: '0.9rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.titre}</div>
                                                        <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', marginTop: '2px', fontWeight: 600 }}>{ev.categorie}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${ev.organisateur_prenom}+${ev.organisateur_nom}&background=f8b803&color=1d0002&size=28&bold=true`}
                                                        style={{ width: 26, height: 26, borderRadius: '50%' }}
                                                        alt={ev.organisateur_nom}
                                                    />
                                                    <span style={{ color: 'var(--c-text)', fontWeight: 700, fontSize: '0.875rem' }}>
                                                        {ev.organisateur_prenom} {ev.organisateur_nom}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ fontWeight: 600, color: 'var(--c-text)', fontSize: '0.875rem' }}>
                                                    {new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <span style={{ fontWeight: 900, color: 'var(--c-primary)', fontSize: '1rem' }}>
                                                    {parseFloat(ev.prix_base).toFixed(2)} <span style={{ fontSize: '0.75rem' }}>DH</span>
                                                </span>
                                            </td>
                                            <td style={{ ...cellStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <Link to={`/event/${ev.id}`} title="Voir l'événement"
                                                        style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(245,48,3,0.08)', color: 'var(--c-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,48,3,0.18)')}
                                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,48,3,0.08)')}
                                                    >
                                                        <Eye style={{ width: 15, height: 15 }} />
                                                    </Link>
                                                    <button title="Supprimer l'événement"
                                                        style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                                                    >
                                                        <Trash2 style={{ width: 15, height: 15 }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
