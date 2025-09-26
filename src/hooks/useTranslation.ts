import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';

export interface Translations {
  [key: string]: {
    en: string;
    pt: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', pt: 'Painel', fr: 'Tableau de bord' },
  'nav.goals': { en: 'Goals', pt: 'Objetivos', fr: 'Objectifs' },
  'nav.profile': { en: 'Profile', pt: 'Perfil', fr: 'Profil' },
  'nav.settings': { en: 'Settings', pt: 'Configurações', fr: 'Paramètres' },
  'nav.history': { en: 'History', pt: 'Histórico', fr: 'Historique' },

  // Profile
  'profile.title': { en: 'Profile', pt: 'Perfil', fr: 'Profil' },
  'profile.subtitle': { en: 'Manage your account settings', pt: 'Gerencie as configurações da sua conta', fr: 'Gérez les paramètres de votre compte' },
  'profile.edit': { en: 'Edit Profile', pt: 'Editar Perfil', fr: 'Modifier le profil' },
  'profile.name': { en: 'Display Name', pt: 'Nome de Exibição', fr: 'Nom d\'affichage' },
  'profile.email': { en: 'Email', pt: 'E-mail', fr: 'E-mail' },
  'profile.language': { en: 'Language', pt: 'Idioma', fr: 'Langue' },
  'profile.notifications': { en: 'Notifications', pt: 'Notificações', fr: 'Notifications' },
  'profile.save': { en: 'Save Changes', pt: 'Salvar Alterações', fr: 'Enregistrer les modifications' },
  'profile.cancel': { en: 'Cancel', pt: 'Cancelar', fr: 'Annuler' },
  'profile.saving': { en: 'Saving...', pt: 'Salvando...', fr: 'Enregistrement...' },

  // Settings
  'settings.title': { en: 'Settings', pt: 'Configurações', fr: 'Paramètres' },
  'settings.subtitle': { en: 'Customize your Pivoo experience', pt: 'Personalize sua experiência Pivoo', fr: 'Personnalisez votre expérience Pivoo' },
  'settings.notifications.title': { en: 'Notifications', pt: 'Notificações', fr: 'Notifications' },
  'settings.notifications.subtitle': { en: 'Manage how you receive updates and reminders', pt: 'Gerencie como você recebe atualizações e lembretes', fr: 'Gérez comment vous recevez les mises à jour et rappels' },
  'settings.privacy.title': { en: 'Privacy & Security', pt: 'Privacidade e Segurança', fr: 'Confidentialité et sécurité' },
  'settings.privacy.subtitle': { en: 'Control your data and privacy settings', pt: 'Controle seus dados e configurações de privacidade', fr: 'Contrôlez vos données et paramètres de confidentialité' },
  'settings.export': { en: 'Export Data', pt: 'Exportar Dados', fr: 'Exporter les données' },
  'settings.delete': { en: 'Delete Account', pt: 'Excluir Conta', fr: 'Supprimer le compte' },
  'settings.logout': { en: 'Logout', pt: 'Sair', fr: 'Se déconnecter' },

  // History
  'history.title': { en: 'History & Archive', pt: 'Histórico e Arquivo', fr: 'Historique et archives' },
  'history.subtitle': { en: 'View your past achievements and progress', pt: 'Veja suas conquistas e progresso passados', fr: 'Consultez vos réalisations et progrès passés' },
  'history.noData': { en: 'No historical data available', pt: 'Nenhum dado histórico disponível', fr: 'Aucune donnée historique disponible' },

  // Privacy
  'privacy.disclaimer': { 
    en: 'Your data is private and securely stored in Supabase. You can delete your account at any time.',
    pt: 'Seus dados são privados e armazenados com segurança no Supabase. Você pode excluir sua conta a qualquer momento.',
    fr: 'Vos données sont privées et stockées en toute sécurité dans Supabase. Vous pouvez supprimer votre compte à tout moment.'
  },

  // Languages
  'language.en': { en: 'English', pt: 'Inglês', fr: 'Anglais' },
  'language.pt': { en: 'Portuguese', pt: 'Português', fr: 'Portugais' },
  'language.fr': { en: 'French', pt: 'Francês', fr: 'Français' },

  // Common
  'common.loading': { en: 'Loading...', pt: 'Carregando...', fr: 'Chargement...' },
  'common.save': { en: 'Save', pt: 'Salvar', fr: 'Enregistrer' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar', fr: 'Annuler' },
  'common.confirm': { en: 'Confirm', pt: 'Confirmar', fr: 'Confirmer' },
  'common.year': { en: 'Year', pt: 'Ano', fr: 'Année' },
};

export const useTranslation = () => {
  const { profile } = useProfile();
  const [language, setLanguage] = useState<'en' | 'pt' | 'fr'>('en');

  useEffect(() => {
    if (profile?.language) {
      setLanguage(profile.language as 'en' | 'pt' | 'fr');
    }
  }, [profile?.language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
  };

  return { 
    t, 
    language, 
    setLanguage: (lang: 'en' | 'pt' | 'fr') => setLanguage(lang) 
  };
};