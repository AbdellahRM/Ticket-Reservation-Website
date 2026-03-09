import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/axios';
import { CalendarDays, MapPin, Users, Ticket, ArrowLeft, Loader2, CreditCard, Lock, Minus, Plus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const EventDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`?action=details_api&id=${id}`);
                if (response.data.success) {
                    setData(response.data.data);
                    if (response.data.data.typesTickets?.length > 0) {
                        setSelectedTicket(response.data.data.typesTickets[0].id.toString());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (isLoading) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 style={{ width: 48, height: 48, color: 'var(--c-primary)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!data || !data.evenement) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ fontSize: '3rem' }}>😕</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)' }}>Événement introuvable</h2>
                <Link to="/" className="btn-primary">Retour à l'accueil</Link>
            </div>
        );
    }

    const { evenement, typesTickets, images } = data;
    const currentTicketType = typesTickets?.find((t: any) => t.id.toString() === selectedTicket);
    const totalPrice = currentTicketType ? (currentTicketType.prix * quantity).toFixed(2) : '0.00';

    const infoItems = [
        { icon: <CalendarDays style={{ width: 20, height: 20 }} />, label: 'Date & Heure', value: new Date(evenement.date_evenement).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }), cls: 'info-icon-primary' },
        { icon: <MapPin style={{ width: 20, height: 20 }} />, label: 'Lieu', value: evenement.lieu, cls: 'info-icon-accent' },
        { icon: <Users style={{ width: 20, height: 20 }} />, label: 'Capacité', value: `${evenement.capacite} places`, cls: 'info-icon-muted' },
    ];

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Back link */}
            <Link to="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '36px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
            >
                <ArrowLeft style={{ width: 16, height: 16 }} /> Retour aux événements
            </Link>

            {/* Main layout: content + sidebar */}
            <div className="event-grid" style={{ display: 'grid', gap: '40px', alignItems: 'start' }}>
                {/* Left: Event content */}
                <div>
                    {/* Slideshow */}
                    <div style={{ position: 'relative', marginBottom: '28px' }}>
                        <motion.div
                            key={activeImgIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}
                        >
                            <img
                                src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${((images && images.length > 0) ? images[activeImgIdx].chemin_image : evenement.image) || 'default.jpg'}`}
                                alt={evenement.titre}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(29,0,2,0.4) 0%, transparent 60%)' }} />
                            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                                <span className="badge badge-primary">{evenement.categorie}</span>
                            </div>
                        </motion.div>

                        {/* Thumbnails / Indicators */}
                        {images && images.length > 1 && (
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '12px 4px', marginTop: '16px', scrollbarWidth: 'none' }}>
                                {images.map((img: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveImgIdx(idx)}
                                        style={{
                                            width: 80, height: 60, borderRadius: '12px', overflow: 'hidden',
                                            border: `3px solid ${activeImgIdx === idx ? 'var(--c-primary)' : 'var(--c-border)'}`,
                                            cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.2s'
                                        }}
                                    >
                                        <img
                                            src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${img.chemin_image}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt={`Thumbnail ${idx + 1}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '28px' }}>
                        {evenement.titre}
                    </h1>

                    {/* Info pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px', paddingBottom: '36px', borderBottom: '1.5px solid var(--c-border)' }}>
                        {infoItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--c-surface)', border: '1.5px solid var(--c-border)', borderRadius: '16px', padding: '14px 20px' }}>
                                <div className={item.cls} style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)', marginBottom: '2px' }}>{item.label}</div>
                                    <div style={{ fontWeight: 700, color: 'var(--c-text)', fontSize: '0.9rem' }}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--c-text)', marginBottom: '16px' }}>À propos de l'événement</h3>
                        <div style={{ color: 'var(--c-muted)', lineHeight: 1.8, fontWeight: 500, fontSize: '1rem' }}>
                            {evenement.description.split('\n').map((line: string, i: number) => (
                                <p key={i} style={{ marginBottom: '12px' }}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Booking sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ position: 'sticky', top: '90px' }}
                >
                    <div className="card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(245,48,3,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)' }}>
                                <Ticket style={{ width: 18, height: 18 }} />
                            </div>
                            Réserver vos places
                        </h3>

                        {(!typesTickets || typesTickets.length === 0) ? (
                            <div style={{ background: 'var(--c-bg)', border: '1.5px solid var(--c-border)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎫</div>
                                <p style={{ color: 'var(--c-muted)', fontWeight: 600 }}>Aucun ticket disponible pour le moment.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Ticket type selector */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: '12px' }}>
                                        Type de ticket
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {typesTickets.map((type: any) => {
                                            const selected = selectedTicket === type.id.toString();
                                            return (
                                                <label key={type.id}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '16px 18px', borderRadius: '16px', cursor: 'pointer',
                                                        border: `2px solid ${selected ? 'var(--c-primary)' : 'var(--c-border)'}`,
                                                        background: selected ? 'rgba(245,48,3,0.06)' : 'var(--c-bg)',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <input
                                                            type="radio"
                                                            name="ticketType"
                                                            value={type.id}
                                                            checked={selected}
                                                            onChange={e => setSelectedTicket(e.target.value)}
                                                            style={{ accentColor: 'var(--c-primary)', width: 16, height: 16 }}
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: 'var(--c-text)', fontSize: '0.95rem' }}>{type.nom}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', fontWeight: 600, marginTop: '2px' }}>
                                                                {type.quantite_disponible} place{type.quantite_disponible !== 1 ? 's' : ''} restante{type.quantite_disponible !== 1 ? 's' : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>
                                                        {parseFloat(type.prix).toFixed(2)} DH
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: '12px' }}>
                                        Quantité
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--c-border)', borderRadius: '100px', overflow: 'hidden', background: 'var(--c-bg)' }}>
                                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{ width: 48, height: 48, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', transition: 'color 0.2s', fontSize: '1.2rem', fontWeight: 700 }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
                                        >
                                            <Minus style={{ width: 16, height: 16 }} />
                                        </button>
                                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: 'var(--c-text)' }}>
                                            {quantity}
                                        </span>
                                        <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            style={{ width: 48, height: 48, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', transition: 'color 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
                                        >
                                            <Plus style={{ width: 16, height: 16 }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Total & CTA */}
                                <div style={{ paddingTop: '20px', borderTop: '1.5px solid var(--c-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <span style={{ color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.95rem' }}>Total à payer</span>
                                        <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--c-primary)' }}>
                                            {totalPrice} <span style={{ fontSize: '1rem' }}>DH</span>
                                        </span>
                                    </div>

                                    {isAuthenticated ? (
                                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
                                            <CreditCard style={{ width: 18, height: 18 }} /> Passer au paiement
                                        </button>
                                    ) : (
                                        <Link to="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
                                            Se connecter pour réserver
                                        </Link>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: 'var(--c-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                        <Lock style={{ width: 12, height: 12 }} /> Paiement 100% sécurisé
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >
        </div >
    );
};
