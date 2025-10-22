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
  'nav.selfDiscovery': { en: 'Self-Discovery', pt: 'Autodescoberta', fr: 'Découverte de soi' },
  'nav.menu': { en: 'Pivoo Menu', pt: 'Menu Pivoo', fr: 'Menu Pivoo' },
  'nav.signOut': { en: 'Sign Out', pt: 'Sair', fr: 'Se déconnecter' },
  'nav.signIn': { en: 'Sign In', pt: 'Entrar', fr: 'Se connecter' },
  'nav.createAccount': { en: 'Create Account', pt: 'Criar Conta', fr: 'Créer un compte' },
  'nav.loginRequired': { en: 'Login required', pt: 'Login necessário', fr: 'Connexion requise' },
  'nav.exploringAsGuest': { en: 'Exploring as guest', pt: 'Explorando como convidado', fr: 'Explorer en tant qu\'invité' },
  'nav.growthJourney': { en: 'Growth Journey', pt: 'Jornada de Crescimento', fr: 'Voyage de croissance' },

  // Auth
  'auth.welcomeBack': { en: 'Welcome back', pt: 'Bem-vindo de volta', fr: 'Bon retour' },
  'auth.createAccount': { en: 'Create account', pt: 'Criar conta', fr: 'Créer un compte' },
  'auth.signInDescription': { en: 'Sign in to continue your growth journey', pt: 'Entre para continuar sua jornada de crescimento', fr: 'Connectez-vous pour continuer votre voyage de croissance' },
  'auth.signUpDescription': { en: 'Start your personal growth journey', pt: 'Inicie sua jornada de crescimento pessoal', fr: 'Commencez votre voyage de croissance personnelle' },
  'auth.signIn': { en: 'Sign In', pt: 'Entrar', fr: 'Se connecter' },
  'auth.signUp': { en: 'Sign Up', pt: 'Cadastrar', fr: 'S\'inscrire' },
  'auth.email': { en: 'Email', pt: 'E-mail', fr: 'E-mail' },
  'auth.password': { en: 'Password', pt: 'Senha', fr: 'Mot de passe' },
  'auth.confirmPassword': { en: 'Confirm Password', pt: 'Confirmar Senha', fr: 'Confirmer le mot de passe' },
  'auth.name': { en: 'Name (optional)', pt: 'Nome (opcional)', fr: 'Nom (facultatif)' },
  'auth.emailPlaceholder': { en: 'your@email.com', pt: 'seu@email.com', fr: 'votre@email.com' },
  'auth.passwordPlaceholder': { en: 'Enter your password', pt: 'Digite sua senha', fr: 'Entrez votre mot de passe' },
  'auth.createPasswordPlaceholder': { en: 'Create a password', pt: 'Crie uma senha', fr: 'Créez un mot de passe' },
  'auth.confirmPasswordPlaceholder': { en: 'Confirm your password', pt: 'Confirme sua senha', fr: 'Confirmez votre mot de passe' },
  'auth.namePlaceholder': { en: 'Your name', pt: 'Seu nome', fr: 'Votre nom' },
  'auth.signingIn': { en: 'Signing in...', pt: 'Entrando...', fr: 'Connexion...' },
  'auth.creatingAccount': { en: 'Creating account...', pt: 'Criando conta...', fr: 'Création du compte...' },
  'auth.signInFailed': { en: 'Sign in failed', pt: 'Falha ao entrar', fr: 'Échec de la connexion' },
  'auth.signUpFailed': { en: 'Sign up failed', pt: 'Falha ao cadastrar', fr: 'Échec de l\'inscription' },
  'auth.unexpectedError': { en: 'An unexpected error occurred', pt: 'Ocorreu um erro inesperado', fr: 'Une erreur inattendue s\'est produite' },
  'auth.passwordMismatch': { en: 'Passwords do not match', pt: 'As senhas não coincidem', fr: 'Les mots de passe ne correspondent pas' },
  'auth.passwordMismatchDesc': { en: 'Please make sure both passwords are identical', pt: 'Certifique-se de que ambas as senhas são idênticas', fr: 'Assurez-vous que les deux mots de passe sont identiques' },
  'auth.accountExists': { en: 'Account already exists', pt: 'Conta já existe', fr: 'Le compte existe déjà' },
  'auth.accountExistsDesc': { en: 'This email is already registered. Try signing in instead.', pt: 'Este e-mail já está registrado. Tente entrar.', fr: 'Cet e-mail est déjà enregistré. Essayez de vous connecter.' },
  'auth.accountCreated': { en: 'Account created successfully!', pt: 'Conta criada com sucesso!', fr: 'Compte créé avec succès!' },
  'auth.accountCreatedDesc': { en: 'You can now start your growth journey.', pt: 'Você pode começar sua jornada de crescimento.', fr: 'Vous pouvez maintenant commencer votre voyage de croissance.' },
  'auth.alreadyHaveAccount': { en: 'I already have an account', pt: 'Já tenho uma conta', fr: 'J\'ai déjà un compte' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome back', pt: 'Bem-vindo de volta', fr: 'Bon retour' },
  'dashboard.welcomeGuest': { en: 'Welcome, Explorer', pt: 'Bem-vindo, Explorador', fr: 'Bienvenue, Explorateur' },
  'dashboard.welcomeGeneric': { en: 'Welcome', pt: 'Bem-vindo', fr: 'Bienvenue' },
  'dashboard.overviewGuest': { en: 'Your overview will appear here once you create an account', pt: 'Sua visão geral aparecerá aqui quando você criar uma conta', fr: 'Votre aperçu apparaîtra ici une fois que vous aurez créé un compte' },
  'dashboard.overview': { en: 'Here\'s your daily overview and progress', pt: 'Aqui está sua visão geral diária e progresso', fr: 'Voici votre aperçu quotidien et vos progrès' },
  'dashboard.dailyCheckIn': { en: 'Daily Check-in', pt: 'Check-in Diário', fr: 'Bilan quotidien' },
  'dashboard.startYourDay': { en: 'Start your day with intention', pt: 'Comece seu dia com intenção', fr: 'Commencez votre journée avec intention' },
  'dashboard.comingSoon': { en: 'Coming Soon', pt: 'Em Breve', fr: 'Bientôt disponible' },
  'dashboard.dailyReflections': { en: 'Daily reflections and mood tracking will appear here', pt: 'Reflexões diárias e rastreamento de humor aparecerão aqui', fr: 'Les réflexions quotidiennes et le suivi de l\'humeur apparaîtront ici' },
  'dashboard.mindfulnessCorner': { en: 'Mindfulness Corner', pt: 'Canto da Atenção Plena', fr: 'Coin de pleine conscience' },
  'dashboard.takeAMoment': { en: 'Take a moment for yourself', pt: 'Tire um momento para você', fr: 'Prenez un moment pour vous' },
  'dashboard.breathingExercises': { en: 'Breathing exercises and mindful moments will be here', pt: 'Exercícios de respiração e momentos conscientes estarão aqui', fr: 'Des exercices de respiration et des moments de pleine conscience seront ici' },
  'dashboard.readyToStart': { en: 'Ready to start your journey?', pt: 'Pronto para começar sua jornada?', fr: 'Prêt à commencer votre voyage?' },
  'dashboard.createAccountPrompt': { en: 'Create an account to track your progress and unlock all features', pt: 'Crie uma conta para rastrear seu progresso e desbloquear todos os recursos', fr: 'Créez un compte pour suivre vos progrès et débloquer toutes les fonctionnalités' },

  // Goals
  'goals.title': { en: 'Goals', pt: 'Objetivos', fr: 'Objectifs' },
  'goals.subtitle': { en: 'Set and track your personal development objectives', pt: 'Defina e acompanhe seus objetivos de desenvolvimento pessoal', fr: 'Définissez et suivez vos objectifs de développement personnel' },
  'goals.addGoal': { en: 'Add Goal', pt: 'Adicionar Objetivo', fr: 'Ajouter un objectif' },
  'goals.addFirstGoal': { en: 'Add Your First Goal', pt: 'Adicione Seu Primeiro Objetivo', fr: 'Ajoutez votre premier objectif' },
  'goals.setFirstGoal': { en: 'Set Your First Goal', pt: 'Defina Seu Primeiro Objetivo', fr: 'Définissez votre premier objectif' },
  'goals.loadingGoals': { en: 'Loading goals...', pt: 'Carregando objetivos...', fr: 'Chargement des objectifs...' },
  'goals.transformAspiration': { en: 'Transform your aspirations into achievable objectives with our SMART goal framework', pt: 'Transforme suas aspirações em objetivos alcançáveis com nossa estrutura de metas SMART', fr: 'Transformez vos aspirations en objectifs réalisables avec notre cadre d\'objectifs SMART' },
  'goals.signupPrompt': { en: 'Sign up to start tracking your goals and connect them with your values', pt: 'Cadastre-se para começar a rastrear seus objetivos e conectá-los com seus valores', fr: 'Inscrivez-vous pour commencer à suivre vos objectifs et les connecter à vos valeurs' },
  'goals.smartGoals': { en: 'Smart Goals', pt: 'Objetivos Inteligentes', fr: 'Objectifs intelligents' },
  'goals.smartGoalsDesc': { en: 'Create specific, measurable, achievable, relevant, and time-bound objectives', pt: 'Crie objetivos específicos, mensuráveis, alcançáveis, relevantes e com prazo definido', fr: 'Créez des objectifs spécifiques, mesurables, atteignables, pertinents et limités dans le temps' },
  'goals.progressTracking': { en: 'Progress Tracking', pt: 'Rastreamento de Progresso', fr: 'Suivi des progrès' },
  'goals.progressTrackingDesc': { en: 'Monitor your progress with visual indicators and milestone tracking', pt: 'Monitore seu progresso com indicadores visuais e rastreamento de marcos', fr: 'Surveillez vos progrès avec des indicateurs visuels et le suivi des jalons' },
  'goals.categories': { en: 'Categories', pt: 'Categorias', fr: 'Catégories' },
  'goals.categoriesDesc': { en: 'Organize goals by life areas and connect them with your core values', pt: 'Organize objetivos por áreas da vida e conecte-os com seus valores essenciais', fr: 'Organisez les objectifs par domaines de vie et connectez-les à vos valeurs fondamentales' },
  'goals.reminders': { en: 'Reminders', pt: 'Lembretes', fr: 'Rappels' },
  'goals.remindersDesc': { en: 'Stay on track with smart notifications and deadline alerts', pt: 'Mantenha-se no caminho com notificações inteligentes e alertas de prazo', fr: 'Restez sur la bonne voie avec des notifications intelligentes et des alertes de délai' },
  'goals.timeBound': { en: 'Time-bound', pt: 'Com Prazo', fr: 'Limité dans le temps' },
  'goals.specific': { en: 'Specific', pt: 'Específico', fr: 'Spécifique' },
  'goals.achievable': { en: 'Achievable', pt: 'Alcançável', fr: 'Atteignable' },

  // Goal Dialog
  'goal.addNew': { en: 'Add New Goal', pt: 'Adicionar Novo Objetivo', fr: 'Ajouter un nouvel objectif' },
  'goal.createYourGoal': { en: 'Create Your Goal', pt: 'Crie Seu Objetivo', fr: 'Créez votre objectif' },
  'goal.defineWhatYouWant': { en: 'Define what you want to achieve and how', pt: 'Defina o que você quer alcançar e como', fr: 'Définissez ce que vous voulez réaliser et comment' },
  'goal.type': { en: 'Goal Type', pt: 'Tipo de Objetivo', fr: 'Type d\'objectif' },
  'goal.outcomeGoal': { en: 'Outcome Goal', pt: 'Objetivo de Resultado', fr: 'Objectif de résultat' },
  'goal.outcomeDesc': { en: 'A specific result to achieve', pt: 'Um resultado específico a alcançar', fr: 'Un résultat spécifique à atteindre' },
  'goal.processGoal': { en: 'Process Goal', pt: 'Objetivo de Processo', fr: 'Objectif de processus' },
  'goal.processDesc': { en: 'A habit or recurring action', pt: 'Um hábito ou ação recorrente', fr: 'Une habitude ou une action récurrente' },
  'goal.title': { en: 'Goal Title', pt: 'Título do Objetivo', fr: 'Titre de l\'objectif' },
  'goal.titlePlaceholderOutcome': { en: 'e.g., Reach 75kg by December', pt: 'ex: Atingir 75kg até dezembro', fr: 'par exemple, Atteindre 75kg d\'ici décembre' },
  'goal.titlePlaceholderProcess': { en: 'e.g., Exercise 3 times per week', pt: 'ex: Exercitar 3 vezes por semana', fr: 'par exemple, Faire de l\'exercice 3 fois par semaine' },
  'goal.lifeArea': { en: 'Life Area', pt: 'Área da Vida', fr: 'Domaine de vie' },
  'goal.selectArea': { en: 'Select area', pt: 'Selecionar área', fr: 'Sélectionner le domaine' },
  'goal.targetDate': { en: 'Target Date', pt: 'Data Alvo', fr: 'Date cible' },
  'goal.description': { en: 'Description', pt: 'Descrição', fr: 'Description' },
  'goal.descriptionOptional': { en: 'Description (Optional)', pt: 'Descrição (Opcional)', fr: 'Description (Facultatif)' },
  'goal.descriptionPlaceholder': { en: 'Why is this goal important to you?', pt: 'Por que este objetivo é importante para você?', fr: 'Pourquoi cet objectif est-il important pour vous?' },
  'goal.connectToValues': { en: 'Connect to Your Values (Optional)', pt: 'Conectar aos Seus Valores (Opcional)', fr: 'Connecter à vos valeurs (Facultatif)' },
  'goal.addActivities': { en: 'Add Activities', pt: 'Adicionar Atividades', fr: 'Ajouter des activités' },
  'goal.defineActions': { en: 'Define specific actions that will help you achieve this goal', pt: 'Defina ações específicas que ajudarão você a alcançar este objetivo', fr: 'Définissez des actions spécifiques qui vous aideront à atteindre cet objectif' },
  'goal.activity': { en: 'Activity', pt: 'Atividade', fr: 'Activité' },
  'goal.activityPlaceholder': { en: 'e.g., Go to the gym, Read for 30 minutes', pt: 'ex: Ir à academia, Ler por 30 minutos', fr: 'par exemple, Aller à la salle de sport, Lire pendant 30 minutes' },
  'goal.frequency': { en: 'Frequency', pt: 'Frequência', fr: 'Fréquence' },
  'goal.frequencyPlaceholder': { en: 'e.g., 3x/week', pt: 'ex: 3x/semana', fr: 'par exemple, 3x/semaine' },
  'goal.addAnotherActivity': { en: 'Add Another Activity', pt: 'Adicionar Outra Atividade', fr: 'Ajouter une autre activité' },
  'goal.stepOf': { en: 'Step', pt: 'Etapa', fr: 'Étape' },
  'goal.of': { en: 'of', pt: 'de', fr: 'de' },
  'goal.nextAddActivities': { en: 'Next: Add Activities', pt: 'Próximo: Adicionar Atividades', fr: 'Suivant: Ajouter des activités' },
  'goal.back': { en: 'Back', pt: 'Voltar', fr: 'Retour' },
  'goal.creating': { en: 'Creating...', pt: 'Criando...', fr: 'Création...' },
  'goal.createGoal': { en: 'Create Goal', pt: 'Criar Objetivo', fr: 'Créer un objectif' },
  'goal.created': { en: 'Goal created!', pt: 'Objetivo criado!', fr: 'Objectif créé!' },
  'goal.createdDesc': { en: 'has been added to your goals.', pt: 'foi adicionado aos seus objetivos.', fr: 'a été ajouté à vos objectifs.' },
  'goal.error': { en: 'Error', pt: 'Erro', fr: 'Erreur' },
  'goal.errorDesc': { en: 'Failed to create goal. Please try again.', pt: 'Falha ao criar objetivo. Por favor, tente novamente.', fr: 'Échec de la création de l\'objectif. Veuillez réessayer.' },
  'goal.enterGoal': { en: 'Enter your goal', pt: 'Digite seu objetivo', fr: 'Entrez votre objectif' },
  'goal.describeGoal': { en: 'Describe your goal in detail', pt: 'Descreva seu objetivo em detalhes', fr: 'Décrivez votre objectif en détail' },
  'goal.selectCategory': { en: 'Select a category', pt: 'Selecione uma categoria', fr: 'Sélectionnez une catégorie' },
  'goal.selectLifeArea': { en: 'Select a life area', pt: 'Selecione uma área da vida', fr: 'Sélectionnez un domaine de vie' },
  'goal.relatedValues': { en: 'Related Values', pt: 'Valores Relacionados', fr: 'Valeurs connexes' },

  // Goal Card
  'goal.markComplete': { en: 'Mark Complete', pt: 'Marcar como Concluído', fr: 'Marquer comme terminé' },
  'goal.reactivate': { en: 'Reactivate', pt: 'Reativar', fr: 'Réactiver' },
  'goal.statusActive': { en: 'active', pt: 'ativo', fr: 'actif' },
  'goal.statusCompleted': { en: 'completed', pt: 'concluído', fr: 'terminé' },
  'goal.statusOnHold': { en: 'on hold', pt: 'em espera', fr: 'en attente' },
  'goal.statusInProgress': { en: 'in progress', pt: 'em progresso', fr: 'en cours' },
  'goal.statusArchived': { en: 'archived', pt: 'arquivado', fr: 'archivé' },

  // Check-in
  'checkin.progressTracking': { en: 'Progress Tracking', pt: 'Rastreamento de Progresso', fr: 'Suivi des progrès' },
  'checkin.doneNotDone': { en: 'Done/Not Done', pt: 'Feito/Não Feito', fr: 'Fait/Pas fait' },
  'checkin.number': { en: 'Number', pt: 'Número', fr: 'Nombre' },
  'checkin.percentage': { en: 'Percentage', pt: 'Porcentagem', fr: 'Pourcentage' },
  'checkin.markAsDone': { en: 'Mark as Done', pt: 'Marcar como Feito', fr: 'Marquer comme fait' },
  'checkin.recording': { en: 'Recording...', pt: 'Gravando...', fr: 'Enregistrement...' },
  'checkin.record': { en: 'Record', pt: 'Gravar', fr: 'Enregistrer' },
  'checkin.enterValue': { en: 'Enter value', pt: 'Digite o valor', fr: 'Entrez la valeur' },
  'checkin.recentProgress': { en: 'Recent Progress', pt: 'Progresso Recente', fr: 'Progrès récent' },
  'checkin.done': { en: 'Done', pt: 'Feito', fr: 'Fait' },
  'checkin.notDone': { en: 'Not done', pt: 'Não feito', fr: 'Pas fait' },

  // Self-Discovery
  'selfDiscovery.title': { en: 'Self-Discovery', pt: 'Autodescoberta', fr: 'Découverte de soi' },
  'selfDiscovery.subtitle': { en: 'Explore your inner landscape and authentic self', pt: 'Explore sua paisagem interior e ser autêntico', fr: 'Explorez votre paysage intérieur et votre moi authentique' },
  'selfDiscovery.savingChanges': { en: 'Saving changes...', pt: 'Salvando alterações...', fr: 'Enregistrement des modifications...' },
  'selfDiscovery.loadingData': { en: 'Loading your self-discovery data...', pt: 'Carregando seus dados de autodescoberta...', fr: 'Chargement de vos données de découverte de soi...' },
  'selfDiscovery.lifeWheel': { en: 'Life Wheel', pt: 'Roda da Vida', fr: 'Roue de la vie' },
  'selfDiscovery.values': { en: 'Values', pt: 'Valores', fr: 'Valeurs' },
  'selfDiscovery.vision': { en: 'Vision', pt: 'Visão', fr: 'Vision' },
  'selfDiscovery.chart': { en: 'Chart', pt: 'Gráfico', fr: 'Graphique' },
  'selfDiscovery.list': { en: 'List', pt: 'Lista', fr: 'Liste' },
  'selfDiscovery.guestNotice': { en: 'You\'re in guest mode. Your changes are saved locally but won\'t persist across devices.', pt: 'Você está no modo convidado. Suas alterações são salvas localmente, mas não persistirão entre dispositivos.', fr: 'Vous êtes en mode invité. Vos modifications sont enregistrées localement mais ne persisteront pas sur les appareils.' },
  'selfDiscovery.signupToSave': { en: 'Sign up to save your progress', pt: 'Cadastre-se para salvar seu progresso', fr: 'Inscrivez-vous pour sauvegarder vos progrès' },

  // Intro
  'intro.welcome': { en: 'Welcome to', pt: 'Bem-vindo ao', fr: 'Bienvenue à' },
  'intro.tagline': { en: 'Your space of clarity and growth. Track your journey, set meaningful goals, and discover your authentic self.', pt: 'Seu espaço de clareza e crescimento. Acompanhe sua jornada, defina metas significativas e descubra seu ser autêntico.', fr: 'Votre espace de clarté et de croissance. Suivez votre parcours, définissez des objectifs significatifs et découvrez votre moi authentique.' },
  'intro.startExploring': { en: 'Start Exploring', pt: 'Começar a Explorar', fr: 'Commencer à explorer' },
  'intro.gettingStarted': { en: 'Getting started...', pt: 'Começando...', fr: 'Démarrage...' },
  'intro.continueAsGuest': { en: 'Continue as guest to explore, or create an account to save your progress', pt: 'Continue como convidado para explorar ou crie uma conta para salvar seu progresso', fr: 'Continuez en tant qu\'invité pour explorer ou créez un compte pour sauvegarder vos progrès' },
  'intro.heroAlt': { en: 'Personal growth journey', pt: 'Jornada de crescimento pessoal', fr: 'Voyage de croissance personnelle' },

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
  'settings.appearance': { en: 'Appearance', pt: 'Aparência', fr: 'Apparence' },
  'settings.appearanceDesc': { en: 'Customize the look and feel of the app', pt: 'Personalize a aparência e sensação do aplicativo', fr: 'Personnalisez l\'apparence et la sensation de l\'application' },
  'settings.themeComingSoon': { en: 'Theme settings and customization options coming soon', pt: 'Configurações de tema e opções de personalização em breve', fr: 'Paramètres de thème et options de personnalisation bientôt disponibles' },
  'settings.export': { en: 'Export Data', pt: 'Exportar Dados', fr: 'Exporter les données' },
  'settings.delete': { en: 'Delete Account', pt: 'Excluir Conta', fr: 'Supprimer le compte' },
  'settings.logout': { en: 'Logout', pt: 'Sair', fr: 'Se déconnecter' },
  'settings.downloadData': { en: 'Download your personal data', pt: 'Baixar seus dados pessoais', fr: 'Télécharger vos données personnelles' },
  'settings.permanentlyDeleteAccount': { en: 'Permanently delete your account', pt: 'Excluir permanentemente sua conta', fr: 'Supprimer définitivement votre compte' },
  'settings.appInformation': { en: 'App Information', pt: 'Informações do App', fr: 'Informations de l\'application' },
  'settings.version': { en: 'Version', pt: 'Versão', fr: 'Version' },
  'settings.status': { en: 'Status', pt: 'Status', fr: 'Statut' },
  'settings.development': { en: 'Development', pt: 'Desenvolvimento', fr: 'Développement' },
  'settings.limitedGuestAccess': { en: 'Limited Guest Access', pt: 'Acesso Limitado de Convidado', fr: 'Accès invité limité' },
  'settings.guestAccessDesc': { en: 'Some settings require an account. Create one to unlock full functionality.', pt: 'Algumas configurações requerem uma conta. Crie uma para desbloquear toda a funcionalidade.', fr: 'Certains paramètres nécessitent un compte. Créez-en un pour débloquer toutes les fonctionnalités.' },

  // History
  'history.title': { en: 'History & Archive', pt: 'Histórico e Arquivo', fr: 'Historique et archives' },
  'history.subtitle': { en: 'View your past achievements and progress', pt: 'Veja suas conquistas e progresso passados', fr: 'Consultez vos réalisations et progrès passés' },
  'history.noData': { en: 'No historical data available', pt: 'Nenhum dado histórico disponível', fr: 'Aucune donnée historique disponible' },
  'history.completeGoals': { en: 'Complete some goals and visions to see your history here.', pt: 'Complete alguns objetivos e visões para ver seu histórico aqui.', fr: 'Complétez quelques objectifs et visions pour voir votre historique ici.' },
  'history.goalsCompleted': { en: 'of {total} goals completed', pt: 'de {total} objetivos concluídos', fr: 'de {total} objectifs terminés' },
  'history.complete': { en: 'Complete', pt: 'Completo', fr: 'Terminé' },
  'history.visionFor': { en: 'Vision for', pt: 'Visão para', fr: 'Vision pour' },
  'history.word': { en: 'Word', pt: 'Palavra', fr: 'Mot' },
  'history.phrase': { en: 'Phrase', pt: 'Frase', fr: 'Phrase' },
  'history.completedGoals': { en: 'Completed Goals', pt: 'Objetivos Concluídos', fr: 'Objectifs terminés' },
  'history.moreGoals': { en: '+{count} more goals', pt: '+{count} mais objetivos', fr: '+{count} objectifs de plus' },
  'history.yearSummary': { en: 'Year Summary', pt: 'Resumo do Ano', fr: 'Résumé de l\'année' },
  'history.summaryPlaceholder': { en: 'Write a summary of your year...', pt: 'Escreva um resumo do seu ano...', fr: 'Écrivez un résumé de votre année...' },
  'history.noSummary': { en: 'No summary yet. Click edit to add your thoughts about', pt: 'Nenhum resumo ainda. Clique em editar para adicionar seus pensamentos sobre', fr: 'Pas encore de résumé. Cliquez sur modifier pour ajouter vos réflexions sur' },

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

  // Categories
  'category.personalDevelopment': { en: 'Personal Development', pt: 'Desenvolvimento Pessoal', fr: 'Développement personnel' },
  'category.healthFitness': { en: 'Health & Fitness', pt: 'Saúde e Fitness', fr: 'Santé et forme physique' },
  'category.career': { en: 'Career', pt: 'Carreira', fr: 'Carrière' },
  'category.relationships': { en: 'Relationships', pt: 'Relacionamentos', fr: 'Relations' },
  'category.finance': { en: 'Finance', pt: 'Finanças', fr: 'Finances' },
  'category.education': { en: 'Education', pt: 'Educação', fr: 'Éducation' },
  'category.travel': { en: 'Travel', pt: 'Viagens', fr: 'Voyage' },
  'category.hobbies': { en: 'Hobbies', pt: 'Hobbies', fr: 'Loisirs' },
  'category.other': { en: 'Other', pt: 'Outro', fr: 'Autre' },

  // Common
  'common.loading': { en: 'Loading...', pt: 'Carregando...', fr: 'Chargement...' },
  'common.save': { en: 'Save', pt: 'Salvar', fr: 'Enregistrer' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar', fr: 'Annuler' },
  'common.confirm': { en: 'Confirm', pt: 'Confirmar', fr: 'Confirmer' },
  'common.year': { en: 'Year', pt: 'Ano', fr: 'Année' },
  'common.edit': { en: 'Edit', pt: 'Editar', fr: 'Modifier' },
  'common.delete': { en: 'Delete', pt: 'Excluir', fr: 'Supprimer' },
  'common.close': { en: 'Close', pt: 'Fechar', fr: 'Fermer' },
  'common.back': { en: 'Back', pt: 'Voltar', fr: 'Retour' },
  'common.next': { en: 'Next', pt: 'Próximo', fr: 'Suivant' },
  'common.done': { en: 'Done', pt: 'Feito', fr: 'Fait' },
  'common.optional': { en: 'Optional', pt: 'Opcional', fr: 'Facultatif' },
  'common.required': { en: 'Required', pt: 'Obrigatório', fr: 'Requis' },
  'common.access': { en: 'Access', pt: 'Acesso', fr: 'Accès' },
  'common.verified': { en: 'Verified', pt: 'Verificado', fr: 'Vérifié' },
  'common.notSet': { en: 'Not set', pt: 'Não definido', fr: 'Non défini' },
  'common.personalInformation': { en: 'Personal Information', pt: 'Informações Pessoais', fr: 'Informations personnelles' },
  'common.preferences': { en: 'Preferences', pt: 'Preferências', fr: 'Préférences' },
  'common.enableNotifications': { en: 'Enable notifications', pt: 'Habilitar notificações', fr: 'Activer les notifications' },
  'common.receiveUpdates': { en: 'Receive updates and reminders', pt: 'Receber atualizações e lembretes', fr: 'Recevoir des mises à jour et rappels' },
  'common.on': { en: 'On', pt: 'Ligado', fr: 'Activé' },
  'common.off': { en: 'Off', pt: 'Desligado', fr: 'Désactivé' },
  'common.accountInformation': { en: 'Account Information', pt: 'Informações da Conta', fr: 'Informations du compte' },
  'common.accountCreated': { en: 'Your account was created on', pt: 'Sua conta foi criada em', fr: 'Votre compte a été créé le' },
  'common.unknown': { en: 'Unknown', pt: 'Desconhecido', fr: 'Inconnu' },
  'common.privacyDataSecurity': { en: 'Privacy & Data Security', pt: 'Privacidade e Segurança de Dados', fr: 'Confidentialité et sécurité des données' },
  'common.accountActions': { en: 'Account Actions', pt: 'Ações da Conta', fr: 'Actions du compte' },
  'common.manageAccount': { en: 'Manage your account and data', pt: 'Gerencie sua conta e dados', fr: 'Gérez votre compte et vos données' },
  'common.signOutAccount': { en: 'Sign out of your account', pt: 'Sair da sua conta', fr: 'Se déconnecter de votre compte' },
  'common.permanentlyDelete': { en: 'Permanently delete your account and all data', pt: 'Excluir permanentemente sua conta e todos os dados', fr: 'Supprimer définitivement votre compte et toutes les données' },
  'common.loggedOutSuccessfully': { en: 'Logged out successfully', pt: 'Deslogado com sucesso', fr: 'Déconnexion réussie' },
  'common.loggedOutDesc': { en: 'You have been signed out of your account.', pt: 'Você foi deslogado da sua conta.', fr: 'Vous avez été déconnecté de votre compte.' },
  'common.error': { en: 'Error', pt: 'Erro', fr: 'Erreur' },
  'common.failedLogout': { en: 'Failed to log out. Please try again.', pt: 'Falha ao sair. Por favor, tente novamente.', fr: 'Échec de la déconnexion. Veuillez réessayer.' },

  // Dashboard KPI Cards
  'kpi.goalsCompleted': { en: 'Goals Completed', pt: 'Objetivos Concluídos', fr: 'Objectifs terminés' },
  'kpi.ofAllGoals': { en: 'of all your goals', pt: 'de todos os seus objetivos', fr: 'de tous vos objectifs' },
  'kpi.longestStreak': { en: 'Longest Streak', pt: 'Sequência Mais Longa', fr: 'Série la plus longue' },
  'kpi.consecutiveDays': { en: 'consecutive days', pt: 'dias consecutivos', fr: 'jours consécutifs' },
  'kpi.strongestArea': { en: 'Strongest Area', pt: 'Área Mais Forte', fr: 'Domaine le plus fort' },
  'kpi.highestLifeScore': { en: 'highest life score', pt: 'pontuação de vida mais alta', fr: 'score de vie le plus élevé' },
  'kpi.focusArea': { en: 'Focus Area', pt: 'Área de Foco', fr: 'Domaine d\'attention' },
  'kpi.needsAttention': { en: 'needs attention', pt: 'precisa de atenção', fr: 'nécessite de l\'attention' },
  'kpi.excellent': { en: 'Excellent', pt: 'Excelente', fr: 'Excellent' },
  'kpi.good': { en: 'Good', pt: 'Bom', fr: 'Bon' },
  'kpi.needsFocus': { en: 'Needs Focus', pt: 'Precisa de Foco', fr: 'Nécessite de l\'attention' },
  'kpi.onFire': { en: 'On Fire!', pt: 'Em Chamas!', fr: 'En feu!' },
  'kpi.building': { en: 'Building', pt: 'Construindo', fr: 'En construction' },
  'kpi.startStrong': { en: 'Start Strong', pt: 'Comece Forte', fr: 'Commencez fort' },
  'kpi.strong': { en: 'Strong', pt: 'Forte', fr: 'Fort' },
  'kpi.opportunity': { en: 'Opportunity', pt: 'Oportunidade', fr: 'Opportunité' },

  // Motivational Messages
  'motivation.loadingProgress': { en: 'Loading your progress...', pt: 'Carregando seu progresso...', fr: 'Chargement de vos progrès...' },
  'motivation.high.amazingWork': { en: 'Amazing work! You\'ve completed {percentage}% of your goals. You\'re truly thriving! 🎉', pt: 'Trabalho incrível! Você completou {percentage}% dos seus objetivos. Você está realmente prosperando! 🎉', fr: 'Travail incroyable! Vous avez terminé {percentage}% de vos objectifs. Vous prospérez vraiment! 🎉' },
  'motivation.high.consistency': { en: 'Your consistency is inspiring! {days} days shows real commitment to growth.', pt: 'Sua consistência é inspiradora! {days} dias mostra um compromisso real com o crescimento.', fr: 'Votre constance est inspirante! {days} jours montrent un véritable engagement envers la croissance.' },
  'motivation.high.excelling': { en: 'You\'re excelling in {area} - this strength can fuel progress in other areas too!', pt: 'Você está se destacando em {area} - essa força pode impulsionar o progresso em outras áreas também!', fr: 'Vous excellez dans {area} - cette force peut alimenter les progrès dans d\'autres domaines aussi!' },
  'motivation.high.outstanding': { en: 'Outstanding progress! Your dedication is transforming your life, one goal at a time.', pt: 'Progresso excepcional! Sua dedicação está transformando sua vida, um objetivo por vez.', fr: 'Progrès exceptionnel! Votre dévouement transforme votre vie, un objectif à la fois.' },
  'motivation.medium.steadyProgress': { en: 'You\'re making steady progress! {percentage}% completion shows you\'re on the right path.', pt: 'Você está fazendo progresso constante! {percentage}% de conclusão mostra que você está no caminho certo.', fr: 'Vous faites des progrès constants! {percentage}% d\'achèvement montre que vous êtes sur la bonne voie.' },
  'motivation.medium.momentum': { en: 'Great momentum with your {days}-day streak! Small steps lead to big changes.', pt: 'Ótimo impulso com sua sequência de {days} dias! Pequenos passos levam a grandes mudanças.', fr: 'Excellent élan avec votre série de {days} jours! Les petits pas mènent à de grands changements.' },
  'motivation.medium.strength': { en: 'Your strength in {area} is shining through. Keep building on this foundation!', pt: 'Sua força em {area} está brilhando. Continue construindo sobre essa base!', fr: 'Votre force dans {area} brille. Continuez à construire sur cette base!' },
  'motivation.medium.solidProgress': { en: 'Solid progress! You\'re proving that consistency beats perfection every time.', pt: 'Progresso sólido! Você está provando que a consistência vence a perfeição sempre.', fr: 'Progrès solide! Vous prouvez que la constance bat la perfection à chaque fois.' },
  'motivation.low.journey': { en: 'Every journey starts with a single step. You\'re here, and that\'s what matters most.', pt: 'Toda jornada começa com um único passo. Você está aqui, e isso é o que mais importa.', fr: 'Chaque voyage commence par un seul pas. Vous êtes là, et c\'est ce qui compte le plus.' },
  'motivation.low.effort': { en: 'Your {days} days of effort show you have what it takes. Keep going!', pt: 'Seus {days} dias de esforço mostram que você tem o que é preciso. Continue!', fr: 'Vos {days} jours d\'effort montrent que vous avez ce qu\'il faut. Continuez!' },
  'motivation.low.superpower': { en: '{area} is your superpower - let it inspire growth in other areas.', pt: '{area} é seu superpoder - deixe isso inspirar crescimento em outras áreas.', fr: '{area} est votre super-pouvoir - laissez-le inspirer la croissance dans d\'autres domaines.' },
  'motivation.low.linear': { en: 'Progress isn\'t always linear. What matters is that you keep showing up for yourself.', pt: 'O progresso nem sempre é linear. O que importa é que você continue aparecendo para si mesmo.', fr: 'Le progrès n\'est pas toujours linéaire. L\'important est que vous continuiez à vous présenter pour vous-même.' },
  'motivation.low.meaningful': { en: 'You\'re building something meaningful. Trust the process and celebrate small wins.', pt: 'Você está construindo algo significativo. Confie no processo e celebre pequenas vitórias.', fr: 'Vous construisez quelque chose de significatif. Faites confiance au processus et célébrez les petites victoires.' },

  // Self-Discovery Components
  'selfDiscovery.rateLifeAreas': { en: 'Rate Your Life Areas', pt: 'Avalie Suas Áreas da Vida', fr: 'Évaluez vos domaines de vie' },
  'selfDiscovery.rateDescription': { en: 'Use the sliders to rate where you are now and where you want to be', pt: 'Use os controles deslizantes para avaliar onde você está agora e onde quer estar', fr: 'Utilisez les curseurs pour évaluer où vous en êtes maintenant et où vous voulez être' },
  'selfDiscovery.whereIAmNow': { en: 'Where I am now', pt: 'Onde estou agora', fr: 'Où j\'en suis maintenant' },
  'selfDiscovery.whereIWantToBe': { en: 'Where I want to be', pt: 'Onde quero estar', fr: 'Où je veux être' },
  'selfDiscovery.coreValues': { en: 'Your Core Values', pt: 'Seus Valores Fundamentais', fr: 'Vos valeurs fondamentales' },
  'selfDiscovery.selectValues': { en: 'Select 5-7 values that resonate most with you', pt: 'Selecione 5-7 valores que mais ressoam com você', fr: 'Sélectionnez 5-7 valeurs qui résonnent le plus avec vous' },
  'selfDiscovery.selectedCount': { en: 'You have selected {count} out of 7 values', pt: 'Você selecionou {count} de 7 valores', fr: 'Vous avez sélectionné {count} sur 7 valeurs' },
  'selfDiscovery.selectedValues': { en: 'Your Selected Values', pt: 'Seus Valores Selecionados', fr: 'Vos valeurs sélectionnées' },
  'selfDiscovery.chooseFromValues': { en: 'Choose from these values:', pt: 'Escolha entre estes valores:', fr: 'Choisissez parmi ces valeurs:' },
  'selfDiscovery.futureVision': { en: 'Future Vision', pt: 'Visão Futura', fr: 'Vision future' },
  'selfDiscovery.visionDescription': { en: 'Describe your aspirations and goals for the future', pt: 'Descreva suas aspirações e objetivos para o futuro', fr: 'Décrivez vos aspirations et objectifs pour l\'avenir' },
  'selfDiscovery.vision1Year': { en: 'Vision for 1 year', pt: 'Visão para 1 ano', fr: 'Vision pour 1 an' },
  'selfDiscovery.vision3Years': { en: 'Vision for 3 years', pt: 'Visão para 3 anos', fr: 'Vision pour 3 ans' },
  'selfDiscovery.vision1YearPlaceholder': { en: 'Where do you see yourself in one year? What goals will you have achieved? How will your life be different?', pt: 'Onde você se vê em um ano? Que objetivos você terá alcançado? Como sua vida será diferente?', fr: 'Où vous voyez-vous dans un an? Quels objectifs aurez-vous atteints? Comment votre vie sera-t-elle différente?' },
  'selfDiscovery.vision3YearPlaceholder': { en: 'What\'s your bigger picture? Where do you want to be in three years? What major transformations do you envision?', pt: 'Qual é sua visão maior? Onde você quer estar em três anos? Que grandes transformações você imagina?', fr: 'Quelle est votre vision plus large? Où voulez-vous être dans trois ans? Quelles grandes transformations envisagez-vous?' },
  'selfDiscovery.yearFocus': { en: 'Your {year} Focus', pt: 'Seu Foco de {year}', fr: 'Votre objectif {year}' },
  'selfDiscovery.guidingTheme': { en: 'Define your guiding theme for this year', pt: 'Defina seu tema orientador para este ano', fr: 'Définissez votre thème directeur pour cette année' },
  'selfDiscovery.wordOfYear': { en: 'Word of the Year', pt: 'Palavra do Ano', fr: 'Mot de l\'année' },
  'selfDiscovery.phraseOfYear': { en: 'Phrase of the Year', pt: 'Frase do Ano', fr: 'Phrase de l\'année' },
  'selfDiscovery.wordPlaceholder': { en: 'e.g., Growth, Focus, Balance...', pt: 'ex: Crescimento, Foco, Equilíbrio...', fr: 'par exemple, Croissance, Focus, Équilibre...' },
  'selfDiscovery.phrasePlaceholder': { en: 'e.g., Progress over perfection, Embrace the journey...', pt: 'ex: Progresso sobre perfeição, Abrace a jornada...', fr: 'par exemple, Progrès sur la perfection, Embrassez le voyage...' },

  // Reflection Layer
  'reflection.exploreWhy': { en: 'Explore the Why', pt: 'Explore o Porquê', fr: 'Explorez le Pourquoi' },
  'reflection.stepOf': { en: 'Step {step} of 3', pt: 'Etapa {step} de 3', fr: 'Étape {step} sur 3' },
  'reflection.reflectingOn': { en: 'Reflecting on:', pt: 'Refletindo sobre:', fr: 'Réflexion sur:' },
  'reflection.yourThoughts': { en: 'Your thoughts', pt: 'Seus pensamentos', fr: 'Vos pensées' },
  'reflection.whatsDriving': { en: 'What\'s driving this goal?', pt: 'O que está impulsionando este objetivo?', fr: 'Qu\'est-ce qui motive cet objectif?' },
  'reflection.drivingDescription': { en: 'Think about the immediate reason you want to achieve this goal.', pt: 'Pense na razão imediata pela qual você quer alcançar este objetivo.', fr: 'Pensez à la raison immédiate pour laquelle vous voulez atteindre cet objectif.' },
  'reflection.drivingPlaceholder': { en: 'I want to achieve this goal because...', pt: 'Eu quero alcançar este objetivo porque...', fr: 'Je veux atteindre cet objectif parce que...' },
  'reflection.deeperNeed': { en: 'What deeper need does this fulfill?', pt: 'Que necessidade mais profunda isso atende?', fr: 'Quel besoin plus profond cela satisfait-il?' },
  'reflection.deeperDescription': { en: 'Dig deeper - what underlying need or desire is this goal addressing?', pt: 'Vá mais fundo - que necessidade ou desejo subjacente este objetivo está abordando?', fr: 'Creusez plus profond - quel besoin ou désir sous-jacent cet objectif aborde-t-il?' },
  'reflection.deeperPlaceholder': { en: 'This goal helps me fulfill my need for...', pt: 'Este objetivo me ajuda a atender minha necessidade de...', fr: 'Cet objectif m\'aide à satisfaire mon besoin de...' },
  'reflection.connectIdentity': { en: 'How does this connect to who you want to be?', pt: 'Como isso se conecta com quem você quer ser?', fr: 'Comment cela se connecte-t-il à qui vous voulez être?' },
  'reflection.identityDescription': { en: 'Connect this goal to your identity and values. What kind of person will achieving this make you?', pt: 'Conecte este objetivo à sua identidade e valores. Que tipo de pessoa alcançar isso fará de você?', fr: 'Connectez cet objectif à votre identité et vos valeurs. Quel genre de personne vous rendra l\'atteinte de cet objectif?' },
  'reflection.identityPlaceholder': { en: 'Achieving this goal aligns with my vision of becoming someone who...', pt: 'Alcançar este objetivo se alinha com minha visão de me tornar alguém que...', fr: 'Atteindre cet objectif s\'aligne avec ma vision de devenir quelqu\'un qui...' },
  'reflection.completeReflection': { en: 'Complete Reflection', pt: 'Completar Reflexão', fr: 'Compléter la réflexion' },
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