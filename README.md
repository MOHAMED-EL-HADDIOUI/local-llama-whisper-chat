# 🤖 Local AI Chat Assistant

Une application de chat IA moderne qui fonctionne entièrement en local avec Ollama. Aucune connexion internet requise, confidentialité totale et contrôle complet de vos données.

## ✨ Fonctionnalités

- 🚀 **Chat IA Local** - Utilise des modèles IA qui tournent sur votre ordinateur
- 🔒 **Confidentialité Totale** - Vos données restent sur votre appareil
- 💬 **Conversations Multiples** - Créez et gérez plusieurs sessions de chat
- 🎯 **Sélection de Modèles** - Choisissez parmi différents modèles IA
- 💾 **Sauvegarde Automatique** - Toutes vos conversations sont sauvegardées automatiquement
- 📱 **Interface Responsive** - Fonctionne sur desktop, tablette et mobile
- 🌙 **Mode Sombre** - Interface adaptée à vos préférences
- 📤 **Export/Import** - Sauvegardez et restaurez vos conversations

## 🚀 Installation Rapide

### Option 1: Installation Locale

#### Prérequis

- **Node.js** (version 16 ou supérieure)
- **Ollama** - [Télécharger sur ollama.ai](https://ollama.ai)

#### Installation de l'Application

```bash
# Cloner le projet
git clone <repository-url>
cd local-llama-whisper-chat

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
```

#### Configuration d'Ollama

```bash
# Installer Ollama (si pas déjà fait)
# Voir: https://ollama.ai/download

# Démarrer Ollama
ollama serve

# Télécharger un modèle (dans un autre terminal)
ollama pull llama2
```

#### Accéder à l'Application

Ouvrez votre navigateur et allez sur `http://localhost:8081`

### Option 2: Installation avec Docker 🐳

#### Prérequis Docker

- **Docker** - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - Inclus avec Docker Desktop

#### Démarrage Rapide avec Docker

```bash
# Cloner le projet
git clone <repository-url>
cd local-llama-whisper-chat

# Démarrer l'application et Ollama avec Docker Compose
docker-compose up -d

# Télécharger un modèle dans le conteneur Ollama
docker exec -it local-llama-whisper-chat-ollama-1 ollama pull llama2
```

#### Accéder à l'Application Docker

- **Application Web** : `http://localhost:8081`
- **API Ollama** : `http://localhost:11434`

#### Gestion des Conteneurs

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Arrêter les services
docker-compose down

# Redémarrer les services
docker-compose restart

# Supprimer les conteneurs et volumes
docker-compose down -v
```

#### Configuration Docker Avancée

Le fichier `docker-compose.yml` configure :
- **Port 8081** : Application web React
- **Port 11434** : API Ollama
- **Volumes persistants** : Modèles et données Ollama
- **Réseau interne** : Communication entre services

#### Téléchargement de Modèles

```bash
# Lister les modèles disponibles
docker exec -it local-llama-whisper-chat-ollama-1 ollama list

# Télécharger différents modèles
docker exec -it local-llama-whisper-chat-ollama-1 ollama pull llama2
docker exec -it local-llama-whisper-chat-ollama-1 ollama pull codellama
docker exec -it local-llama-whisper-chat-ollama-1 ollama pull mistral

# Vérifier l'espace disque utilisé
docker exec -it local-llama-whisper-chat-ollama-1 du -sh /root/.ollama
```

#### Avantages de Docker

✅ **Installation simplifiée** - Pas besoin d'installer Node.js ou Ollama localement  
✅ **Environnement isolé** - Pas de conflits avec d'autres applications  
✅ **Déploiement cohérent** - Même environnement sur tous les systèmes  
✅ **Gestion facile** - Start/stop avec une seule commande  
✅ **Portabilité** - Fonctionne sur Windows, macOS, Linux  
✅ **Sauvegarde simple** - Volumes Docker pour persistance des données

## 📖 Guide d'Utilisation

### Première Utilisation

1. **Lancez l'application** - Un guide d'accueil s'affichera automatiquement
2. **Sélectionnez un modèle** - Choisissez parmi les modèles disponibles
3. **Commencez à chatter** - Tapez votre premier message !

### Interface Principale

#### 🎯 Sélecteur de Modèle
- Situé en haut de l'interface
- Choisissez le modèle IA que vous souhaitez utiliser
- Changez de modèle à tout moment

#### 💬 Zone de Chat
- Affiche vos conversations
- Messages utilisateur et IA clairement différenciés
- Indicateur de frappe en temps réel
- Défilement automatique vers les nouveaux messages

#### 📋 Sidebar des Sessions
- Liste toutes vos conversations
- Créez de nouvelles sessions avec le bouton "+"
- Cliquez sur une session pour la charger
- Supprimez les sessions inutiles

### Fonctionnalités Avancées

#### 🔄 Changement de Session
- Cliquez sur une session dans la sidebar
- L'interface se met à jour automatiquement
- Tous les messages de la session s'affichent

#### 🎨 Mode Sombre
- Basculez entre mode clair et sombre
- Préférence sauvegardée automatiquement
- Interface adaptée à vos yeux

#### 💾 Sauvegarde des Données
- Toutes les conversations sont sauvegardées localement
- Pas de perte de données lors du rechargement
- Données stockées dans le navigateur

## 🛠️ Modèles Supportés

L'application fonctionne avec tous les modèles Ollama. Voici quelques suggestions :

### Modèles Recommandés

```bash
# Modèle général (recommandé pour débuter)
ollama pull llama2

# Modèle plus récent et performant
ollama pull llama2:13b

# Modèle spécialisé code
ollama pull codellama

# Modèle français
ollama pull mistral
```

### Ajouter un Nouveau Modèle

1. Ouvrez un terminal
2. Exécutez : `ollama pull nom-du-modèle`
3. Rechargez l'application
4. Le nouveau modèle apparaîtra dans la liste

## 🔧 Dépannage

### Ollama ne répond pas
```bash
# Vérifiez qu'Ollama est démarré
ollama serve

# Testez avec un modèle
ollama run llama2 "Hello"
```

### Aucun modèle disponible
1. Vérifiez qu'Ollama est en cours d'exécution
2. Téléchargez au moins un modèle : `ollama pull llama2`
3. Rechargez l'application

### L'application ne démarre pas
```bash
# Vérifiez Node.js
node --version

# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de performance
- Utilisez des modèles plus petits pour de meilleures performances
- Fermez les autres applications gourmandes en ressources
- Vérifiez que vous avez assez de RAM (8GB minimum recommandé)

### Problèmes Docker

#### Docker ne démarre pas
```bash
# Vérifiez que Docker Desktop est démarré
docker --version

# Redémarrez Docker Desktop si nécessaire
# Windows/macOS : Redémarrez l'application Docker Desktop
# Linux : sudo systemctl restart docker
```

#### Ports déjà utilisés
```bash
# Vérifiez les ports utilisés
netstat -an | grep 8081
netstat -an | grep 11434

# Arrêtez les services qui utilisent ces ports
# Ou modifiez les ports dans docker-compose.yml
```

#### Problèmes de permissions (Linux)
```bash
# Ajoutez votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrez votre session ou exécutez
newgrp docker
```

#### Conteneur Ollama ne répond pas
```bash
# Vérifiez les logs du conteneur
docker-compose logs ollama

# Redémarrez le conteneur Ollama
docker-compose restart ollama

# Vérifiez l'espace disque disponible
docker system df
```

#### Problèmes de mémoire
```bash
# Vérifiez l'utilisation mémoire
docker stats

# Augmentez la mémoire allouée à Docker Desktop
# Windows/macOS : Settings > Resources > Memory
# Linux : Modifiez /etc/docker/daemon.json
```

## 📱 Utilisation Mobile

L'application est entièrement responsive :
- **Sidebar rétractable** sur mobile
- **Interface adaptée** aux écrans tactiles
- **Navigation intuitive** avec boutons de menu

## 🔒 Sécurité et Confidentialité

- ✅ **Aucune donnée envoyée** sur internet
- ✅ **Modèles locaux** sur votre machine
- ✅ **Sauvegarde locale** dans le navigateur
- ✅ **Aucun tracking** ou analytics
- ✅ **Code open source** vérifiable

## 🎯 Conseils d'Utilisation

### Organisation des Conversations
- Créez des sessions séparées pour différents sujets
- Utilisez des titres descriptifs pour vos conversations
- Supprimez régulièrement les sessions inutiles

### Optimisation des Performances
- Utilisez des modèles adaptés à vos besoins
- Fermez les sessions non utilisées
- Nettoyez le cache du navigateur si nécessaire

### Sauvegarde
- Exportez régulièrement vos conversations importantes
- Gardez des sauvegardes de vos sessions favorites
- Utilisez la fonction d'import pour restaurer des conversations

## 🤝 Contribution

Ce projet est open source ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Contribuer au code
- Améliorer la documentation

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

- [Ollama](https://ollama.ai) - Pour l'infrastructure IA locale
- [React](https://reactjs.org) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Shadcn/ui](https://ui.shadcn.com) - Composants UI

---

**Profitez de votre assistant IA personnel et privé ! 🚀**
