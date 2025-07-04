# 🛠️ Guide Développeur - Local AI Chat Assistant

Documentation technique pour les développeurs souhaitant contribuer ou comprendre l'architecture de l'application.

## 🏗️ Architecture

### Structure du Projet

```
src/
├── components/          # Composants React réutilisables
│   ├── ui/             # Composants UI de base (shadcn/ui)
│   ├── ChatInterface.tsx
│   ├── SessionSidebar.tsx
│   ├── ModelSelector.tsx
│   ├── WelcomeGuide.tsx
│   └── ...
├── hooks/              # Hooks React personnalisés
│   ├── useChat.ts      # Logique principale du chat
│   ├── useDarkMode.ts  # Gestion du mode sombre
│   └── ...
├── services/           # Services et API
│   └── chatService.ts  # Communication avec Ollama
├── types/              # Définitions TypeScript
│   ├── chat.ts
│   └── user.ts
└── pages/              # Pages de l'application
    ├── Index.tsx       # Page principale
    └── ...
```

### Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **État**: React Hooks (useState, useEffect, useCallback)
- **IA**: Ollama API (local)
- **Build**: Vite
- **Linting**: ESLint + Prettier

## 🔧 Configuration de Développement

### Prérequis

```bash
# Node.js 16+
node --version

# npm ou yarn
npm --version
```

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd local-llama-whisper-chat

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualise le build de production
npm run lint         # Vérifie le code avec ESLint
npm run type-check   # Vérifie les types TypeScript
```

## 🧩 Composants Principaux

### useChat Hook

Le hook principal qui gère toute la logique du chat :

```typescript
const {
  sessions,           // Toutes les sessions
  currentSession,     // Session actuelle
  availableModels,    // Modèles disponibles
  selectedModel,      // Modèle sélectionné
  isLoading,          // État de chargement
  isTyping,          // IA en train de répondre
  loadModels,         // Charger les modèles
  createSession,      // Créer une session
  switchSession,      // Changer de session
  deleteSession,      // Supprimer une session
  sendMessage,        // Envoyer un message
  selectModel,        // Sélectionner un modèle
} = useChat();
```

### ChatInterface

Composant principal qui affiche l'interface de chat :

```typescript
interface ChatInterfaceProps {
  currentSessionId?: string;
  onSelectModel?: (modelName: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}
```

### SessionSidebar

Sidebar pour gérer les sessions :

```typescript
interface SessionSidebarProps {
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}
```

## 🔄 Gestion d'État

### État Local vs Global

- **État Local** : Géré par `useState` dans les composants
- **État Global** : Géré par le hook `useChat` et localStorage

### Persistance des Données

```typescript
// Sauvegarde automatique dans localStorage
localStorage.setItem('sessions', JSON.stringify(sessions));
localStorage.setItem('currentSessionId', currentSessionId);
localStorage.setItem('selectedModel', selectedModel);
```

### Synchronisation

L'application utilise plusieurs stratégies pour synchroniser l'état :

1. **Props Drilling** : Passage des props entre composants
2. **useEffect** : Synchronisation avec localStorage
3. **useCallback** : Optimisation des re-renders
4. **forceUpdate** : Forçage de mise à jour quand nécessaire

## 🌐 Communication avec Ollama

### chatService.ts

Service qui gère la communication avec l'API Ollama :

```typescript
export const chatService = {
  // Charger les modèles disponibles
  async getModels(): Promise<string[]>
  
  // Envoyer un message
  async sendMessage(content: string, model: string): Promise<string>
}
```

### Endpoints Ollama

- `GET /api/tags` - Liste des modèles
- `POST /api/generate` - Génération de réponse

## 🎨 Système de Design

### Tailwind CSS

L'application utilise Tailwind CSS pour le styling :

```typescript
// Classes utilitaires
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### shadcn/ui

Composants UI réutilisables :

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

### Mode Sombre

Gestion automatique du mode sombre :

```typescript
// Hook personnalisé
const { isDarkMode, toggleDarkMode } = useDarkMode();

// Classes conditionnelles
className={`${isDarkMode ? 'dark' : ''}`}
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablette */
md: 768px   /* Desktop */
lg: 1024px  /* Large Desktop */
xl: 1280px  /* Extra Large */
```

### Sidebar Mobile

```typescript
// État de la sidebar
const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

// Gestion responsive
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) setShowSidebar(false);
    else setShowSidebar(true);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## 🧪 Tests

### Tests Unitaires

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch
```

### Tests d'Intégration

```bash
# Tests avec Playwright
npm run test:e2e
```

## 🚀 Build et Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

### Variables d'Environnement

```env
# .env.local
VITE_OLLAMA_URL=http://localhost:11434
VITE_APP_TITLE=Local AI Chat
```

## 🔍 Debugging

### Console Logs

L'application inclut des logs de debug :

```typescript
console.log('ChatInterface render:', {
  currentSessionId,
  localCurrentSessionId: localCurrentSession?.id,
  messagesCount: localCurrentSession?.messages?.length,
  forceUpdate
});
```

### React DevTools

Utilisez React DevTools pour inspecter :
- L'état des composants
- Les props passées
- La hiérarchie des composants

### Network Tab

Vérifiez les requêtes vers Ollama dans l'onglet Network des DevTools.

## 🐛 Problèmes Courants

### Ollama ne répond pas

```bash
# Vérifier qu'Ollama est démarré
curl http://localhost:11434/api/tags

# Redémarrer Ollama
ollama serve
```

### Problèmes de Performance

1. **Re-renders excessifs** : Utilisez `useCallback` et `useMemo`
2. **Mémoire** : Fermez les sessions inutilisées
3. **Modèles trop gros** : Utilisez des modèles plus petits

### Erreurs TypeScript

```bash
# Vérifier les types
npm run type-check

# Auto-fix
npm run lint -- --fix
```

## 📚 Ressources

### Documentation Officielle

- [React](https://reactjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Ollama](https://ollama.ai/docs)

### Outils de Développement

- [Vite](https://vitejs.dev)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

## 🤝 Contribution

### Workflow Git

1. Fork le projet
2. Créez une branche : `git checkout -b feature/nouvelle-fonctionnalite`
3. Committez : `git commit -am 'Ajout nouvelle fonctionnalité'`
4. Push : `git push origin feature/nouvelle-fonctionnalite`
5. Créez une Pull Request

### Standards de Code

- **TypeScript** : Utilisez des types stricts
- **ESLint** : Respectez les règles de linting
- **Prettier** : Formatage automatique
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités

### Structure des Commits

```
feat: ajouter nouvelle fonctionnalité
fix: corriger bug de session
docs: mettre à jour la documentation
style: améliorer le style
refactor: refactoriser le code
test: ajouter des tests
```

---

**Bon développement ! 🚀** 