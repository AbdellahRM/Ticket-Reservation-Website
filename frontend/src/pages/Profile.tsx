import { motion } from 'framer-motion';
import { User, Settings, Camera, Mail, Shield, Flame } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Profile = () => {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', fontWeight: 700, fontSize: '1.2rem' }}>
                Non autorisé
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative' }}>
            {/* Background blobs */}
            <div style={{ position: 'fixed', top: '30%', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--c-primary)', opacity: 0.04, filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--c-accent2)', opacity: 0.05, filter: 'blur(100px)', pointerEvents: 'none' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                {/* Page header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
                    <Settings style={{ width: 20, height: 20, color: 'var(--c-primary)' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)' }}>Paramètres</div>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', marginBottom: '36px' }}>
                    Votre <span className="gradient-text">Profil</span>
                </h1>

                {/* Profile card */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Cover */}
                    <div style={{ height: '160px', background: 'linear-gradient(135deg, var(--c-primary) 0%, var(--c-accent2) 100%)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    </div>

                    {/* Avatar */}
                    <div style={{ paddingLeft: '36px', marginTop: '-50px', marginBottom: '24px', position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '28px', overflow: 'hidden', border: '4px solid var(--c-bg)', boxShadow: '0 8px 30px var(--c-shadow)', transition: 'transform 0.4s ease', cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(3deg) scale(1.04)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0) scale(1)')}
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=f53003&color=fff&size=100&bold=true`}
                                    alt={user.nom}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--c-bg)' }}>
                                <Camera style={{ width: 13, height: 13, color: '#fff' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '0 36px 36px' }}>
                        {/* Name & badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em' }}>{user.prenom} {user.nom}</h2>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                    <span className="badge badge-primary">
                                        <Flame style={{ width: 11, height: 11 }} /> {user.role}
                                    </span>
                                    <span className="badge" style={{ background: 'rgba(248,184,3,0.12)', color: 'var(--c-accent2)', border: '1px solid rgba(248,184,3,0.25)' }}>
                                        Membre Actif
                                    </span>
                                </div>
                            </div>
                            <button className="btn-outline" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>
                                Modifier le Profil
                            </button>
                        </div>

                        {/* Info grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '20px' }}>
                                    <User style={{ width: 16, height: 16 }} /> Informations Personnelles
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[{ label: 'Prénom', value: user.prenom }, { label: 'Nom', value: user.nom }].map(field => (
                                        <div key={field.label}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: '6px' }}>{field.label}</div>
                                            <div style={{ background: 'var(--c-bg)', border: '1.5px solid var(--c-border)', borderRadius: '14px', padding: '12px 18px', fontWeight: 700, color: 'var(--c-text)', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c-primary)')}
                                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
                                            >
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-accent2)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '20px' }}>
                                    <Mail style={{ width: 16, height: 16 }} /> Contact & Sécurité
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: '6px' }}>Adresse Email</div>
                                        <div style={{ background: 'var(--c-bg)', border: '1.5px solid var(--c-border)', borderRadius: '14px', padding: '12px 18px', fontWeight: 700, color: 'var(--c-text)', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c-accent2)')}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
                                        >
                                            {user.email}
                                        </div>
                                    </div>
                                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 18px', borderRadius: '14px', border: '1.5px solid var(--c-border)', background: 'transparent', color: 'var(--c-text)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-primary)'; e.currentTarget.style.color = 'var(--c-primary)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.color = 'var(--c-text)'; }}
                                    >
                                        <Shield style={{ width: 16, height: 16 }} /> Changer le Mot de Passe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
