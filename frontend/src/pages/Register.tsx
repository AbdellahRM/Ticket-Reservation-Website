import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Ticket, CalendarPlus, Flame, ArrowRight } from 'lucide-react';
import { api } from '../api/axios';

const registerSchema = z.object({
    prenom: z.string().min(2, 'Prénom trop court'),
    nom: z.string().min(2, 'Nom trop court'),
    email: z.string().email('Email invalide'),
    mot_de_passe: z.string().min(6, 'Minimum 6 caractères'),
    role: z.enum(['client', 'organisateur'])
});
type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'client' }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setIsLoading(true);
            setServerError('');
            const response = await api.post('?action=inscription_api', data);
            if (response.data.success) navigate('/login?registered=true');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8rem', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--c-muted)', marginBottom: '10px'
    };
    const iconStyle: React.CSSProperties = {
        position: 'absolute', left: '20px', top: '50%',
        transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--c-muted)'
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ position: 'fixed', top: 0, right: 0, width: '500px', height: '500px', borderRadius: '50%', background: 'var(--c-primary)', opacity: 0.04, filter: 'blur(120px)', pointerEvents: 'none' }} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '580px', position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: 44, height: 44, background: 'var(--c-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Flame style={{ width: 22, height: 22, color: '#fff' }} />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--c-text)' }}>
                            Event<span style={{ color: 'var(--c-primary)' }}>Z&A</span>
                        </span>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em' }}>
                        Rejoignez l'Aventure
                    </h1>
                    <p style={{ color: 'var(--c-muted)', fontWeight: 500, marginTop: '8px' }}>
                        Créez votre compte gratuitement.
                    </p>
                </div>

                <div className="card" style={{ padding: '36px' }}>
                    {serverError && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '14px', padding: '14px 18px', fontWeight: 700, fontSize: '0.875rem', marginBottom: '20px' }}>
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Prénom</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={iconStyle} />
                                    <input type="text" placeholder="Jean" className="input-field" {...register('prenom')} />
                                </div>
                                {errors.prenom && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '5px' }}>{errors.prenom.message}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Nom</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={iconStyle} />
                                    <input type="text" placeholder="Dupont" className="input-field" {...register('nom')} />
                                </div>
                                {errors.nom && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '5px' }}>{errors.nom.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={iconStyle} />
                                <input type="email" placeholder="jean@exemple.com" className="input-field" {...register('email')} />
                            </div>
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '5px' }}>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Mot de Passe</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={iconStyle} />
                                <input type="password" placeholder="Minimum 6 caractères" className="input-field" {...register('mot_de_passe')} />
                            </div>
                            {errors.mot_de_passe && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '5px' }}>{errors.mot_de_passe.message}</p>}
                        </div>

                        <div>
                            <label style={{ ...labelStyle, marginBottom: '12px' }}>Votre Rôle</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {([
                                    { role: 'client', label: 'Client', subtitle: 'Réservez & participez', icon: <Ticket style={{ width: 22, height: 22 }} />, color: 'var(--c-primary)' },
                                    { role: 'organisateur', label: 'Organisateur', subtitle: 'Créez des événements', icon: <CalendarPlus style={{ width: 22, height: 22 }} />, color: 'var(--c-accent2)' },
                                ] as const).map(opt => {
                                    const active = selectedRole === opt.role;
                                    return (
                                        <button key={opt.role} type="button" onClick={() => setValue('role', opt.role)}
                                            style={{
                                                padding: '16px', borderRadius: '18px', textAlign: 'left', cursor: 'pointer',
                                                border: `2px solid ${active ? opt.color : 'var(--c-border)'}`,
                                                background: active ? `${opt.color}14` : 'var(--c-bg)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ color: opt.color, opacity: active ? 1 : 0.45, marginBottom: '8px' }}>{opt.icon}</div>
                                            <div style={{ fontWeight: 800, color: active ? opt.color : 'var(--c-text)', fontSize: '0.9rem' }}>{opt.label}</div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--c-muted)', fontWeight: 600, marginTop: '2px' }}>{opt.subtitle}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary"
                            style={{ justifyContent: 'center', padding: '15px', fontSize: '1rem', width: '100%', opacity: isLoading ? 0.7 : 1, marginTop: '6px' }}
                        >
                            {isLoading
                                ? <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                : <><span>Créer mon Compte</span><ArrowRight style={{ width: 18, height: 18 }} /></>
                            }
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--c-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                    Déjà membre ?{' '}
                    <Link to="/login" style={{ color: 'var(--c-primary)', fontWeight: 800, textDecoration: 'none' }}>Se connecter</Link>
                </p>
            </motion.div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
