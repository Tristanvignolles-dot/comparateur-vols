# ✈ Comparateur de Vols — Guide de déploiement

Votre comparateur de vols avec **vrais prix en temps réel** via l'API Amadeus,
hébergé gratuitement sur Vercel.

---

## 📋 Ce dont vous avez besoin (tout gratuit)

- Un compte **GitHub** ✅ (vous l'avez déjà)
- Un compte **Amadeus for Developers** (à créer — 5 min)
- Un compte **Vercel** (à créer — 2 min)

---

## ÉTAPE 1 — Clés API Amadeus

1. Allez sur https://developers.amadeus.com
2. Cliquez **Register** → remplissez le formulaire → validez l'email
3. Connectez-vous → cliquez **"My Self-Service Workspace"**
4. Cliquez **"Create new app"** → nommez-la `comparateur-vols` → **Create**
5. Notez vos deux clés :
   ```
   API Key    → aBcDeFgHiJkL1234
   API Secret → mNoPqRsTuVwX5678
   ```

---

## ÉTAPE 2 — Mettre le projet sur GitHub

### Option A — Via le site GitHub (sans ligne de commande)

1. Allez sur https://github.com → cliquez **"New repository"**
2. Nom du repo : `comparateur-vols`
3. Laissez en **Public** (ou Private) → cliquez **"Create repository"**
4. Sur la page du repo vide, cliquez **"uploading an existing file"**
5. Glissez-déposez TOUS les fichiers de ce dossier
   ⚠️ Respectez la structure :
   ```
   comparateur-vols/
   ├── api/
   │   └── search.js
   ├── src/
   │   ├── main.jsx
   │   └── App.jsx
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── vercel.json
   └── .gitignore
   ```
6. Cliquez **"Commit changes"**

### Option B — Via Git (si vous avez Git installé)

```bash
cd comparateur-vols
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/comparateur-vols.git
git push -u origin main
```

---

## ÉTAPE 3 — Déployer sur Vercel

1. Allez sur https://vercel.com → cliquez **"Sign Up"** → choisissez **Continue with GitHub**
2. Autorisez Vercel à accéder à GitHub
3. Cliquez **"Add New Project"**
4. Trouvez votre repo `comparateur-vols` → cliquez **"Import"**
5. Dans la configuration :
   - **Framework Preset** : sélectionnez **Vite**
   - **Build Command** : `npm run build` (déjà rempli)
   - **Output Directory** : `dist` (déjà rempli)
6. Cliquez **"Environment Variables"** et ajoutez :
   ```
   Name  : AMADEUS_API_KEY
   Value : votre_api_key
   
   Name  : AMADEUS_API_SECRET
   Value : votre_api_secret
   ```
7. Cliquez **"Deploy"** → attendez ~2 minutes

8. ✅ Votre site est en ligne à l'adresse : `https://comparateur-vols-xxxx.vercel.app`

---

## ÉTAPE 4 — Tester votre application

1. Ouvrez l'URL fournie par Vercel
2. Sélectionnez un aéroport de départ
3. Choisissez des dates (dans le futur !)
4. Sélectionnez des destinations
5. Cliquez "Rechercher les vols"

---

## 🔧 En cas de problème

### "Aucun vol trouvé"
→ L'environnement test Amadeus a des données limitées. Essayez :
- Des dates dans les 3 prochains mois
- Des grandes villes (LON, AMS, FCO, DXB)
- Un aéroport de départ principal (CDG, BCN)

### Erreur 401 (Unauthorized)
→ Vérifiez vos clés dans Vercel : Settings > Environment Variables

### Erreur 429 (Too Many Requests)
→ Limite gratuite atteinte (2000 req/mois). Attendez le mois suivant
   ou passez en production Amadeus (toujours gratuit, données réelles)

---

## 🚀 Passer en production Amadeus (données réelles, gratuit)

Une fois que tout fonctionne en test :
1. Sur Amadeus : demandez l'accès production dans votre workspace
2. Vous recevez de nouvelles clés production
3. Dans `api/search.js`, changez :
   `https://test.api.amadeus.com` → `https://api.amadeus.com`
4. Mettez à jour les variables Vercel avec les nouvelles clés
5. Redéployez → vous aurez de vrais prix en temps réel !

---

## 💰 Coûts

| Service  | Plan         | Coût    |
|----------|--------------|---------|
| GitHub   | Free         | 0€/mois |
| Vercel   | Hobby        | 0€/mois |
| Amadeus  | Test env     | 0€/mois |
| Amadeus  | Production   | 0€/mois (tarification à l'usage au-delà) |
