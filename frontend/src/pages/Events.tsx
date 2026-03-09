import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/axios';
import { CalendarDays, MapPin, Loader2, Search, X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Evenement {
    id: number;
    titre: string;
    description: string;
    categorie: string;
    date_evenement: string;
    lieu: string;
    prix_base: string;
    image: string;
}

const CATEGORIES = ['Tous', 'Concert', 'Festival', 'Sport', 'Conférence', 'Théâtre', 'Formation', 'Autre'];

export const Events = () => {
    const [events, setEvents] = useState<Evenement[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Evenement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('?action=evenements_api');
                if (response.data.success) {
                    setEvents(response.data.data);
                    setFilteredEvents(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let results = events;

        if (selectedCategory !== 'Tous') {
            results = results.filter(ev => ev.categorie === selectedCategory);
        }

        if (searchTerm) {
            const lowTerm = searchTerm.toLowerCase();
            results = results.filter(ev =>
                ev.titre.toLowerCase().includes(lowTerm) ||
                ev.lieu.toLowerCase().includes(lowTerm) ||
                ev.description?.toLowerCase().includes(lowTerm)
            );
        }

        setFilteredEvents(results);
    }, [searchTerm, selectedCategory, events]);

    return (
        <div style={{ background: 'var(--c-bg)', minHeight: 'calc(100vh - 68px)', paddingBottom: '100px' }}>

            {/* Header Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--c-surface) 0%, var(--c-bg) 50%, var(--c-accent) 100%)',
                padding: '60px 24px',
                borderBottom: '1.5px solid var(--c-border)'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}
                            >
                                <span style={{ width: 24, height: 2, background: 'var(--c-primary)' }} /> Exploration
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.03em', lineHeight: 1 }}
                            >
                                Tous les <span className="gradient-text">Événements</span>
                            </motion.h1>
                        </div>

                        {/* Search & Filter Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '16px',
                                background: 'var(--c-surface)',
                                padding: '16px',
                                borderRadius: '24px',
                                border: '1.5px solid var(--c-border)',
                                boxShadow: '0 10px 30px var(--c-shadow)',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)', width: 20, height: 20 }} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un événement, un lieu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 14px 14px 48px',
                                        background: 'var(--c-bg)',
                                        border: '1.5px solid var(--c-border)',
                                        borderRadius: '16px',
                                        color: 'var(--c-text)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    className="search-input"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)' }}
                                    >
                                        <X style={{ width: 18, height: 18 }} />
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '14px 24px',
                                        background: isFilterVisible ? 'var(--c-primary)' : 'var(--c-bg)',
                                        color: isFilterVisible ? '#fff' : 'var(--c-text)',
                                        border: '1.5px solid var(--c-border)',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <SlidersHorizontal style={{ width: 18, height: 18 }} />
                                    Filtres
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {isFilterVisible && (
                    <motion.section
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', borderBottom: '1.5px solid var(--c-border)', background: 'var(--c-surface)' }}
                    >
                        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
                            <div style={{ marginBottom: '16px', fontWeight: 800, color: 'var(--c-text)', fontSize: '1rem' }}>Catégories</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            border: '1.5px solid ' + (selectedCategory === cat ? 'var(--c-primary)' : 'var(--c-border)'),
                                            background: selectedCategory === cat ? 'var(--c-primary)' : 'var(--c-bg)',
                                            color: selectedCategory === cat ? '#fff' : 'var(--c-text)',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ color: 'var(--c-muted)', fontWeight: 600 }}>
                        {filteredEvents.length} résultat{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 style={{ width: 48, height: 48, color: 'var(--c-primary)', margin: '0 auto', animation: 'spin-slow 1s linear infinite' }} />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--c-surface)', borderRadius: '32px', border: '1.5px solid var(--c-border)' }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🔍</div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--c-text)', marginBottom: '12px' }}>Aucun événement trouvé</h3>
                        <p style={{ color: 'var(--c-muted)', fontWeight: 600, maxWidth: '400px', margin: '0 auto' }}>
                            Nous n'avons trouvé aucun événement correspondant à votre recherche. Essayez d'autres mots-clés ou filtres.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }}
                            style={{ marginTop: '32px' }}
                            className="btn-outline"
                        >
                            Réinitialiser la recherche
                        </button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                        {filteredEvents.map((ev, index) => (
                            <motion.div
                                key={ev.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="card"
                                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                    <img
                                        src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${ev.image || 'default.jpg'}`}
                                        alt={ev.titre}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                                        <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(245,48,3,0.85)' }}>{ev.categorie}</span>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin style={{ width: 14, height: 14 }} /> {ev.lieu}
                                    </div>
                                </div>
                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                        <CalendarDays style={{ width: 12, height: 12 }} />
                                        {new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--c-text)', marginBottom: '12px', lineHeight: 1.25 }}>
                                        {ev.titre}
                                    </h3>
                                    <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {ev.description || 'Pas de description disponible pour cet événement.'}
                                    </p>

                                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1.5px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--c-muted)', marginBottom: '2px' }}>Prix départ</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--c-text)' }}>
                                                {parseFloat(ev.prix_base).toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--c-primary)' }}>DH</span>
                                            </div>
                                        </div>
                                        <Link to={`/event/${ev.id}`}
                                            className="btn-primary"
                                            style={{ padding: '12px 24px', borderRadius: '14px', gap: '8px', boxShadow: '0 8px 20px rgba(245,48,3,0.2)' }}
                                        >
                                            Détails <ChevronRight style={{ width: 16, height: 16 }} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <style>{`
                .search-input:focus {
                    border-color: var(--c-primary) !important;
                    box-shadow: 0 0 0 4px rgba(245,48,3,0.1);
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
