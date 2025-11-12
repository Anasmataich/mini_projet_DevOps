Guide DevOps - E-Shop
Ce document décrit l’infrastructure DevOps et les procédures de déploiement pour l’application E-Shop.
Table des matières
Architecture
Docker
Kubernetes
CI/CD avec GitHub Actions
Sécurité
Monitoring et Logs
Architecture
L’application E-Shop est une application web moderne construite avec :

Frontend: React + TypeScript + Vite
UI Framework: Shadcn-UI + Tailwind CSS
Containerisation: Docker
Orchestration: Kubernetes
CI/CD: GitHub Actions
Architecture Microservices (Démo Frontend)
Cette version est une démonstration frontend. Pour une architecture microservices complète, vous auriez besoin de :

Service d’authentification
Service de catalogue produits
Service de panier
Service de paiement
Service de commandes
API Gateway
Base de données (PostgreSQL/MongoDB)
Cache (Redis)
Message Queue (RabbitMQ/Kafka)
Docker
Construction de l’image
# Build l'image Docker
docker build -t eshop-frontend:latest .

# Build avec tag spécifique
docker build -t eshop-frontend:v1.0.0 .
Exécution en local
# Démarrer le conteneur
docker run -d -p 80:80 --name eshop eshop-frontend:latest

# Voir les logs
docker logs -f eshop

# Arrêter le conteneur
docker stop eshop
Docker Compose
# Démarrer tous les services
docker-compose up -d

# Démarrer en mode développement
docker-compose --profile dev up

# Arrêter tous les services
docker-compose down

# Rebuild et redémarrer
docker-compose up -d --build
Multi-stage Build
Le Dockerfile utilise un build multi-stage pour optimiser la taille de l’image :

Stage Builder: Compile l’application avec Node.js
Stage Production: Sert les fichiers statiques avec Nginx
Avantages :

Image finale légère (~25MB vs ~1GB)
Temps de déploiement réduit
Surface d’attaque minimale
Kubernetes
Prérequis
# Installer kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Vérifier l'installation
kubectl version --client
Déploiement
# Créer le namespace (optionnel)
kubectl create namespace eshop

# Appliquer les configurations
kubectl apply -f k8s/

# Vérifier le déploiement
kubectl get deployments -n eshop
kubectl get pods -n eshop
kubectl get services -n eshop

# Voir les logs d'un pod
kubectl logs -f <pod-name> -n eshop
Configuration des ressources
Le déploiement Kubernetes inclut :

Deployment (k8s/deployment.yaml)

3 replicas par défaut
Health checks (liveness & readiness probes)
Resource limits et requests
Auto-scaling (HPA)
Service (k8s/service.yaml)

LoadBalancer pour l’accès externe
NodePort comme alternative
Ingress (k8s/ingress.yaml)

Routage HTTP/HTTPS
Certificats SSL avec cert-manager
Redirection HTTPS
ConfigMap (k8s/configmap.yaml)

Variables d’environnement
Configuration de l’application
Scaling
# Scale manuellement
kubectl scale deployment eshop-frontend --replicas=5 -n eshop

# Auto-scaling est configuré via HPA
# Min: 3 replicas, Max: 10 replicas
# Basé sur CPU (70%) et Memory (80%)
Mise à jour Rolling
# Mettre à jour l'image
kubectl set image deployment/eshop-frontend frontend=eshop-frontend:v2.0.0 -n eshop

# Vérifier le rollout
kubectl rollout status deployment/eshop-frontend -n eshop

# Rollback si nécessaire
kubectl rollout undo deployment/eshop-frontend -n eshop
CI/CD avec GitHub Actions
Pipeline automatisé
Le fichier .github/workflows/ci-cd.yml définit un pipeline complet :

1. Lint and Test
Checkout du code
Installation des dépendances avec pnpm
Exécution du linter
Build de l’application
Upload des artifacts
2. Security Scan
Scan de vulnérabilités avec Trivy
Upload des résultats vers GitHub Security
3. Build and Push
Build de l’image Docker
Push vers GitHub Container Registry
Tagging automatique (branch, version, SHA)
4. Deploy
Déploiement sur Kubernetes
Vérification du rollout
Configuration requise
Secrets GitHub à configurer :

GITHUB_TOKEN (automatique)
KUBE_CONFIG (base64 encoded kubeconfig)
Déclenchement
Le pipeline se déclenche sur :

Push sur main ou develop
Pull Request vers main ou develop
Sécurité
Bonnes pratiques implémentées
Image Docker

Base image Alpine (minimale)
Multi-stage build
Non-root user
Health checks
Nginx

Headers de sécurité (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
Gzip compression
Cache approprié
Kubernetes

Resource limits
Security context
Network policies (à implémenter)
RBAC (à configurer)
CI/CD

Scan de vulnérabilités
Secrets management
Image signing (recommandé)
Scan de sécurité
# Scan local avec Trivy
trivy image eshop-frontend:latest

# Scan du filesystem
trivy fs .
Monitoring et Logs
Logs
# Logs Docker
docker logs -f eshop

# Logs Kubernetes
kubectl logs -f deployment/eshop-frontend -n eshop

# Logs agrégés (avec stern)
stern eshop-frontend -n eshop
Monitoring (à implémenter)
Pour un monitoring complet, intégrer :

Prometheus - Métriques
Grafana - Visualisation
ELK Stack - Logs centralisés
Jaeger - Tracing distribué
Exemple de métriques à monitorer :

CPU et mémoire des pods
Temps de réponse HTTP
Taux d’erreur
Nombre de requêtes
Disponibilité du service
Terraform (Configuration future)
Pour l’infrastructure as code, créer :

# main.tf
provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "eshop" {
  metadata {
    name = "eshop"
  }
}

# Définir les ressources Kubernetes via Terraform
Ansible (Configuration future)
Pour l’automatisation de la configuration :

# playbook.yml
- hosts: kubernetes
  tasks:
    - name: Deploy E-Shop
      kubernetes:
        state: present
        definition: "{{ lookup('file', 'k8s/deployment.yaml') }}"
Jenkins (Alternative CI/CD)
Pipeline Jenkinsfile exemple :

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'pnpm install'
                sh 'pnpm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'pnpm run lint'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t eshop-frontend:${BUILD_NUMBER} .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
Commandes utiles
# Docker
docker ps                                    # Liste des conteneurs
docker images                                # Liste des images
docker system prune -a                       # Nettoyer Docker

# Kubernetes
kubectl get all -n eshop                     # Toutes les ressources
kubectl describe pod <pod-name> -n eshop     # Détails d'un pod
kubectl exec -it <pod-name> -n eshop -- sh   # Shell dans un pod
kubectl port-forward svc/eshop-frontend-service 8080:80 -n eshop  # Port forwarding

# Git
git tag v1.0.0                               # Créer un tag
git push origin v1.0.0                       # Push le tag
Troubleshooting
Le pod ne démarre pas
kubectl describe pod <pod-name> -n eshop
kubectl logs <pod-name> -n eshop
L’image ne se pull pas
# Vérifier les secrets d'image
kubectl get secrets -n eshop
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token>
Service inaccessible
# Vérifier le service
kubectl get svc -n eshop
kubectl describe svc eshop-frontend-service -n eshop

# Tester depuis un pod
kubectl run -it --rm debug --image=alpine --restart=Never -- sh
wget -O- http://eshop-frontend-service
Ressources
Docker Documentation
Kubernetes Documentation
GitHub Actions Documentation
Nginx Documentation
Trivy Documentation
Support
Pour toute question ou problème, créer une issue sur le repository GitHub.