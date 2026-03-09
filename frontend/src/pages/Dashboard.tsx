import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CalendarDays, Users, BarChart3, Loader2, Flame, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

export const Dashboard = () => {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'organisateur') {
            navigate('/login');
            return;
        }
        const fetchStats = async () => {
            try {
                const response = await api.get('?action=organizer_stats_api');
                if (response.data.success) setEvents(response.data.data || []);
            } catch (error) {
                console.error("Erreur stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [isAuthenticated, user, navigate]);

    const totalReservations = events.reduce((s: number, e: any) => s + Number(e.reservations || 0), 0);
    const totalRevenu = events.reduce((s: number, e: any) => s + (Number(e.prix_base || 0) * Number(e.reservations || 0)), 0);

    const stats = [
        { label: 'Mes Événements', value: events.length, icon: <CalendarDays style={{ width: 24, height: 24 }} />, color: 'var(--c-primary)' },
        { label: 'Réservations', value: totalReservations, icon: <Users style={{ width: 24, height: 24 }} />, color: 'var(--c-accent2)' },
        { label: 'Revenu Total', value: `${totalRevenu.toFixed(0)} DH`, icon: <BarChart3 style={{ width: 24, height: 24 }} />, color: 'var(--c-muted)' },
    ];

    return (
        <div style={{ padding: '40px 0 80px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        <Flame style={{ width: 14, height: 14 }} /> Espace Organisateur
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Bonjour, <span className="gradient-text">{user?.prenom} 👋</span>
                    </h1>
                    <p style={{ color: 'var(--c-muted)', fontWeight: 500, marginTop: '8px' }}>Gérez vos événements et suivez vos performances.</p>
                </div>
                <Link to="/creer-evenement" className="btn-primary" style={{ gap: '8px' }}>
                    <Plus style={{ width: 18, height: 18 }} /> Créer un Événement
                </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card"
                        style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}
                    >
                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--c-text)', lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Events table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1.5px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--c-text)' }}>Mes Événements</h2>
                    <span className="badge badge-primary">{events.length} événement{events.length !== 1 ? 's' : ''}</span>
                </div>

                {isLoading ? (
                    <div style={{ padding: '80px', textAlign: 'center' }}>
                        <Loader2 style={{ width: 40, height: 40, color: 'var(--c-primary)', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : events.length === 0 ? (
                    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎪</div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--c-text)', marginBottom: '8px' }}>Aucun événement créé</h3>
                        <p style={{ color: 'var(--c-muted)', marginBottom: '24px' }}>Commencez par créer votre premier événement.</p>
                        <Link to="/creer-evenement" className="btn-primary">Créer maintenant</Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--c-surface2)' }}>
                                    {['Événement', 'Date', 'Lieu', 'Réservations', 'Prix', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((ev: any, i: number) => (
                                    <motion.tr
                                        key={ev.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ borderTop: '1px solid var(--c-border)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--c-text)', fontSize: '0.9rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.titre}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: '2px' }}>{ev.categorie}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: 'var(--c-muted)', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                            {new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px 20px', color: 'var(--c-muted)', fontSize: '0.875rem', fontWeight: 600 }}>{ev.lieu}</td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,48,3,0.1)', color: 'var(--c-primary)', borderRadius: '100px', padding: '4px 12px', fontWeight: 800, fontSize: '0.8rem' }}>
                                                <Users style={{ width: 12, height: 12 }} /> {ev.reservations || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--c-text)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                            {Number(ev.prix_base || 0).toFixed(2)} DH
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link to={`/event/${ev.id}`} title="Voir"
                                                    style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(245,48,3,0.1)', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.15s' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-primary)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,48,3,0.1)')}
                                                >
                                                    <Eye style={{ width: 15, height: 15 }} />
                                                </Link>
                                                <Link to={`/modifier-evenement/${ev.id}`} title="Modifier"
                                                    style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(248,184,3,0.12)', color: 'var(--c-accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.15s' }}
                                                >
                                                    <Edit2 style={{ width: 15, height: 15 }} />
                                                </Link>
                                                <button title="Supprimer"
                                                    style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
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
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
