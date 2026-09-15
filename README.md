# Réussir Polytech — Guide de démarrage

> "L'excellence est notre seul standard" — Actes constitutifs d'Éseka, 07 Mai 2026

## 🚀 Démarrage rapide

### 1. Installer Node.js

Téléchargez et installez Node.js LTS depuis : **https://nodejs.org**
> Vérifiez : `node --version` → doit afficher v18+ ou v20+

### 2. Configurer les variables d'environnement

```bash
# Copiez le fichier exemple
copy .env.local.example .env.local
```

Éditez `.env.local` et remplissez :
- `NEXT_PUBLIC_SUPABASE_URL` — URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clé anonyme Supabase

### 3. Configurer Supabase

1. Créez un projet sur [app.supabase.com](https://app.supabase.com)
2. Dans **SQL Editor**, collez et exécutez le contenu de `supabase/schema.sql`
3. Dans **Storage**, créez deux buckets publics :
   - `avatars` (photos de profil étudiants)
   - `academic-files` (cours, TD, examens)

### 4. Installer les dépendances

```bash
npm install
```

### 5. Lancer en développement

```bash
npm run dev
```

Ouvrez **http://localhost:3000** dans votre navigateur.

---

## 📁 Structure du projet

```
reussir-polytech/
├── app/                    # Pages (App Router Next.js 14)
│   ├── page.tsx            # / — Landing page publique
│   ├── auth/page.tsx       # /auth — Inscription/Connexion
│   ├── msp1/page.tsx       # /msp1 — Matières MSP1 (protégé)
│   ├── msp2/page.tsx       # /msp2 — Matières MSP2 (protégé)
│   ├── entrepreneur-vip/   # /entrepreneur-vip — VIP Élite (protégé)
│   ├── dashboard/page.tsx  # /dashboard — Espace étudiant (protégé)
│   └── a-propos/page.tsx   # /a-propos — Équipe
├── components/             # Composants React
│   ├── layout/             # Navbar, Footer, ThemeProvider
│   ├── home/               # HeroSection, ParticleCanvas, ValuesSection, QuoteSection
│   ├── auth/               # AuthForm, SignOutButton
│   ├── academic/           # SubjectCard (avec modal correction payante)
│   ├── vip/                # VipCard (avec modal candidature)
│   └── about/              # TeamCard (holographique)
├── lib/                    # Utilitaires
│   ├── supabaseClient.ts   # Client browser Supabase
│   ├── supabaseServer.ts   # Client serveur Supabase
│   └── whatsapp.ts         # Notifications WhatsApp
├── data/                   # Données statiques TypeScript
│   ├── curriculum.ts       # 35 matières MSP1 + MSP2
│   ├── vipPrograms.ts      # 9 formations VIP
│   └── team.ts             # 13 membres fondateurs
├── middleware.ts            # Protection des routes privées
├── supabase/schema.sql     # Script SQL complet
└── public/assets/          # Logo, hero, photos équipe
```

---

## 🎨 Design System

| Token | Valeur | Usage |
|---|---|---|
| `poly-night` | `#050B14` | Background principal (dark) |
| `poly-card` | `#0B1528` | Cartes glassmorphism |
| `poly-gold` | `#F59E0B` | Accent primaire |
| `poly-gold-hover` | `#D97706` | Hover doré |
| `poly-cyan` | `#38BDF8` | Accent technique |
| `poly-light-bg` | `#F8FAFC` | Background (light) |

---

## 📱 Pages & Routes

| Route | Accès | Description |
|---|---|---|
| `/` | 🌐 Public | Landing page avec hero, valeurs, citation |
| `/auth` | 🌐 Public | Inscription (matricule + avatar) / Connexion |
| `/msp1` | 🔒 Membre | Matières MSP1, S1 & S2 |
| `/msp2` | 🔒 Membre | Matières MSP2, S1 & S2 |
| `/entrepreneur-vip` | 🔒 Membre | Formations VIP Technique + Stratégique |
| `/dashboard` | 🔒 Membre | Tableau de bord étudiant |
| `/a-propos` | 🌐 Public | Trombinoscope des 13 membres |

---

## 📸 Assets à ajouter

Placez ces fichiers dans `/public/assets/` :

- `hero-engineers.jpg` — Photo héro ingénieurs avec casques
- `team/eugene-gwet.jpg` — Photo Eugène Samuel GWET
- `team/stevia-matho.jpg` — Photo Stevia Matho Re
- `team/alex-ngoua.jpg` — Photo Alex Ngoua Edou
- `team/christian-khouya.jpg` — Photo Khouya Christian Landry
- `team/sarah-ondoua.jpg` — Photo Sarah Ondoua Ella
- `team/bikey-yannick.jpg` — Photo Bikey Yannick
- `team/loice-tadontsa.jpg` — Photo Loïce Tadontsa
- `team/rose-mbog.jpg` — Photo Rose Mbog
- `team/emmanuella-amour.jpg` — Photo Emmanuella Amour
- `team/atyame-yolande.jpg` — Photo Atyame Yolande
- `team/franck.jpg` — Photo Franck
- `team/pacha.jpg` — Photo Pacha
- `team/bic-rouge.jpg` — Photo Bic-rouge

> En l'absence des photos, les initiales des prénoms s'affichent automatiquement.

---

## 🌐 Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans le dashboard Vercel
# Settings > Environment Variables
```

---

## 📞 Contacts WhatsApp intégrés

| Canal | Numéro | Rôle |
|---|---|---|
| TECH | +237 695 95 72 87 | Bikey Yannick — Formations techniques |
| STRATEGY | +237 672 35 64 41 | Eugène GWET — Formations stratégiques |
| SUPPORT | +237 672 35 64 41 | Corrections payantes (Orange Money) |
