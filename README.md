# Frontend Gestion Entreprise

Interface utilisateur React pour le système de gestion de paie d'entreprise.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+
- Backend en cours d'exécution sur `http://localhost:5000`

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🔐 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Super Admin | superadmin@example.com | superadmin123 |
| Admin | admin@techcorp.sn | admin123 |

## 📊 Fonctionnalités

### Dashboard
- **Statistiques en temps réel** : employés, cycles, bulletins, montants
- **Graphiques dynamiques** :
  - Répartition des employés (actifs/inactifs)
  - État des cycles de paie
  - Statut des paiements
  - Évolution mensuelle
- **Alertes intelligentes** : paiements en attente, cycles actifs

### Gestion des employés
- Liste des employés avec filtres
- Détails complets par employé
- Historique des contrats
- Activation/désactivation des employés

### Cycles de paie
- Création et gestion des cycles
- Génération automatique des bulletins
- Suivi des statuts (Brouillon → Approuvé → Clôturé)

### Bulletins de salaire
- Consultation des bulletins par employé
- Suivi des paiements
- Génération de documents

## 🛠️ Technologies utilisées

- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **React Router** - Routing
- **Axios** - Requêtes HTTP
- **Recharts** - Graphiques
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des données
- **Lucide React** - Icônes

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Auth/           # Composants d'authentification
│   └── Layout/         # Layout et navigation
├── contexts/           # Contextes React (Auth)
├── pages/              # Pages principales
├── services/           # Services API
└── types/              # Types TypeScript
```

## 🔗 Connexion au backend

L'application se connecte automatiquement au backend sur `http://localhost:5000`.

### Endpoints utilisés :
- `POST /api/auth/login` - Connexion
- `GET /api/employes` - Liste des employés
- `GET /api/cycles` - Cycles de paie
- `GET /api/dashboard/stats` - Statistiques

## 🎨 Personnalisation

### Thème
Le thème est configuré dans `tailwind.config.js` avec des couleurs primaires et secondaires.

### Styles personnalisés
Ajoutez vos styles dans `src/index.css` dans la section `@layer components`.

## 🚀 Déploiement

```bash
# Build pour la production
npm run build

# Les fichiers sont générés dans le dossier `build/`
```

## 📝 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm run build` - Build pour la production
- `npm test` - Lance les tests
- `npm run eject` - Éjection de Create React App

## 🐛 Dépannage

### Erreur de connexion au backend
- Vérifiez que le backend tourne sur le port 5000
- Vérifiez les CORS dans la configuration backend

### Problèmes d'authentification
- Vérifiez le token JWT dans le localStorage
- Essayez de vous reconnecter

### Graphiques ne s'affichent pas
- Vérifiez que les données sont correctement récupérées depuis l'API
- Vérifiez la console pour les erreurs JavaScript
