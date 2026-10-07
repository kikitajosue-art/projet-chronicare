# ChroniCare Connect — Téléphone, tablette et ordinateur

## Mise à jour : langues, reconnexion, accessibilité et guide pratique

Ouvrir `GUIDE-DEPLOIEMENT.md` pour les neuf réponses détaillées : hébergement HTTPS avec Netlify Drop, configuration Apple/Google/passkeys/MFA avec liens, capteurs, sécurité, stores et accès hors connexion.

- Reconnexion corrigée : le rôle est reconnu depuis le compte enregistré.
- Français, anglais, mandarin, arabe (RTL), espagnol et portugais pour la navigation et les principales commandes. Traduction clinique complète encore à valider ; certains textes restent en français.
- Mode lecture facile, caractères plus grands, quatre actions principales et cases de médicaments accessibles depuis l’accueil.
- Affichage adapté au téléphone, à la tablette et à l’ordinateur.
- Indicateur Internet/hors connexion et alerte de sauvegarde impossible. Aucune synchronisation distante activée.
- Capteur de pouls BLE standard : déconnexion, vérification des trames et arrêt des capteurs au changement de compte. Essais logiciels simulés ; pas de validation sur matériel réel.
- Fermeture de session après inactivité et en-têtes préparés pour un déploiement Netlify. Le stockage médical local reste en clair : données fictives uniquement.

## Fonctions déjà présentes

Cette version enrichit le prototype existant. Elle ne contient pas encore de serveur de comptes ni de base de données partagée. Les données de santé et les comptes restent dans le navigateur. Utiliser des données fictives pour les démonstrations.

## Ce qui fonctionne dans cette version

| Demande | État |
| --- | --- |
| Animations | Transitions d’écran, courbes, boutons et indicateurs ; réduction des mouvements respectée. |
| Interface adaptative | Espace médecin large ; espace patient adaptatif ; menus translucides et quatre palettes. |
| Jour/nuit | Jour, nuit, automatique ; préférence conservée ; couleurs appliquées aux deux espaces. |
| Contacts et urgences | Liens d’appel et d’email ; contact personnel patient ; coordonnées ChroniCare configurables. |
| Hôpitaux | Premier annuaire de 8 établissements ou sites hospitaliers ; recherche, zones, favoris, sources et cartes. |
| Mobile | Pack PWA avec manifeste, icônes et interface accessible hors connexion après une première visite réussie. |
| Forum | Publications, réponses, soutien, suppression de ses messages et masquage après signalement : uniquement sur le même navigateur. |
| Apple/Google | Pages et parcours préparés, non activés ; aucune identité externe n’est simulée. |
| Face ID / empreinte | Explications et vérification de compatibilité passkeys ; authentification non activée. |
| Double authentification | Parcours prévu et conditions d’activation ; aucun faux code de sécurité. |
| Newsletter | Lien vers un formulaire d’inscription HTTPS configurable ; aucun email collecté ni envoyé par ce prototype. |

## Utiliser le prototype

Ouvrir `index.html` pour explorer l’interface. Choisir « Découvrir l’espace médecin (démo) » pour les quatre dossiers fictifs.

Les menus « Plus » côté patient et la navigation côté médecin donnent accès aux nouveaux modules. Les urgences et l’apparence sont accessibles avant connexion.

Les comptes précédemment créés restent disponibles dans le navigateur d’origine tant que l’origine du fichier ou du site reste la même. Une installation sur une nouvelle origine HTTPS ne migre pas automatiquement les anciennes données locales.

## Installer sur iPhone ou Android

1. Déployer les fichiers de ce dossier ensemble sur un hébergement statique HTTPS.
2. Vérifier que `index.html`, `manifest.webmanifest`, `sw.js` et les icônes sont accessibles sur la même origine et dans le même dossier.
3. Ouvrir l’URL sur le téléphone.
4. Sur iPhone, utiliser Safari → Partager → Ajouter à l’écran d’accueil ; choisir l’ouverture comme application web si proposé.
5. Sur Android, utiliser Chrome → menu ⋮ → Installer et créer un raccourci → Installer, selon la version du navigateur.

Le bouton d’installation apparaît lorsqu’il est proposé par le navigateur. Le pack n’est ni une application `.ipa`, ni un `.apk`, ni une publication sur les stores. Il n’est pas encore hébergé.

Prévisualisation sur ordinateur, avec Python installé :

```bash
python -m http.server 8080
```

Ouvrir `http://localhost:8080/index.html`. Pour une utilisation réelle sur téléphone, utiliser une URL HTTPS.

L’accès hors connexion concerne l’interface du prototype et l’annuaire intégré. Les cartes externes, les formulaires newsletter et la consultation des sources requièrent Internet. Les appels dépendent du réseau téléphonique. Le service worker met seulement en cache les fichiers publics de l’interface, sans réponse d’API ni données médicales. Une installation ne synchronise pas les dossiers entre appareils.

## Ajouter les contacts de ChroniCare

Se connecter avec un vrai compte local médecin → Urgences → Configurer les contacts du prototype. Renseigner le téléphone réel du projet, l’email réel et l’URL HTTPS du formulaire newsletter. Les réglages sont locaux ; ils devront être centralisés pour une mise en ligne multiutilisateur.

Aucune coordonnée ChroniCare n’a été inventée. Les contacts de secours hospitaliers sont séparés du support de l’application.

## Passer à une version connectée

### 1. Comptes, API et permissions

Mettre en place un serveur d’authentification, une base de données et une API. Un gestionnaire d’identité éprouvé peut fournir OAuth/OIDC, passkeys et MFA ; l’alternative est un backend dédié avec des bibliothèques maintenues. Éviter de réimplémenter les primitives cryptographiques.

- Authentifier les comptes par des sessions protégées, avec contrôle côté serveur.
- Vérifier le statut professionnel des médecins ; le choix « Médecin » dans un formulaire ne constitue pas une vérification.
- Faire autoriser explicitement chaque médecin par le patient. Le prototype actuel partage localement avec les comptes médecins de ce navigateur.
- Contrôler les accès à chaque dossier et chaque mutation, conserver une trace d’accès et appliquer immédiatement le retrait du partage.
- Prévoir conservation, export, suppression, sauvegardes, consentements et validation de la politique de traitement des données de santé.
- Utiliser HTTPS et éviter de mettre des secrets ou jetons privilégiés dans le code livré au navigateur.

### 2. Google

Créer un client de connexion dans Google Cloud / Google Identity Services, déclarer le domaine, les origines et les retours autorisés. Le serveur doit vérifier l’identité retournée (signature, destinataire, émetteur, expiration et paramètres anti-rejeu adaptés au flux), puis créer une session ChroniCare et attribuer les permissions. « Gmail » correspond ici à une connexion avec le compte Google.

### 3. Apple

Configurer Sign in with Apple : compte développeur, identifiants nécessaires, domaine et URL de retour. Garder les clés privées et secrets sur le serveur. Vérifier la réponse et rattacher l’identité au compte ChroniCare sans modifier implicitement son rôle. « iCloud » correspond ici au compte Apple ; l’accès à iCloud Mail n’est pas nécessaire.

### 4. Face ID et empreinte

Ajouter les passkeys/WebAuthn sur un domaine HTTPS stable. Le serveur émet un challenge, vérifie la réponse cryptographique, son origine et son destinataire, puis protège la session. Le téléphone gère la confirmation avec Face ID, l’empreinte ou son code selon le matériel et les réglages. Le site ne reçoit pas le visage ni l’empreinte et ne doit pas prétendre imposer un capteur précis.

Pour une application native ultérieure, utiliser les mécanismes système Apple/Android et le stockage sécurisé de l’appareil, en conservant la validation de session côté serveur.

### 5. Double authentification

Pour les connexions par mot de passe, ajouter un second facteur TOTP avec une application d’authentification. Enrôler le facteur après une réauthentification, confirmer un premier code, protéger le secret, vérifier les codes sur le serveur avec limitation des essais, et proposer des codes de secours à usage unique conservés sous forme de dérivés sécurisés. Prévoir un parcours de récupération. Un interrupteur dans le navigateur ne suffit pas à protéger le compte.

### 6. Forum partagé

Créer des données et des API pour discussions, réponses, réactions et signalements ; séparer les informations publiques du forum des dossiers médicaux. Ajouter pseudonymes, contrôle d’accès, règles, limites de publication, équipe et file de modération. Le bouton de signalement actuel masque seulement le message pour l’utilisateur sur cet appareil et ne contacte personne.

### 7. Newsletter et annuaire

Brancher le formulaire newsletter à un vrai service d’emailing avec consentement et désinscription. Centraliser l’annuaire dans une base administrable avec date de vérification, source, zone, distinction standard/urgence et actualisation régulière. Le pack contient un premier annuaire, pas une base mondiale exhaustive ; il n’indique ni disponibilité des lits ni présence des médecins en temps réel.

## Sources officielles

Coordonnées hospitalières consultées le 7 octobre 2026 :

- Monkole, urgences/SAMU : https://monkole.cd/urgences/
- Monkole, contact et adresse : https://monkole.cd/contact/
- HJ Hospitals, contacts Limete, Gombe, Lubumbashi, Goma : https://www.hjhospitals.org/fr/contact-us
- Aga Khan University Hospital Nairobi : https://hospitals.aku.edu/kenya/contact-us
- Pitié-Salpêtrière, urgences : https://pitiesalpetriere.aphp.fr/urgences-pitie-salpetriere/
- Pitié-Salpêtrière, adresse : https://www.aphp.fr/pitie-salpetriere/service-de-sau-service-daccueil-des-urgences
- St Thomas’ Hospital : https://www.guysandstthomas.nhs.uk/st-thomas-hospital

Installation et authentification :

- Apple, ajout à l’écran d’accueil : https://support.apple.com/en-gb/guide/iphone/iph42ab2f3a7/ios
- Chrome Android, applications web : https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=fr
- Google Identity Services : https://developers.google.com/identity/gsi/web/guides/overview
- Sign in with Apple : https://developer.apple.com/sign-in-with-apple/
- Passkeys : https://developers.google.com/identity/passkeys
- NIST, authentification numérique : https://pages.nist.gov/800-63-4/sp800-63b.html

Les principes de surfaces translucides et de couleurs d’accent s’inspirent des interfaces Apple et Windows, tout en gardant l’identité ChroniCare et une navigation centrée sur les tâches.
