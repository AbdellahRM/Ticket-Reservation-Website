import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/axios';
import { CalendarDays, MapPin, ArrowRight, Loader2, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Evenement {
    id: number;
    titre: string;
    categorie: string;
    date_evenement: string;
    lieu: string;
    prix_base: string;
    image: string;
}

export const Home = () => {
    const [events, setEvents] = useState<Evenement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('?action=evenements_api');
                if (response.data.success) setEvents(response.data.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div>

            {/* ===== HERO ===== */}
            <section style={{
                background: 'linear-gradient(135deg, var(--c-surface) 0%, var(--c-bg) 50%, var(--c-accent) 100%)',
                padding: '80px 24px 100px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--c-primary)', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--c-accent2)', opacity: 0.1, filter: 'blur(80px)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--c-primary)', color: '#fff', borderRadius: '100px', padding: '8px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '28px' }}
                    >
                        <Flame style={{ width: 14, height: 14 }} /> Événements en Direct
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--c-text)', marginBottom: '24px' }}
                    >
                        Vivez des{' '}
                        <span className="gradient-text">Moments</span>
                        <br />Inoubliables
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: '1.2rem', color: 'var(--c-muted)', fontWeight: 500, maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.7 }}
                    >
                        Découvrez des expériences authentiques et créez des souvenirs qui durent toute une vie.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}
                    >
                        <Link to="/events" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                            Voir les Événements
                        </Link>
                        <Link to="/register" className="btn-outline" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                            Créer un Profil
                        </Link>
                    </motion.div>
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ maxWidth: '720px', margin: '80px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid var(--c-border)' }}
                >
                    {[
                        { value: '500+', label: 'Événements' },
                        { value: '10k+', label: 'Participants' },
                        { value: '98%', label: 'Satisfaction' },
                    ].map((stat, i) => (
                        <div key={i} style={{ background: 'var(--c-bg)', padding: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--c-primary)', lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ===== EVENTS ===== */}
            <section id="events" style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                            <Star style={{ width: 14, height: 14 }} /> Collection Exclusive
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Événements <span className="gradient-text">Populaires</span>
                        </h2>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '120px 0' }}>
                        <Loader2 style={{ width: 48, height: 48, color: 'var(--c-primary)', margin: '0 auto', animation: 'spin-slow 1s linear infinite' }} />
                    </div>
                ) : events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--c-surface)', borderRadius: '24px', border: '1.5px solid var(--c-border)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌱</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '8px' }}>Aucun événement pour le moment</h3>
                        <p style={{ color: 'var(--c-muted)', fontWeight: 500 }}>Revenez bientôt pour découvrir nos événements !</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
                        {events.map((ev, index) => (
                            <motion.div
                                key={ev.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="card"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                    <img
                                        src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${ev.image || 'default.jpg'}`}
                                        alt={ev.titre}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(29,0,2,0.6) 0%, transparent 60%)' }} />
                                    <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                                        <span className="badge badge-primary">{ev.categorie}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '16px', lineHeight: 1.3 }}>
                                        {ev.titre}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                        {[
                                            { icon: <MapPin style={{ width: 14, height: 14 }} />, text: ev.lieu },
                                            { icon: <CalendarDays style={{ width: 14, height: 14 }} />, text: new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--c-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(245,48,3,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)', flexShrink: 0 }}>
                                                    {item.icon}
                                                </div>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1.5px solid var(--c-border)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: '2px' }}>À partir de</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--c-primary)' }}>
                                                {parseFloat(ev.prix_base).toFixed(2)} <span style={{ fontSize: '0.85rem' }}>DH</span>
                                            </div>
                                        </div>
                                        <Link to={`/event/${ev.id}`}
                                            className="btn-primary"
                                            style={{ padding: '10px 20px', fontSize: '0.875rem', gap: '6px' }}
                                        >
                                            Réserver <ArrowRight style={{ width: 15, height: 15 }} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
