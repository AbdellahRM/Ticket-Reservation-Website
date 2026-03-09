import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Flame, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    mot_de_passe: z.string().min(1, 'Mot de passe requis'),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate();
    const loginFn = useAuthStore(state => state.login);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setIsLoading(true);
            setServerError('');
            const response = await api.post('?action=connexion_api', data);
            if (response.data.success) {
                loginFn(response.data.user);
                navigate('/');
            }
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Email ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--c-bg)', display: 'flex' }}>
            {/* Left decorative panel */}
            <div className="hidden lg:flex" style={{ flex: 1, background: 'linear-gradient(155deg, var(--c-primary) 0%, var(--c-accent2) 100%)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Flame style={{ width: 32, height: 32 }} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>Bienvenue sur EventZ&A</h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.6, maxWidth: '320px' }}>La plateforme de référence pour les événements exceptionnels du Maroc.</p>
                    <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                        {['500+ Événements disponibles', '10 000+ Participants satisfaits', 'Billetterie 100% sécurisée'].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 700 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ width: '100%', maxWidth: '440px' }}
                >
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--c-text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Ravi de vous revoir !
                    </h1>
                    <p style={{ color: 'var(--c-muted)', fontWeight: 500, marginBottom: '40px' }}>
                        Connectez-vous pour accéder à votre compte.
                    </p>

                    {serverError && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '14px', padding: '14px 18px', fontWeight: 700, fontSize: '0.875rem', marginBottom: '24px' }}
                        >
                            {serverError}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)', marginBottom: '10px' }}>
                                Adresse Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--c-muted)' }} />
                                <input type="email" placeholder="nom@exemple.com" className="input-field" {...register('email')} />
                            </div>
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, marginTop: '6px' }}>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)', marginBottom: '10px' }}>
                                Mot de Passe
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--c-muted)' }} />
                                <input type={showPwd ? 'text' : 'password'} placeholder="Votre mot de passe" className="input-field" style={{ paddingRight: '56px' }} {...register('mot_de_passe')} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--c-muted)', cursor: 'pointer' }}>
                                    {showPwd ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                                </button>
                            </div>
                            {errors.mot_de_passe && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, marginTop: '6px' }}>{errors.mot_de_passe.message}</p>}
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', padding: '16px', fontSize: '1rem', marginTop: '8px', opacity: isLoading ? 0.7 : 1, width: '100%' }}>
                            {isLoading
                                ? <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                : <><span>Se Connecter</span> <ArrowRight style={{ width: 18, height: 18 }} /></>
                            }
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--c-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color: 'var(--c-primary)', fontWeight: 800, textDecoration: 'none' }}>
                            Créer un compte
                        </Link>
                    </p>
                </motion.div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
