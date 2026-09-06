# RÉUSSIR POLYTECH — Académie numérique des ingénieurs de l'ENSPY

> « Réussir aujourd'hui, construire les ingénieurs de demain. »

Plateforme web premium (luxe technologique, futuriste) conçue par un collectif d'étudiants
ingénieurs pour accompagner les étudiants de l'ENSPY : réussite académique, préparation aux
évaluations, développement professionnel et esprit entrepreneurial.

---

## 1. Stack technique

| Couche     | Technologie                                              |
| ---------- | -------------------------------------------------------- |
| Frontend   | Next.js 14 (App Router), React 18, TypeScript strict      |
| Styles     | Tailwind CSS (design system `night` / `gold` / blanc)     |
| Animations | Framer Motion (scroll, transitions de pages, 3D du logo)  |
| 3D         | Three.js (particules, wireframes d'ingénierie, parallaxe) |
| Backend    | Route handlers Next.js + base JSON typée (`data/db.json`) |
| Sécurité   | scrypt (mots de passe), sessions httpOnly 7 j, rôles      |
| Documents  | Générateur PDF maison sans dépendance (`src/lib/pdf.ts`)  |

## 2. Arborescence clé

```
src/
├── config.ts                 # Identité, WhatsApp (672356441), matières, types
├── content.ts                # Fondateurs, témoignages, programmes, roadmap…
├── lib/
│   ├── types.ts              # Modèle de données typé (User, Resource, Request…)
│   ├── db.ts                 # Base JSON + seed (25 ressources, annonces, démos)
│   ├── auth.ts               # scrypt, sessions cookie httpOnly, rôles
│   └── pdf.ts                # Générateur PDF 1.4 (WinAnsi, translittération)
├── components/
│   ├── three-hero.tsx        # Scène Three.js : particules + solides wireframe
│   ├── logo3d.tsx            # Logo flottant, halo pulsé, inclinaison souris
│   ├── hero.tsx              # Hero + pont SVG animé (pathLength whileInView)
│   ├── layout.tsx            # Navbar glass, transitions AnimatePresence, footer
│   ├── library.tsx           # Bibliothèque : recherche + filtres matière/niveau
│   ├── admin.tsx             # Console : CRUD ressources, users, demandes
│   └── …
└── app/
    ├── page.tsx              # Accueil spectaculaire (10 sections)
    ├── login / register      # Auth email OU téléphone + mot de passe
    ├── dashboard             # Espace étudiant (profil, demandes, documents)
    ├── library               # Bibliothèque numérique intelligente
    ├── resource/[id]         # Détail + aperçu réel du document
    ├── purchase/[id]         # Flux WhatsApp / Orange Money (5 étapes)
    ├── msp1 / msp2           # Espaces de niveau (programme + parcours docs)
    ├── entrepreneur          # Espace startup (projets, conseils, opportunités)
    ├── founders              # Portraits + parcours au survol
    ├── study                 # Planificateur de révisions + progression
    ├── admin                 # Console administrateur sécurisée
    └── api/…                 # auth, requests, admin/*, progress, download
```

## 3. Système d'accès premium (conforme au cahier des charges)

Aucun paiement automatique : le paiement est **humain**, via WhatsApp + Orange Money.

1. L'étudiant consulte une ressource premium → « Obtenir cette ressource ».
2. Page dédiée : « Pour obtenir cette ressource, contactez directement notre équipe WhatsApp ».
3. Bouton **« Contacter RÉUSSIR POLYTECH sur WhatsApp »** (wa.me/237672356441, message pré-rempli).
4. « Confirmer ma demande » crée une demande traçable (réf. `req-…`, statut *en attente*).
5. L'admin valide le paiement Orange Money → statut *validée* → document **débloqué**
   dans « Documents reçus » du tableau de bord, téléchargeable en PDF.

## 4. Comptes de démonstration

| Rôle     | Identifiant                | Mot de passe |
| -------- | -------------------------- | ------------ |
| Étudiant | `etudiant@demo.rp`         | `Demo@1234`  |
| Admin    | `admin@reussirpolytech.com`| `Admin@2026` |

## 5. Sécurité

- Mots de passe : `crypto.scryptSync` + sel aléatoire, comparaison `timingSafeEqual`.
- Sessions : token 192 bits, cookie `httpOnly` + `sameSite=lax`, expiration 7 jours.
- Routes protégées côté serveur (`getSessionUser` / `requireAdmin`) + gardes API 401/403.
- Aucune donnée sensible exposée : `toPublic()` retire hash/sel de chaque réponse.

## 6. Évolutions prévues (architecture prête)

Assistant IA étudiant · recherche sémantique · génération d'exercices · analyse des
performances. Le modèle de données (`Resource`, `StudyItem`, `PurchaseRequest`) et les
routes API versionnées permettent d'ajouter ces briques sans rupture.

## 7. Commandes

```bash
npm install          # dépendances
npm run build        # build de production
npm run start        # serveur production (0.0.0.0:3000)
npm run dev          # serveur de développement
```
