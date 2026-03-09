import { Sparkles } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-dark-card border-t border-white/5 pt-12 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="font-black tracking-tight text-white">Event<span className="text-primary">Z&A</span></span>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">
                            La plateforme premium pour la découverte, la création et la réservation d'événements exclusifs.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Liens Utiles</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a href="#" className="hover:text-primary transition-colors">Découvrir</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Créer un événement</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-text-muted">
                    <p>© {new Date().getFullYear()} EventZ&A. Tous droits réservés.</p>
                    <p className="mt-2 md:mt-0">Developpé avec <span className="text-red-500">♥</span></p>
                </div>
            </div>
        </footer>
    );
};
