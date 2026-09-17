# QualiSafe — Plateforme de Management de la Qualité & QHSE (Cycle PDCA & ISO 9001)

Application web de gestion globale du Système de Management de la Qualité (SMQ), de la Sécurité et de l'Environnement (QHSE), conforme aux normes **ISO 9001:2015**, **ISO 14001:2015** et **ISO 45001:2018**.

L'architecture est structurée autour des **6 Piliers Normatifs** du cycle d'amélioration continue de Deming (PDCA) :

---

## 🏛️ 1. Contexte & Stratégie (L'ancrage du système)
- **Cartographie des Processus** : Visualisation macro des flux (Management, Réalisation, Support) et fiches processus d'identité interactives (entrées, sorties, KPIs, risques, ressources).
- **Politique & Vision de la Direction** (ISO 9001 §5.2) : Déclaration d'engagement de la Direction Générale et déclinaison des axes stratégiques en objectifs mesurables.
- **Gestion des Risques & Opportunités (AMDEC)** : Registre des risques, matrice d'évaluation 5×5 et analyse FMEA complète avec calcul automatique de criticité (IPR / RPN = G × O × D).

## 📝 2. Planifier (PLAN) (L'organisation en amont)
- **Gestion Documentaire (GED)** : Création, générateur de documents assisté par IA, cycle d'approbation à 5 étapes (Brouillon → Vérification → Approbation → Diffusion → Archivage).
- **Ressources & Compétences** (ISO 9001 §7.2) : Matrice de polyvalence croisée (niveaux 1 à 4), fiches de poste formalisées et suivi des compétences critiques à risque.
- **Formations & Habilitations** : Plan prévisionnel de formation, recyclages réglementaires (CACES, SST, habilitation électrique).
- **Exigences & Conformité Réglementaire** : Veille légale permanente (Code du travail, ICPE, REACH/RoHS, exigences clients grands comptes) avec évaluations périodiques.

## ⚙️ 3. Réaliser & Mesurer (DO) (Le quotidien opérationnel)
- **Plans de Contrôle Qualité** : Contrôle réception matières premières, contrôles en cours de fabrication (usinage/soudage/montage) et contrôle final avant libération.
- **Saisie de PV de Contrôle** : Formulaire interactif avec verdict automatique (Conforme, Sous dérogation, Rejeté avec déclenchement automatique d'alerte NC).
- **Évaluation Fournisseurs** : Qualification, panel de prestataires agréés, notation multi-critères et suivi des audits fournisseurs.
- **Satisfaction Client & Réclamations** : Traitement des anomalies clients, analyses causales 8D, enquêtes de satisfaction, VoC et NPS.

## 🔍 4. Contrôler (CHECK) (La détection des écarts)
- **Non-Conformités** : Enregistrement et traitement des écarts internes, fournisseurs et clients, analyses 5M / 5 Pourquoi.
- **Audits Internes & Externes** : Programme annuel, préparation des grilles d'audit, rapports officiels et suivi des constats.
- **Indicateurs & Tableaux de bord** : Pilotage en temps réel des performances (taux de conformité, délai moyen de résolution, OEE/TRS).

## 🚀 5. Améliorer (ACT) (La boucle d'amélioration continue)
- **Plans d'Actions (CAPA)** : Centralisation des actions correctives et préventives issues des NC, audits, réclamations et AMDEC.
- **Revues de Direction ISO 9001 (§9.3)** : Revue guidée des 10 critères d'entrée normés, relevé formel des décisions stratégiques de la direction, allocation budgétaire et compte-rendu officiel imprimable.

## 🛠️ 6. Configuration & Administration
- **Gestion des Utilisateurs & Droits (RBAC)** : Annuaire utilisateurs, profils (Administrateur, Responsable Qualité, Pilote de Processus, Auditeur, Opérateur) et matrice des droits granulaires.
- **Workflows & Paramétrage** : Circuits de validation personnalisables avec SLA et circuits de notifications configurables.

---

## 💻 Démarrage Rapide

### Prérequis
- Node.js 18+ ou 20+
- npm, pnpm ou yarn

### Installation & Lancement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Compiler pour la production
npm run build
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🛠️ Stack Technique
- **Framework** : Next.js 16 (App Router & Turbopack)
- **Langage** : TypeScript
- **Style** : Tailwind CSS & Radix UI primitives
- **Visualisations & Graphiques** : Recharts
- **Iconographie** : Lucide React
- **Export & Données** : Export CSV & génération PDF
