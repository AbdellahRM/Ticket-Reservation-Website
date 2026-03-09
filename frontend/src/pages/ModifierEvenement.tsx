import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Tag, Plus, Trash2,
    ArrowLeft, Image as ImageIcon, Sparkles,
    Zap, Save, Loader2, X
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

interface TicketType {
    id?: number;
    nom: string;
    prix: string;
    quantite: string;
}

export const ModifierEvenement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        date_evenement: '',
        date_fin: '',
        lieu: '',
        categorie: 'Concert',
        prix_base: '0.00',
        capacite: ''
    });

    const [tickets, setTickets] = useState<TicketType[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`?action=details_api&id=${id}`);
                if (response.data.success) {
                    const ev = response.data.data.evenement;
                    setFormData({
                        titre: ev.titre,
                        description: ev.description,
                        date_evenement: ev.date_evenement.slice(0, 16).replace(' ', 'T'),
                        date_fin: ev.date_fin ? ev.date_fin.slice(0, 16).replace(' ', 'T') : '',
                        lieu: ev.lieu,
                        categorie: ev.categorie,
                        prix_base: ev.prix_base,
                        capacite: ev.capacite
                    });
                    setTickets(response.data.data.typesTickets.map((t: any) => ({
                        nom: t.nom,
                        prix: t.prix,
                        quantite: t.quantite_disponible
                    })));
                    setExistingImages(response.data.data.images || []);
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const addTicket = () => {
        setTickets(prev => [...prev, { nom: '', prix: '', quantite: '' }]);
    };

    const removeTicket = (index: number) => {
        setTickets(prev => prev.filter((_, i) => i !== index));
    };

    const handleTicketChange = (index: number, field: keyof TicketType, value: string) => {
        const newTickets = [...tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTickets(newTickets);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));

        selectedFiles.forEach((file) => {
            data.append('images[]', file);
        });

        tickets.forEach((ticket, index) => {
            data.append(`tickets[${index}][nom]`, ticket.nom);
            data.append(`tickets[${index}][prix]`, ticket.prix);
            data.append(`tickets[${index}][quantite]`, ticket.quantite);
        });

        try {
            await api.post(`?action=modifier_evenement&id=${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Erreur modification", error);
            alert("Erreur lors de la modification de l'événement.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" style={{ width: 48, height: 48, color: 'var(--c-primary)' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--c-muted)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '32px', textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Retour au tableau de bord
            </Link>

            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                    Modifier l'<span className="gradient-text">Événement</span>
                </h1>
                <p style={{ color: 'var(--c-muted)', fontWeight: 500 }}>Mettez à jour les informations de votre événement.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* General Info */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(245,48,3,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)' }}>
                            <Sparkles size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Informations Générales</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Titre de l'événement</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)', minHeight: '120px', resize: 'vertical' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Date & Heure de début</label>
                                <input
                                    type="datetime-local"
                                    name="date_evenement"
                                    value={formData.date_evenement}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Date & Heure de fin</label>
                                <input
                                    type="datetime-local"
                                    name="date_fin"
                                    value={formData.date_fin}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Lieu</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
                                    <input
                                        type="text"
                                        name="lieu"
                                        value={formData.lieu}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Catégorie</label>
                                <div style={{ position: 'relative' }}>
                                    <Tag size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
                                    <select
                                        name="categorie"
                                        value={formData.categorie}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)', appearance: 'none' }}
                                    >
                                        <option value="Concert">🎵 Concert</option>
                                        <option value="Conférence">🎤 Conférence</option>
                                        <option value="Sport">🏆 Sport</option>
                                        <option value="Théâtre">🎭 Théâtre</option>
                                        <option value="Autre">✨ Autre</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity & Price */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(248,184,3,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-accent2)' }}>
                            <Zap size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Détails & Capacité</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Prix de base (DH)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="prix_base"
                                value={formData.prix_base}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)' }}>Capacité totale</label>
                            <input
                                type="number"
                                name="capacite"
                                value={formData.capacite}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <ImageIcon size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Images de l'événement</h2>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-muted)' }}>Images existantes</label>
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {existingImages.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img
                                            src={`http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/public/images/${img.chemin_image}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: '2px dashed var(--c-border)',
                            borderRadius: '20px',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'var(--c-surface2)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ImageIcon size={32} style={{ color: 'var(--c-muted)', marginBottom: '12px' }} />
                        <p style={{ fontWeight: 700, color: 'var(--c-text)', fontSize: '0.9rem' }}>Ajouter d'autres images</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>

                    {previews.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginTop: '20px' }}>
                            <AnimatePresence>
                                {previews.map((src, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden' }}
                                    >
                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }}
                                            style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Ticket Types */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <ImageIcon size={20} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Types de Tickets</h2>
                        </div>
                        <button type="button" onClick={addTicket} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                            <Plus size={16} /> Ajouter un type
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {tickets.map((ticket, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 50px', gap: '16px', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Nom du ticket</label>
                                    <input
                                        type="text"
                                        value={ticket.nom}
                                        onChange={(e) => handleTicketChange(idx, 'nom', e.target.value)}
                                        className="form-control"
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Prix (DH)</label>
                                    <input
                                        type="number"
                                        value={ticket.prix}
                                        onChange={(e) => handleTicketChange(idx, 'prix', e.target.value)}
                                        className="form-control"
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Quantité</label>
                                    <input
                                        type="number"
                                        value={ticket.quantite}
                                        onChange={(e) => handleTicketChange(idx, 'quantite', e.target.value)}
                                        className="form-control"
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--c-border)', background: 'var(--c-bg)', color: 'var(--c-text)' }}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTicket(idx)}
                                    disabled={tickets.length === 1}
                                    style={{
                                        width: '42px', height: '42px', borderRadius: '10px', border: 'none',
                                        background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: tickets.length === 1 ? 'not-allowed' : 'pointer',
                                        opacity: tickets.length === 1 ? 0.5 : 1
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary"
                        style={{ flex: 1, padding: '18px', fontSize: '1.1rem', justifyContent: 'center' }}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Enregistrer les modifications</>}
                    </button>
                    <Link to="/dashboard" className="btn-outline" style={{ flex: '0 0 200px', padding: '18px', justifyContent: 'center', textDecoration: 'none' }}>
                        Annuler
                    </Link>
                </div>
            </form>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
