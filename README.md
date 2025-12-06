E-Shop - Application E-Commerce avec DevOps
Une application e-commerce moderne construite avec React, TypeScript, et Shadcn-UI, avec une infrastructure DevOps complète incluant Docker, Kubernetes, et CI/CD.

🚀 Fonctionnalités
Frontend
✅ Catalogue de produits avec filtrage par catégorie
✅ Recherche de produits
✅ Pages détaillées des produits
✅ Panier d’achat avec persistance (localStorage)
✅ Processus de commande complet
✅ Interface d’authentification (UI démo)
✅ Design responsive et moderne
✅ Animations et transitions fluides
DevOps
✅ Containerisation avec Docker
✅ Orchestration Kubernetes
✅ Pipeline CI/CD avec GitHub Actions
✅ Configuration Nginx optimisée
✅ Auto-scaling (HPA)
✅ Health checks et monitoring
✅ Scan de sécurité avec Trivy
🛠️ Stack Technologique
Frontend
Framework: React 18 avec TypeScript
Build Tool: Vite
UI Library: Shadcn-UI
Styling: Tailwind CSS
Routing: React Router v6
State Management: React Context API
Icons: Lucide React
DevOps
Containerisation: Docker avec multi-stage builds
Orchestration: Kubernetes
CI/CD: GitHub Actions
Web Server: Nginx
Security Scanning: Trivy
Package Manager: pnpm
📦 Installation et Démarrage
Prérequis
Node.js 20+
pnpm 8+
Docker (optionnel)
Kubernetes (optionnel)
Installation locale
# Cloner le repository
git clone <repository-url>
cd shadcn-ui

# Installer les dépendances
pnpm install

# Démarrer en mode développement
pnpm run dev

# Build pour production
pnpm run build

# Lancer le linter
pnpm run lint
L’application sera accessible sur http://localhost:5173

🐳 Docker
Build et exécution
# Build l'image Docker
docker build -t eshop-frontend:latest .

# Exécuter le conteneur
docker run -d -p 80:80 --name eshop eshop-frontend:latest

# Avec Docker Compose
docker-compose up -d

# Mode développement
docker-compose --profile dev up
Caractéristiques Docker
Multi-stage build pour optimiser la taille
Image finale basée sur Nginx Alpine (~25MB)
Health checks intégrés
Configuration Nginx optimisée avec compression Gzip
Headers de sécurité configurés
☸️ Kubernetes
Déploiement
# Appliquer toutes les configurations
kubectl apply -f k8s/

# Vérifier le déploiement
kubectl get all

# Voir les logs
kubectl logs -f deployment/eshop-frontend
Ressources Kubernetes incluses
Deployment (k8s/deployment.yaml)

3 replicas par défaut
Resource limits: 256Mi RAM, 200m CPU
Liveness et Readiness probes
HPA (3-10 replicas) basé sur CPU/Memory
Services (k8s/service.yaml)

LoadBalancer pour accès externe
NodePort sur port 30080
Ingress (k8s/ingress.yaml)

Routage HTTP/HTTPS
Support SSL avec cert-manager
Redirection HTTPS automatique
ConfigMap (k8s/configmap.yaml)

Variables d’environnement
Configuration centralisée
Scaling
# Scale manuel
kubectl scale deployment eshop-frontend --replicas=5

# Auto-scaling configuré via HPA
# Min: 3, Max: 10 replicas
# Triggers: CPU 70%, Memory 80%
🔄 CI/CD Pipeline
Le pipeline GitHub Actions (.github/workflows/ci-cd.yml) exécute automatiquement :

Sur chaque Push/PR
Lint & Test

Installation des dépendances
Vérification du code (ESLint)
Build de l’application
Upload des artifacts
Security Scan

Scan de vulnérabilités avec Trivy
Upload vers GitHub Security
Sur Push vers main
Build & Push

Build de l’image Docker
Push vers GitHub Container Registry
Tagging automatique (version, SHA, branch)
Deploy

Déploiement sur Kubernetes
Vérification du rollout
Tests post-déploiement
Configuration requise
Secrets GitHub à configurer :

GITHUB_TOKEN (automatique)
KUBE_CONFIG (base64 encoded kubeconfig)
🔒 Sécurité
Mesures implémentées
Docker

Image Alpine minimale
Multi-stage build
Non-root user
Health checks
Nginx

Headers de sécurité (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
Compression Gzip
Cache optimisé
Kubernetes

Resource limits et requests
Health probes
Auto-scaling
CI/CD

Scan automatique de vulnérabilités
Gestion sécurisée des secrets
Validation avant déploiement
Scan de sécurité
# Scan local avec Trivy
trivy image eshop-frontend:latest

# Scan du code source
trivy fs .
📊 Monitoring
Logs
# Docker
docker logs -f eshop

# Kubernetes
kubectl logs -f deployment/eshop-frontend

# Logs agrégés (avec stern)
stern eshop-frontend
Métriques recommandées
Pour un monitoring complet, intégrer :

Prometheus - Collecte de métriques
Grafana - Visualisation
ELK Stack - Logs centralisés
Jaeger - Tracing distribué
🏗️ Architecture
Structure du projet
shadcn-ui/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants Shadcn-UI
│   │   ├── Header.tsx      # En-tête de navigation
│   │   ├── ProductCard.tsx # Carte produit
│   │   └── CartItem.tsx    # Item du panier
│   ├── context/            # Context API
│   │   └── CartContext.tsx # Gestion du panier
│   ├── data/               # Données mock
│   │   └── products.ts     # Catalogue produits
│   ├── pages/              # Pages de l'application
│   │   ├── Index.tsx       # Page d'accueil
│   │   ├── Products.tsx    # Catalogue
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx        # Panier
│   │   ├── Checkout.tsx    # Commande
│   │   └── Login.tsx       # Authentification
│   ├── App.tsx             # Composant racine
│   └── main.tsx            # Point d'entrée
├── k8s/                    # Configurations Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── configmap.yaml
├── .github/workflows/      # CI/CD
│   └── ci-cd.yml
├── Dockerfile              # Image production
├── Dockerfile.dev          # Image développement
├── docker-compose.yml      # Orchestration Docker
├── nginx.conf              # Configuration Nginx
└── DEVOPS.md              # Guide DevOps détaillé
Architecture Microservices (Future)
Cette version est une démonstration frontend. Pour une architecture microservices complète :









🧪 Tests
# Linter
pnpm run lint

# Build test
pnpm run build

# Tests unitaires (à implémenter)
pnpm run test

# Tests E2E (à implémenter)
pnpm run test:e2e
 
### Exécution locale (Docker Compose)
Pour démarrer rapidement tous les services (MySQL, backend, order-service, frontend):
```powershell
# Depuis la racine du projet
docker-compose down
docker-compose up --build
```

Services exposés (hôte → conteneur): MySQL `3306`, phpMyAdmin `8081`, backend `5000`, order-service `5001`, frontend `80`.

### Vérifier que MySQL a appliqué l'init SQL
Exécutez ces commandes pour vérifier que la base `eshop` et les tables ont bien été créées (utiliser `es hop-mysql` comme nom de conteneur si vous avez gardé la configuration par défaut):
```powershell
# Lister les tables
docker exec -it eshop-mysql mysql -uroot -proot -e "USE eshop; SHOW TABLES;"

# Vérifier les données d'exemple
docker exec -it eshop-mysql mysql -uroot -proot -e "USE eshop; SELECT COUNT(*) AS product_count FROM products; SELECT COUNT(*) AS order_count FROM orders;"
```

Remarque: la source de vérité pour l'initialisation de la base est `mysql-init/init.sql` dans le dépôt.
📝 Scripts disponibles
Commande	Description
pnpm run dev	Démarre le serveur de développement
pnpm run build	Build pour production
pnpm run preview	Prévisualise le build de production
pnpm run lint	Vérifie le code avec ESLint
🚀 Déploiement
Environnements
Développement - Local avec Vite
Staging - Docker Compose
Production - Kubernetes avec auto-scaling
Processus de déploiement
Commit et push vers develop ou main
GitHub Actions exécute le pipeline
Tests et scans de sécurité
Build et push de l’image Docker
Déploiement automatique sur Kubernetes
Vérification du rollout
Rollback
# Kubernetes
kubectl rollout undo deployment/eshop-frontend

# Docker
docker-compose down
docker-compose up -d --build
🔧 Configuration
Variables d’environnement
Créer un fichier .env :

VITE_API_URL=https://api.example.com
VITE_APP_NAME=E-Shop
VITE_APP_VERSION=1.0.0
Personnalisation
Couleurs: Modifier tailwind.config.ts
Composants: Personnaliser dans src/components/ui/
Produits: Éditer src/data/products.ts
Routes: Ajouter dans src/App.tsx
📚 Documentation
Guide DevOps complet
Docker Documentation
Kubernetes Documentation
Shadcn-UI Documentation
React Documentation
🤝 Contribution
Fork le projet
Créer une branche (git checkout -b feature/AmazingFeature)
Commit les changements (git commit -m 'Add AmazingFeature')
Push vers la branche (git push origin feature/AmazingFeature)
Ouvrir une Pull Request
📄 Licence
Ce projet est une démonstration à des fins éducatives.

👥 Auteurs
Développé par l’équipe MGX DevOps

🆘 Support
Pour toute question ou problème :

Créer une issue sur GitHub
Consulter le Guide DevOps
Vérifier les logs avec kubectl logs ou docker logs
🎯 Roadmap
[ ] Tests unitaires et E2E
[ ] Backend microservices (Node.js/Go)
[ ] Authentification réelle (OAuth2/JWT)
[ ] Intégration paiement (Stripe)
[ ] Base de données (PostgreSQL)
[ ] Cache Redis
[ ] Message Queue (RabbitMQ)
[ ] Monitoring (Prometheus/Grafana)
[ ] Logs centralisés (ELK)
[ ] Terraform pour IaC
[ ] Ansible pour configuration
[ ] Service Mesh (Istio)
⚡ Performance
Build optimisé avec Vite
Code splitting automatique
Lazy loading des routes
Images optimisées
Compression Gzip
Cache browser configuré
CDN ready
🌐 Navigateurs supportés
Chrome (dernières 2 versions)
Firefox (dernières 2 versions)
Safari (dernières 2 versions)
Edge (dernières 2 versions)
Note: Cette application est une démonstration frontend. Pour une utilisation en production, implémenter un backend sécurisé avec authentification, base de données, et traitement des paiements réel.