import type { GuideStandard, GuideChapter } from "./types"

export const standards: GuideStandard[] = [
  {
    id: "iso9001",
    name: "ISO 9001:2015",
    shortName: "ISO 9001",
    domain: "Qualité",
    color: "#3b82f6",
    iconName: "ShieldCheck",
  },
  {
    id: "iso14001",
    name: "ISO 14001:2015",
    shortName: "ISO 14001",
    domain: "Environnement",
    color: "#10b981",
    iconName: "Leaf",
  },
  {
    id: "iso45001",
    name: "ISO 45001:2018",
    shortName: "ISO 45001",
    domain: "Santé & Sécurité",
    color: "#ef4444",
    iconName: "HardHat",
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001:2022",
    shortName: "ISO 27001",
    domain: "Sécurité info.",
    color: "#6366f1",
    iconName: "ShieldAlert",
  },
  {
    id: "iso37001",
    name: "ISO 37001:2016",
    shortName: "ISO 37001",
    domain: "Anti-corruption",
    color: "#f59e0b",
    iconName: "Scale",
  },
  {
    id: "fssc22000",
    name: "FSSC 22000 v6",
    shortName: "FSSC 22000",
    domain: "Séc. alimentaire",
    color: "#14b8a6",
    iconName: "UtensilsCrossed",
  },
]

export const chapters: GuideChapter[] = [
  {
    id: "ch1",
    number: 1,
    pdca: "INTRO",
    title: "Domaine d'application",
    purpose:
      "Définir le périmètre d'application de la norme — quels processus, sites, activités et entités sont couverts par le système de management.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "Démontrer l'aptitude à fournir des produits/services conformes aux exigences clients et légales",
          "Viser l'augmentation de la satisfaction client par application efficace du SMQ",
          "Tout type d'organisme peut se certifier, quel que soit son secteur ou sa taille",
          "Le domaine d'application doit être disponible comme information documentée",
        ],
        links: [],
      },
      {
        standardId: "iso14001",
        requirements: [
          "Tout organisme (entreprise, administration, association) peut se certifier",
          "Le SME couvre les aspects environnementaux des activités, produits et services",
          "L'organisme peut choisir un périmètre partiel (site, division, activité)",
          "La norme ne fixe pas de niveau de performance environnementale absolu",
        ],
        links: [],
      },
      {
        standardId: "iso45001",
        requirements: [
          "Améliorer la performance SST et prévenir accidents du travail et maladies professionnelles",
          "Couvre les dangers liés aux activités de l'organisme sur le lieu de travail",
          "S'applique à tout organisme, quelle que soit sa taille ou son secteur",
          "Nécessite la consultation et la participation active des travailleurs",
        ],
        links: [],
      },
      {
        standardId: "iso27001",
        requirements: [
          "Établir, mettre en œuvre, tenir à jour et améliorer un SMSI",
          "Définir le périmètre : actifs, systèmes, processus, sites couverts",
          "La certification nécessite une Déclaration d'Applicabilité (DdA) documentée",
          "S'applique à toute information : numérique, papier, orale",
        ],
        links: [],
      },
      {
        standardId: "iso37001",
        requirements: [
          "Prévenir, détecter et traiter les faits de corruption active et passive",
          "Couvre la corruption directe, indirecte, par intermédiaires et agents",
          "S'applique aux organisations publiques et privées, de toute taille",
          "Les paiements de facilitation peuvent être inclus selon les dispositions internes",
        ],
        links: [],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "Couvre l'ensemble de la chaîne alimentaire, du champ à l'assiette",
          "Intègre ISO 22000, les programmes prérequis sectoriels ISO/TS 22002-x et exigences FSSC",
          "S'applique aux fabricants, conditionneurs, distributeurs et prestataires logistiques",
          "La version 6 (2023) introduit la durabilité et la culture sécurité alimentaire",
        ],
        links: [],
      },
    ],
  },
  {
    id: "ch2",
    number: 2,
    pdca: "INTRO",
    title: "Références normatives",
    purpose:
      "Liste les documents normatifs de référence indispensables à l'application de la norme. Leur connaissance est vérifiée lors des audits de certification.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "ISO 9000:2015 — Systèmes de management de la qualité : principes essentiels et vocabulaire",
          "Pour les références datées, seule l'édition citée s'applique",
          "Pour les références non datées, la dernière édition en vigueur s'applique",
          "ISO 9004 — Qualité d'un organisme : démarche pour parvenir à un succès durable (guide)",
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "ISO 14050:2020 — Management environnemental : vocabulaire",
          "ISO 14004 — SME : lignes directrices générales pour la mise en œuvre",
          "ISO 14031 — Management environnemental : évaluation de la performance",
          "Réglementations nationales applicables (code de l'environnement, ICPE, REACH)",
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "ISO 45003 — Santé et sécurité psychologique au travail (lignes directrices)",
          "ILO-OSH 2001 — Directives de l'OIT pour les systèmes de management SST",
          "OHSAS 18001:2007 — Remplacé par ISO 45001 depuis mars 2021 (migration terminée)",
          "Réglementations nationales : code du travail, décrets, arrêtés, conventions collectives",
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "ISO/IEC 27000:2018 — Vocabulaire et définitions du SMSI",
          "ISO/IEC 27002:2022 — Mesures de sécurité de l'information (93 contrôles, 4 thèmes)",
          "ISO/IEC 27005 — Management des risques liés à la sécurité de l'information",
          "ISO/IEC 27701 — Extension PIMS pour la protection des données personnelles (RGPD)",
          "ISO/IEC 27017 (cloud), ISO/IEC 27018 (données perso cloud) — extensions sectorielles",
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "ISO 37000:2021 — Gouvernance des organisations : lignes directrices",
          "ISO 37301:2021 — Systèmes de management de la conformité (successeur ISO 19600)",
          "Loi SAPIN II (France, 2016) — Transparence, lutte contre la corruption",
          "FCPA (USA), UK Bribery Act (UK) — Textes internationaux de référence",
          "OCDE — Convention sur la lutte contre la corruption d'agents publics étrangers",
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "ISO 22000:2018 — Exigences relatives aux SMSA (base normative du FSSC)",
          "ISO/TS 22002-1 (fabricants), -2 (traiteurs), -4 (emballage), -6 (production animale)",
          "Codex Alimentarius — Principes généraux d'hygiène alimentaire (CAC/RCP 1-1969)",
          "Règlement (CE) n°852/2004 sur l'hygiène des denrées alimentaires (Europe)",
          "FSMA (Food Safety Modernization Act, USA) pour les exportateurs vers les USA",
        ],
      },
    ],
  },
  {
    id: "ch3",
    number: 3,
    pdca: "INTRO",
    title: "Termes et définitions",
    purpose:
      "Vocabulaire essentiel pour comprendre et appliquer correctement la norme. La maîtrise des définitions clés est vérifiée lors des audits.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "Organisme : groupe de personnes ayant ses propres fonctions et responsabilités",
          "Partie intéressée : personne ou organisme pouvant affecter ou être affectée par une décision",
          "Risque : effet de l'incertitude (positive ou négative) sur un résultat attendu",
          "Non-conformité : non-satisfaction d'une exigence (client, légale, normative)",
          "Amélioration continue : activité récurrente permettant d'améliorer la performance",
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "Aspect environnemental : élément des activités ou produits pouvant interagir avec l'environnement",
          "Impact environnemental : modification de l'environnement résultant d'un aspect",
          "Exigences de conformité : exigences légales et autres exigences volontaires (ISO 14050)",
          "Cycle de vie : stades consécutifs d'un système produit, de l'extraction au recyclage",
          "Performance environnementale : résultats mesurables sur les aspects environnementaux",
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "Travailleur : personne réalisant un travail sous le contrôle de l'organisme",
          "Danger : source ayant le potentiel de causer des dommages (blessure, maladie, mort)",
          "Risque SST : combinaison de la probabilité et de la gravité d'un événement dangereux",
          "Incident : événement découlant du travail ou survenant lors du travail",
          "Participation : implication dans la prise de décision (distincts de la consultation)",
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "Actif informationnel : tout élément ayant de la valeur pour la sécurité de l'information",
          "CIA : Confidentialité, Intégrité, Disponibilité — triade fondamentale de la sécurité",
          "Vulnérabilité : faiblesse d'un actif pouvant être exploitée par une menace",
          "DdA : Déclaration d'Applicabilité — liste des contrôles annexe A retenus avec justifications",
          "Risque résiduel : risque subsistant après application des mesures de traitement",
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "Corruption : offre ou acceptation d'un avantage indu pour influencer une action",
          "DAFCO : délégué à la fonction anti-corruption (Compliance Officer)",
          "Due diligence AC : processus d'évaluation du risque de corruption d'un tiers",
          "Facilitation payment : paiement mineur pour accélérer une procédure administrative",
          "Tiers : personne physique ou morale avec qui l'organisme a ou envisage une relation",
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "Danger alimentaire : agent biologique, chimique, physique ou allergène susceptible de causer un dommage",
          "CCP (Critical Control Point) : étape où la maîtrise est essentielle pour prévenir un danger",
          "PRPo (Prérequis opérationnel) : mesure de maîtrise plus ciblée qu'un PRP, moins qu'un CCP",
          "Limite critique : critère séparant l'acceptable de l'inacceptable à un CCP",
          "Food Defense : mesures visant à prévenir la contamination alimentaire intentionnelle malveillante",
        ],
      },
    ],
  },
  {
    id: "ch4",
    number: 4,
    pdca: "PLAN",
    title: "Contexte de l'organisme",
    purpose:
      "Comprendre l'environnement interne et externe de l'organisme pour concevoir un système de management pertinent et ancré dans la réalité stratégique.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "4.1 Analyser les enjeux internes (culture, valeurs, connaissance, performance) et externes (légaux, technologiques, marchés)",
          "4.2 Identifier les parties intéressées pertinentes (clients, fournisseurs, régulateurs) et leurs exigences",
          "4.3 Définir et documenter le domaine d'application du SMQ (sites, produits, exclusions justifiées)",
          "4.4 Établir et maintenir les processus du SMQ, leurs séquences et interactions (cartographie des processus)",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Gestion des processus", href: "/processes" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "4.1 Analyser les enjeux environnementaux internes/externes (PESTEL avec dimension env.)",
          "4.2 Identifier les parties intéressées : riverains, ONG, collectivités, régulateurs",
          "4.3 Définir le périmètre du SME : sites, activités couvertes, exclusions argumentées",
          "4.4 Documenter les processus du SME et leurs interactions avec les activités opérationnelles",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Impacts env.", href: "/env-impacts" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "4.1 Comprendre les enjeux internes/externes SST (conditions de travail, technologie, légal)",
          "4.2 Identifier les besoins des travailleurs, partenaires SST, inspection du travail",
          "4.3 Définir le domaine d'application : tous les sites et activités où des travailleurs sont exposés",
          "4.4 Établir les processus du SMS-SST en intégrant les exigences de participation des travailleurs",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Document unique", href: "/document-unique" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "4.1 Analyser les enjeux internes/externes liés à la sécurité de l'information (menaces, réglementation)",
          "4.2 Identifier les parties intéressées SI : DSI, RGPD, CNIL, clients, partenaires, auditeurs",
          "4.3 Définir le périmètre du SMSI : systèmes, réseaux, sites, services inclus ou exclus",
          "4.4 Établir le SMSI selon les exigences de la norme et intégrer dans les processus métier",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Registre des risques", href: "/risks" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "4.1 Analyser le contexte de corruption : secteur, pays, parties prenantes à risque",
          "4.2 Identifier les parties intéressées AC : actionnaires, régulateurs, OCDE, AFA, clients publics",
          "4.3 Définir le périmètre SMAC : entités légales, pays, types d'activités couverts",
          "4.4 Établir les processus AC et leur intégration dans les processus achats, ventes, RH, finance",
          "4.5 Évaluation du risque de corruption : cartographie initiale par processus et secteur géographique",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Registre des risques", href: "/risks" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "4.1 Analyser les enjeux internes/externes liés à la sécurité alimentaire (chaîne, réglementation)",
          "4.2 Identifier les parties intéressées : distributeurs, autorités sanitaires, consommateurs",
          "4.3 Définir le périmètre du SMSA : catégories de produits, procédés, sites, maillon de la chaîne",
          "4.4 Établir les processus SMSA et définir l'équipe sécurité alimentaire (HACCP team)",
        ],
        links: [
          { label: "Contexte et enjeux", href: "/context" },
          { label: "Gestion des processus", href: "/processes" },
        ],
      },
    ],
  },
  {
    id: "ch5",
    number: 5,
    pdca: "PLAN",
    title: "Leadership",
    purpose:
      "Démontrer l'engagement visible et actif de la direction dans le système de management. Le leadership conditionne la culture et la performance du système.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "5.1 Leadership et engagement : la direction prend la responsabilité du SMQ, établit et maintient la politique",
          "5.1.2 Orientation client : s'assurer que les exigences clients sont connues et satisfaites",
          "5.2 Politique qualité : établie, communiquée, comprise, revue — affiche les engagements et valeurs",
          "5.3 Rôles, responsabilités, autorités : nommer le responsable qualité, définir les attributions par poste",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "5.1 La direction s'engage sur la politique env., l'amélioration continue et la conformité légale",
          "5.2 Politique environnementale : engagement réduction impacts, conformité légale, amélioration continue",
          "5.3 Rôles et autorités env. : nommer le responsable SME, définir les missions et délégations",
          "Promouvoir la culture environnementale à tous les niveaux de l'organisme",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "5.1 Leadership SST : la direction assure les ressources, participe aux inspections, encourage la culture",
          "5.2 Politique SST : engagement santé/sécurité, zéro accident, consultation travailleurs",
          "5.3 Rôles SST : nommer le Responsable SST, définir les délégations (chef d'équipe, travailleur désigné)",
          "5.4 Consultation et participation : comité SST, remontées terrain, droit de refus, Stop Work Authority",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "5.1 La direction s'engage : ressources SMSI, intégration SI dans les processus stratégiques",
          "5.2 Politique SSI : engagement confidentialité/intégrité/disponibilité, rôles, revue annuelle",
          "5.3 Rôles SI : nommer RSSI (Responsable Sécurité SI), définir les attributions et délégations",
          "Démontrer la gouvernance SI au CODIR et au conseil d'administration",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "5.1 Engagement direction : DG et CA signent la politique AC, allouent des ressources dédiées",
          "5.2 Politique anti-corruption : code de conduite, seuils cadeaux, politique invitations, diffusion",
          "5.3 Rôles AC : nommer DAFCO indépendant, accès au CA, ligne de reporting directe",
          "5.4 Supervision : le CA reçoit un reporting régulier du DAFCO sur le SMAC",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "5.1 La direction s'engage sur la sécurité alimentaire comme priorité absolue (Food Safety Culture)",
          "5.2 Politique SMSA : engagement satisfaction client, conformité réglementaire, amélioration HACCP",
          "5.3 Nommer le responsable SMSA (Food Safety Manager) et l'équipe HACCP pluridisciplinaire",
          "Promouvoir la culture de sécurité alimentaire à tous les niveaux de l'organisme",
        ],
        links: [
          { label: "Documents", href: "/documents" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
    ],
  },
  {
    id: "ch6",
    number: 6,
    pdca: "PLAN",
    title: "Planification",
    purpose:
      "Identifier et traiter les risques et opportunités, fixer des objectifs mesurables, et planifier les changements. C'est le cœur stratégique du système de management.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "6.1 Identifier les risques et opportunités qualité (AMDEC, SWOT, PESTEL, revue de direction)",
          "6.1 Planifier les actions pour traiter les risques et saisir les opportunités",
          "6.2 Objectifs qualité SMART : mesurables (taux NC, OTIF, réclamations), communiqués et revus",
          "6.3 Planification des changements (MOC) : modifications produits, procédés, ressources, organisation",
        ],
        links: [
          { label: "Plan d'actions", href: "/action-plan" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Contexte et enjeux", href: "/context" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "6.1 Risques et opportunités env. : aspects environnementaux significatifs, exigences légales",
          "6.1.2 Aspects environnementaux significatifs : évaluation (fréquence × gravité × portée)",
          "6.1.3 Obligations de conformité : veille réglementaire, ICPE, rejets, déchets, Natura 2000",
          "6.2 Objectifs env. : réduction émissions CO2, consommation eau/énergie, taux valorisation déchets",
        ],
        links: [
          { label: "Impacts env.", href: "/env-impacts" },
          { label: "Plan d'actions", href: "/action-plan" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "6.1 Risques et opportunités SST : identification dangers, évaluation risques (JSA, AMDEC)",
          "6.1.2 Évaluation risques SST : JSA, HIRA, méthode nœud papillon, LOTO, PTW",
          "6.1.3 Exigences légales SST : registre légal, code du travail, décrets, arrêtés",
          "6.2 Objectifs SST avec KPI : TRIR (Taux Fréquence), LTI, taux gravité, nombre AT/MP",
        ],
        links: [
          { label: "Document unique", href: "/document-unique" },
          { label: "Registre risques", href: "/risks" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "6.1 Appréciation des risques SI : identifier actifs, menaces, vulnérabilités, probabilité, impact",
          "6.1.2 Traitement des risques : accepter, éviter, transférer, réduire — plans de traitement",
          "6.1.3 Déclaration d'Applicabilité (DdA) : 93 contrôles Annexe A, statut appliqué/exclu avec justifications",
          "6.2 Objectifs SMSI : MTTD/MTTR incidents, % vulnérabilités patchées, score KRI",
        ],
        links: [
          { label: "Registre risques", href: "/risks" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "6.1 Risques corruption : cartographie par processus (achats, ventes, marchés publics, recrutement)",
          "6.1 Actions de traitement : contrôles, due diligence, clauses contractuelles, formations ciblées",
          "6.1.2 Évaluation et due diligence tiers : classification risque (faible/moyen/élevé), questionnaires",
          "6.2 Objectifs SMAC : % employés formés, délai traitement alertes, couverture due diligence tiers",
        ],
        links: [
          { label: "Registre risques", href: "/risks" },
          { label: "Plan d'actions", href: "/action-plan" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "6.1 Risques et opportunités SMSA : analyse de la chaîne alimentaire, réglementation, émergences",
          "6.2 Objectifs SMSA : taux de réclamations, résultats de surveillance CCP, écarts PRP",
          "6.3 Gestion du changement : modifications produits, procédés, fournisseurs, équipements — revue HACCP obligatoire",
          "Analyser les dangers potentiels sur tous les produits et intrants",
        ],
        links: [
          { label: "Plan d'actions", href: "/action-plan" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
    ],
  },
  {
    id: "ch7",
    number: 7,
    pdca: "PLAN",
    title: "Support",
    purpose:
      "Fournir les ressources, compétences, moyens de communication et d'information documentée nécessaires au fonctionnement efficace du système de management.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "7.1 Ressources : personnel, équipements, environnement de travail, ressources de surveillance et mesure",
          "7.2 Compétences : identifier les compétences nécessaires, former, évaluer l'efficacité",
          "7.3 Sensibilisation : tout le personnel doit connaître la politique, les objectifs et son impact qualité",
          "7.4 Communication interne et externe : quoi, quand, comment, qui communique",
          "7.5 Information documentée : maîtrise des procédures, enregistrements, revisions, accès, conservation",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Compétences", href: "/skills" },
          { label: "Documents", href: "/documents" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "7.1 Ressources env. : personnel formé, équipements de mesure environnementale, budget",
          "7.2 Compétences env. : formations réglementaires, habilitations, connaissances aspects significatifs",
          "7.3 Sensibilisation env. : impacts des activités, contribution à la politique env., conséquences non-respect",
          "7.4 Communication env. : reporting légal (DREAL, mairie), dialogue parties prenantes, rapport DD",
          "7.5 Procédures et enregistrements SME : plans déchets, registres rejets, rapports inspection",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Documents", href: "/documents" },
          { label: "Équipements", href: "/equipment" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "7.1 Ressources SST : EPI, matériels de secours, maintenance équipements critiques, budget prévention",
          "7.2 Compétences SST : habilitations (électriques, CACES, travaux en hauteur), PTW, H2S, ATEX",
          "7.3 Sensibilisation SST : culture sécurité, règles vitales, 10 minutes sécurité, Stop Work Authority",
          "7.4 Communication SST : gestion de crise, retour expérience incidents, remontée terrain",
          "7.5 Information documentée SST : procédures de travail sécurisées, modes opératoires, JSA",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Compétences", href: "/skills" },
          { label: "Documents", href: "/documents" },
          { label: "Équipements", href: "/equipment" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "7.1 Ressources SMSI : RSSI, équipe SOC, budget cybersécurité, outils (SIEM, EDR, ITSM)",
          "7.2 Compétences SI : certifications (CISSP, CISM, ISO 27001 LA), formations sécurité",
          "7.3 Sensibilisation SI : phishing tests, e-learning cyber, affichage règles de bonne pratique",
          "7.4 Communication SI : plan de gestion de crise, escalade incidents, communication autorités (CNIL)",
          "7.5 Procédures SI : politique MDP, BYOD, télétravail, destruction supports, gestion des droits",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Documents", href: "/documents" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "7.1 Ressources SMAC : DAFCO avec budget et personnel dédié, accès aux données de l'organisme",
          "7.2 Compétences AC : formations obligatoires pour les fonctions à risque, habilitations",
          "7.3 Sensibilisation AC : e-learning code de conduite, campagnes ethics, ateliers cas pratiques",
          "7.4 Communication AC : reporting au CA, ligne éthique interne, communication externe engagements",
          "7.5 Procédures AC : registre cadeaux, procédure due diligence, code de conduite documenté",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Documents", href: "/documents" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "7.1 Ressources SMSA : équipe HACCP pluridisciplinaire, laboratoire, équipements de mesure étalonnés",
          "7.2 Compétences HACCP : formation HACCP certifiée pour tous les membres de l'équipe food safety",
          "7.3 Sensibilisation alimentaire : hygiène, allergènes, corps étrangers, température — tout le personnel",
          "7.4 Communication alimentaire : alertes traçabilité, communication chaîne amont/aval, gestion de crise",
          "7.5 Information documentée SMSA : fiches produits, diagrammes de flux, plan HACCP, enregistrements CCP",
        ],
        links: [
          { label: "Formations", href: "/training" },
          { label: "Documents", href: "/documents" },
          { label: "Équipements", href: "/equipment" },
        ],
      },
    ],
  },
  {
    id: "ch8",
    number: 8,
    pdca: "DO",
    title: "Réalisation opérationnelle",
    purpose:
      "Mettre en œuvre les plans et contrôles opérationnels définis. C'est la phase d'exécution : production, service, contrôles terrain, gestion des fournisseurs et des urgences.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "8.1 Maîtrise opérationnelle : procédures, plans de contrôle, paramètres critiques, traçabilité",
          "8.2 Exigences produits/services : revues des commandes, contrats, exigences clients documentées",
          "8.4 Maîtrise des prestations externes : qualification fournisseurs, cahier des charges, évaluation",
          "8.5 Production et prestation : identification, traçabilité, propriété clients, préservation",
          "8.6 Libération des produits : contrôles finaux, autorisation de livraison, preuves de conformité",
          "8.7 Maîtrise des éléments non conformes : identification, isolement, traitement, enregistrement",
        ],
        links: [
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Fournisseurs", href: "/suppliers" },
          { label: "Réclamations clients", href: "/complaints" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "8.1 Maîtrise opérationnelle env. : procédures pour aspects significatifs, instructions de travail",
          "8.1.2 Préparation urgences env. : POI, plan de réponse aux déversements/fuites/incendies",
          "8.2 Gestion des achats env. : critères environnementaux dans les cahiers des charges fournisseurs",
          "Maîtrise des prestataires extérieurs sur site : exigences SME dans les contrats",
        ],
        links: [
          { label: "Impacts env.", href: "/env-impacts" },
          { label: "Urgences env.", href: "/env-emergency" },
          { label: "Risques chimiques env.", href: "/env-chemical" },
          { label: "Déchets", href: "/waste" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "8.1 Maîtrise opérationnelle SST : permis de travail (PTW), consignation (LOTO), inspections terrain",
          "8.1.2 Préparation urgences SST : plan d'urgence, exercices évacuation, secouristes (SST)",
          "8.1.3 Gestion contractants : induction SST obligatoire, évaluation performance sécu sous-traitants",
          "8.6 Gestion des changements SST : modification procédés, installations, effectifs — analyse de risques",
        ],
        links: [
          { label: "Plan de prévention", href: "/prevention-plan" },
          { label: "Tests urgences", href: "/emergency-tests" },
          { label: "Visites sécu terrain", href: "/safety-visits" },
          { label: "Risques chimiques", href: "/chemical-risks" },
          { label: "Fournisseurs", href: "/suppliers" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "8.1 Mise en œuvre du plan de traitement des risques SI approuvé",
          "8.2 Appréciation des risques SI : maintenir à jour le registre des risques et les évaluations",
          "8.3 Traitement des risques SI : déployer les contrôles Annexe A, documenter les décisions",
          "Contrôles opérationnels : gestion des accès, sauvegardes, patch management, MFA, DLP",
        ],
        links: [
          { label: "Registre risques", href: "/risks" },
          { label: "Documents", href: "/documents" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "8.1 Contrôles anti-corruption opérationnels : SoD financière, double approbation, plafonds",
          "8.2 Due diligence tiers : évaluation systématique des partenaires, fournisseurs, agents",
          "8.3–8.10 Contrôles spécifiques : cadeaux, contributions politiques, lobbying, recrutement intermédiaires",
          "Intégrer des clauses AC dans tous les contrats et superviser leur application",
        ],
        links: [
          { label: "Fournisseurs", href: "/suppliers" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "8.1 Maîtrise opérationnelle SMSA : mise en œuvre des PRP, PRPo et plan HACCP",
          "8.2 Programmes prérequis (PRP) : locaux, équipements, hygiène, lutte nuisibles — maîtrise de base",
          "8.5 Analyse des dangers HACCP : produits, procédés, diagrammes de flux, évaluation des dangers",
          "8.6 Plan HACCP : CCP, limites critiques, surveillance, actions correctives documentées",
          "8.9 Maîtrise NC produits alimentaires : retrait, rappel, tests libération, enregistrements",
        ],
        links: [
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Fournisseurs", href: "/suppliers" },
          { label: "Équipements", href: "/equipment" },
        ],
      },
    ],
  },
  {
    id: "ch9",
    number: 9,
    pdca: "CHECK",
    title: "Évaluation des performances",
    purpose:
      "Mesurer, analyser et évaluer si le système de management atteint ses objectifs. Les audits internes et la revue de direction sont les outils clés de ce pilier CHECK.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "9.1 Surveillance et mesure : indicateurs qualité (OTIF, taux NC, réclamations, satisfaction client)",
          "9.1.2 Satisfaction client : enquêtes NPS, taux réclamations, délais traitement, fidélisation",
          "9.2 Audit interne : programme annuel basé sur les risques, auditeurs formés et indépendants",
          "9.3 Revue de direction : performance globale, risques, objectifs, ressources, décisions d'amélioration",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Réclamations clients", href: "/complaints" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "9.1 Surveillance env. : monitoring rejets, consommations, mesures bruit, qualité de l'air",
          "9.1.2 Évaluation de la conformité légale : registre légal tenu à jour, contrôles DREAL, rapports",
          "9.2 Audit interne env. : programme basé sur les aspects significatifs et la conformité réglementaire",
          "9.3 Revue de direction SME : performance env., conformité, objectifs, plan d'actions mis à jour",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Visites env. terrain", href: "/env-visits" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "9.1 Surveillance SST : inspections terrain, mesures hygiène industrielle (bruit, vibrations, CMR)",
          "9.1.2 Évaluation conformité SST : code du travail, arrêtés, conventions — registre légal SST",
          "9.2 Audit interne SST : programme risques, audits sites/contractors, rapport au CODIR",
          "9.3 Revue de direction SST : incidents, KPI (TRIR/LTI), programme prévention, ressources",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Visites sécu terrain", href: "/safety-visits" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "9.1 Surveillance SMSI : tableaux de bord sécurité, KRI (Key Risk Indicators), test d'intrusion",
          "9.2 Audit interne SMSI : audit des contrôles Annexe A, audit de la DdA, rapport RSSI",
          "9.3 Revue de direction SMSI : incidents SI, vulnérabilités, état DdA, ressources, objectifs",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "9.1 Surveillance SMAC : KPI anti-corruption (alertes reçues, due diligence réalisées, formations)",
          "9.1.2 Évaluation conformité légale AC : SAPIN II, reporting AFA, auto-évaluation annuelle",
          "9.2 Audit interne SMAC : indépendant du DAFCO, basé sur les risques, rapport au CA",
          "9.3 Revue de direction SMAC : état des alertes, incidents corruption, révision cartographie risques",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "9.1 Surveillance SMSA : résultats CCP (surveillance en ligne), analyses microbiologiques, plaintes",
          "9.1.2 Vérification SMSA : audit HACCP, analyses produits finis, tests traçabilité",
          "9.2 Audit interne SMSA : programme de vérification annuel incluant tous les PRP et CCP",
          "9.3 Revue de direction SMSA : résultats audits, réclamations alimentaires, plan HACCP mis à jour",
        ],
        links: [
          { label: "Audits", href: "/audits" },
          { label: "Indicateurs", href: "/indicators" },
          { label: "Réclamations clients", href: "/complaints" },
        ],
      },
    ],
  },
  {
    id: "ch10",
    number: 10,
    pdca: "ACT",
    title: "Amélioration",
    purpose:
      "Traiter les non-conformités, en tirer des leçons, et améliorer continuellement le système de management. L'amélioration est la boucle vertueuse du cycle PDCA.",
    cells: [
      {
        standardId: "iso9001",
        requirements: [
          "10.1 Réagir aux non-conformités : traitement immédiat, analyse des causes, CAPA",
          "10.2 Actions correctives : analyse de cause racine (5 Pourquoi, diagramme Ishikawa), CAPA",
          "10.2 Vérifier l'efficacité des CAPA : suivi du plan d'actions, clôture avec preuves",
          "10.3 Amélioration continue : initiatives Lean, Kaizen, 8D, PDCA, digitalisation",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso14001",
        requirements: [
          "10.1 Non-conformités env. : incidents (déversements, émissions), écarts réglementaires",
          "10.2 Actions correctives env. : RCA (Root Cause Analysis), plans de réhabilitation",
          "10.2 Évaluer l'efficacité des mesures correctives env. et mettre à jour le registre légal",
          "10.3 Amélioration continue env. : réduction empreinte carbone, programmes ISO 14064",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso45001",
        requirements: [
          "10.1 Incidents SST : déclaration AT/MP, enquête accidents (arbre des causes), analyse presque-accidents",
          "10.2 Actions correctives SST : CAPA ciblées sur les causes racines, leçons apprises diffusées",
          "10.2 Vérifier l'efficacité des CAPA SST et mesurer l'impact sur les KPI (TRIR, taux gravité)",
          "10.3 Amélioration comportementale : programmes BBS (Behavior-Based Safety), tournées terrain DG",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Incidents", href: "/incidents" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso27001",
        requirements: [
          "10.1 NC et incidents SI : catégoriser, notifier (CNIL sous 72h pour violation données), documenter",
          "10.2 Actions correctives SMSI : analyser les causes racines des incidents, corriger les contrôles",
          "10.2 Évaluer l'efficacité des corrections et mettre à jour la DdA si nécessaire",
          "10.3 Amélioration continue SMSI : veille menaces, retour expérience CERT, mise à jour contrôles",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "iso37001",
        requirements: [
          "10.1 Incidents corruption : gestion des alertes reçues, protection lanceurs d'alerte, enquête",
          "10.2 Actions correctives AC : analyser les causes des manquements, renforcer les contrôles",
          "10.2 Mesurer l'efficacité des CAPA AC et reporter au DAFCO et au CA",
          "10.3 Amélioration continue SMAC : benchmark, veille SAPIN II/FCPA, programme maturité AC",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Plan d'actions", href: "/action-plan" },
        ],
      },
      {
        standardId: "fssc22000",
        requirements: [
          "10.1 Non-conformités alimentaires : produits non conformes, déviation CCP, dépassement limite critique",
          "10.2 Retrait/rappel produits : procédure documentée, simulation annuelle, notification autorités",
          "10.2 Actions correctives HACCP : analyse cause, correction du plan HACCP, revalidation si nécessaire",
          "10.3 Amélioration continue SMSA : révision annuelle du plan HACCP, intégration retours terrain",
        ],
        links: [
          { label: "CAPA", href: "/capa" },
          { label: "Non-conformités", href: "/non-conformances" },
          { label: "Plan d'actions", href: "/action-plan" },
          { label: "Réclamations clients", href: "/complaints" },
        ],
      },
    ],
  },
]

export function getChapterById(id: string): GuideChapter | undefined {
  return chapters.find((chapter) => chapter.id === id)
}
