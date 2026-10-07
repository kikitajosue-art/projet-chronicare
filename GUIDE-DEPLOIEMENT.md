# ChroniCare — mettre en ligne, installer et préparer la version commerciale

Guide du 7 octobre 2026. Le pack fourni fonctionne sur téléphone, tablette et ordinateur. C’est une application web installable, pas encore une application publiée sur un store. La version actuelle doit être utilisée avec des données fictives : ses dossiers sont conservés en clair dans le navigateur et aucun serveur médical partagé n’est relié.

## 1. Déployer facilement sur une adresse HTTPS

**Lien de départ : [Netlify Drop](https://app.netlify.com/drop).**

1. Télécharge `ChroniCare-mobile.zip` sur ton ordinateur.
2. Décompresse le ZIP. Ouvre le dossier `ChroniCare-mobile` : tu dois y voir `index.html`, `sw.js`, `manifest.webmanifest`, `icons`, `_headers` et les guides.
3. Connecte-toi à Netlify pour conserver et administrer le projet.
4. Dépose **le dossier contenant directement `index.html`** dans la zone de dépôt de Netlify Drop. Aucun build n’est nécessaire pour ce pack.
5. Copie l’adresse HTTPS que Netlify affiche. Ouvre-la sur ton ordinateur, puis sur ton téléphone. Le nom attribué au site dépendra de ton compte ; aucune adresse ChroniCare n’a encore été réservée ou publiée ici.
6. Attends le chargement complet. Installe l’application, puis teste une ouverture en mode avion. Vérifie que l’annuaire intégré s’ouvre.

Pour mettre à jour le site, utilise le **même projet Netlify** et dépose le nouveau dossier dans son espace de déploiement. Conserve une adresse stable pour les utilisateurs et, plus tard, les retours de connexion Google/Apple. Un changement de domaine crée un nouvel espace de stockage du navigateur.

Si un domaine personnalisé est ajouté, configure son DNS et attends que son certificat HTTPS soit prêt. Vérifie les conditions et limites du forfait avant une diffusion large.

La mise en ligne du pack publie l’interface. Elle ne crée pas une base de données, un forum partagé ni une synchronisation entre médecins et patients.

Documentation : [déploiement par dépôt](https://docs.netlify.com/deploy/create-deploys/) · [HTTPS](https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/).

## 2. Relier Apple, Google, Face ID et la double authentification

**Un chemin pratique est de centraliser l’identité avec [Clerk](https://dashboard.clerk.com).** Il reste à intégrer son SDK dans ChroniCare et à construire une API qui vérifie les sessions et les autorisations. Activer une option dans le tableau de bord seul ne relie pas ce prototype.

### Google

Ouvre [la procédure Google](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google). Crée le projet d’identité, active Google dans les connexions SSO et, pour la production, configure ton client OAuth dans Google Cloud. Recopie exactement les origines et URL de retour indiquées par Clerk. Teste ensuite avec un compte Google de test.

### Apple

Ouvre [la procédure Apple](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/apple). Prépare ton compte développeur Apple, l’identifiant d’application, le Service ID et la clé nécessaires. Déclare les domaines et retours HTTPS demandés. Renseigne les éléments dans le service d’identité, puis teste « Sign in with Apple ». Une adresse iCloud utilise la connexion Apple ; il n’existe pas de bouton d’authentification iCloud distinct à ajouter.

### Face ID, empreinte et MFA

Ouvre [les réglages passkeys et MFA](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options). Active les passkeys ; l’utilisateur en crée une après son inscription. Son appareil confirme avec sa biométrie ou son code. Pour la connexion par mot de passe, propose TOTP et des codes de secours ; exige MFA pour les professionnels. Chez Clerk, passkeys et MFA demandent actuellement un forfait payant en production.

Face ID et l’empreinte restent gérés par le système. ChroniCare reçoit une preuve de connexion, pas une photographie du visage ni une empreinte. Une passkey ne permet pas d’imposer Face ID à un appareil qui ne le possède pas. Une application native peut aussi utiliser le verrouillage biométrique du système pour ouvrir son stockage local sécurisé.

Les connexions externes et la vérification par le serveur nécessitent Internet. Un code TOTP peut être généré hors connexion par l’authentificateur ; le serveur doit néanmoins le vérifier en ligne pour ouvrir une nouvelle session distante.

**Travail d’intégration à prévoir :** remplacer `cc-users` par les identités du fournisseur ; vérifier les jetons/sessions dans l’API ; associer chaque identité à un dossier et à des permissions contrôlées côté serveur ; vérifier les médecins et les établissements. Le choix du rôle dans un formulaire ne suffit pas à attribuer un accès professionnel. Prévoir une migration explicite des données locales avec consentement ; ne pas fusionner des comptes simplement parce qu’ils affichent le même email.

Ne mets jamais de clé privée Apple, secret OAuth ou clé privilégiée de base de données dans le HTML public. Conserve-les dans la configuration sécurisée du serveur. Aucun mot de passe Apple ou Google ne doit être saisi dans un formulaire ChroniCare.

## 3. Pourquoi les mêmes identifiants étaient refusés

Une cause a été corrigée : la connexion dépendait du rôle sélectionné à l’écran. Après une déconnexion ou un rechargement, le sélecteur pouvait revenir sur « Patient » et refuser un compte médecin valide. Désormais, le rôle vient du compte enregistré. Sélectionner « Médecin » ne transforme pas un compte patient.

Les autres limites restent liées au stockage local :

| Situation | Conséquence et action |
| --- | --- |
| Même adresse, même navigateur, données conservées | Le compte local peut se reconnecter avec ses identifiants. |
| Fichier local puis nouvelle URL HTTPS | Ce sont deux espaces différents ; l’ancien compte ne migre pas automatiquement. |
| Autre téléphone, navigateur ou profil | L’ancien compte local n’est pas présent. Un serveur de comptes est nécessaire pour se connecter partout. |
| Navigation privée ou données du site effacées | Les comptes locaux peuvent disparaître. Ne pas effacer les données pour résoudre une erreur de mot de passe. |
| Mot de passe oublié | Utiliser le code de secours remis à la création, dans le navigateur qui contient le compte. |
| Stockage bloqué ou plein | L’indicateur affiche un échec de sauvegarde. Les nouvelles modifications ne sont pas conservées. |

## 4. Connecter montres, pouls, tensiomètres et appareils Wi-Fi

| Appareil | Chemin technique | État dans le pack |
| --- | --- | --- |
| Capteur de pouls BLE avec service standard Heart Rate | HTTPS, navigateur compatible, clic utilisateur, choix de l’appareil et notifications BLE | Connexion et enregistrement du pouls disponibles ; compatibilité dépendante du modèle. |
| Compteur de pas du téléphone | Permission du capteur de mouvement, application ouverte | Estimation locale ; aucun import automatique des pas d’une montre. |
| Apple Watch | Application iPhone native, HealthKit, permission Santé ; composant Watch si nécessaire | Intégration à construire. La montre ne devient pas un capteur web universel par son appairage Bluetooth. |
| Montre ou bracelet Android | Application Android, Health Connect et permissions de lecture des types nécessaires ; application fabricant si nécessaire | Intégration à construire. |
| Tensiomètre ou capteur propriétaire | Service BLE standard approprié ou SDK/API du fabricant | Modèle et protocole à vérifier avant développement. |
| Appareil Wi-Fi | API du fabricant ou passerelle authentifiée, transmission sécurisée et format documenté | Intégration à construire ; partager le Wi-Fi ne suffit pas. |

**Essai d’un capteur de pouls compatible :** allume le capteur, porte-le selon son guide, active Bluetooth, ouvre la version HTTPS, puis Mesures → Appareils et capteurs → Connecter. Autorise uniquement l’appareil souhaité. Une valeur reçue peut ensuite être enregistrée. Une déconnexion remet l’affichage à zéro et empêche d’enregistrer une ancienne valeur comme une nouvelle mesure.

Les tests logiciels couvrent des trames BLE simulées, la déconnexion et le changement de compte. Aucun appareil physique n’a été connecté pendant ces tests. Pour confirmer une compatibilité, fournir la marque, le modèle exact, le téléphone et sa version système.

Sur iPhone, le bouton web Bluetooth n’est pas une solution universelle pour Apple Watch ; prévoir le parcours natif Santé. Les intégrations doivent gérer les autorisations retirées, les unités, la source et l’heure du relevé, ainsi que les doublons. Une donnée importée tardivement n’est pas une surveillance médicale en temps réel. En attendant, une mesure peut être saisie manuellement après vérification sur l’écran du dispositif.

Liens : [Bluetooth web](https://developer.chrome.com/docs/capabilities/bluetooth) · [Apple HealthKit](https://developer.apple.com/documentation/healthkit) · [Android Health Connect](https://developer.android.com/health-and-fitness/health-connect).

## 5. Langues ajoutées

Le sélecteur en haut propose français, anglais, mandarin, arabe, espagnol et portugais. « Langues & accessibilité » regroupe ces choix et les réglages de lecture. L’arabe active le sens de lecture de droite à gauche. Les préférences sont conservées et les dates suivent la langue choisie.

Cette première traduction couvre la navigation et les commandes principales. Des explications détaillées, conseils médicaux, erreurs et consentements restent en français. Une validation humaine des traductions cliniques est nécessaire pour une version entièrement multilingue. Les noms, médicaments saisis, notes, messages du forum et dossiers ne sont pas envoyés à un service de traduction et ne sont pas traduits automatiquement.

## 6. Sécurité et confidentialité

Aucune application ne peut être garantie impossible à pirater. Il faut réduire le risque, contrôler les accès et prévoir la détection et la réponse aux incidents.

| Déjà dans le prototype | À construire avant de vrais dossiers médicaux |
| --- | --- |
| Mots de passe dérivés par PBKDF2, pas enregistrés en texte brut | Identité et sessions vérifiées côté serveur, récupération robuste, limitation des essais et MFA. |
| Rôle enregistré reconnu à la connexion | Vérification des professionnels et des hôpitaux ; permissions pour chaque dossier, établissement et action. |
| Déconnexion après inactivité ; capteurs et données en mémoire réinitialisés à la sortie | Expiration/révocation serveur, réauthentification des actions sensibles et stockage natif sécurisé. |
| Affichage échappé des textes saisis ; liens externes encadrés | Audit des API et du code, protection contre injections/XSS/CSRF selon l’architecture et tests d’accès entre établissements. |
| Service worker limité aux fichiers publics de l’interface | Dossiers et sauvegardes chiffrés, clés séparées et contrôlées ; aucun cache public de réponse médicale. |
| Fichier `_headers` préparé pour Netlify | Vérification des en-têtes après déploiement ; politique CSP complète après refonte des scripts intégrés. |

**Les données de santé actuelles restent en clair dans `localStorage`.** Le verrouillage local ne les chiffre pas et un autre utilisateur ayant accès au profil du navigateur peut les récupérer. Les comptes de démonstration et leurs rôles ne forment pas une barrière de sécurité de production.

Pour la version connectée : minimiser la collecte ; isoler les établissements ; enregistrer les accès sans recopier les dossiers dans les logs ; permettre le retrait du partage, l’export et la suppression selon les règles applicables ; protéger et tester les sauvegardes ; surveiller les incidents ; maintenir les dépendances ; faire réaliser un audit indépendant. Le forum doit rester séparé des dossiers et être réellement modéré avant une ouverture publique.

Avant de choisir un hébergeur pour les données médicales et les pays de lancement, faire valider les exigences locales de confidentialité, d’hébergement et, selon les fonctions proposées, de dispositif médical. Un hébergement HTTPS de démonstration n’est pas une validation de ces exigences.

Référentiel technique : [OWASP MASVS](https://mas.owasp.org/MASVS/).

## 7. Commercialiser et publier sur les stores

Le même produit peut être décliné pour plusieurs plateformes. Aucune procédure ne garantit une acceptation dans tous les stores ou une distribution dans tous les pays.

| Cible | Point de départ | Travail nécessaire |
| --- | --- | --- |
| App Store, iPhone/iPad | [Apple Developer Program](https://developer.apple.com/programs/enroll/) | Application native ou intégration avec pont natif, signature, tests, fiche, confidentialité et soumission. |
| Google Play, Android | [Google Play Console](https://play.google.com/console/about/) | Projet Android signé, paquet AAB, tests, fiche et déclarations de données/permissions. |
| Microsoft Store, Windows | [Publication Microsoft](https://learn.microsoft.com/en-us/windows/apps/publish/) | Choisir le paquet/application accepté, préparer fiche et certification. |
| macOS, Linux et autres appareils | URL HTTPS PWA ; paquet dédié si nécessaire | Installation selon le navigateur ; publication native et signature selon la cible. |
| Autres boutiques Android | Portail développeur de chaque boutique choisie | Vérifier ses règles, formats, pays disponibles et moyens de paiement. |

[Capacitor](https://capacitorjs.com/) est une piste pour réutiliser l’interface web dans des projets iOS/Android et ajouter des fonctions natives. Il faut néanmoins développer les ponts Santé/capteurs et sécuriser le stockage. Un simple site emballé peut ne pas satisfaire les [critères Apple de fonctionnalité](https://developer.apple.com/app-store/review/guidelines/).

Avant publication commerciale, prévoir un service réel : comptes centralisés, contrats et support, gestion des établissements, politique de confidentialité, suppression de compte, modération, données de test pour la revue, traductions validées et procédures d’incident. Les coûts de comptes développeur, d’hébergement, d’identité et de paiement doivent être vérifiés lors de l’inscription.

Pour le modèle économique, une option à étudier est un accès patient gratuit avec abonnement professionnel/établissement incluant suivi, formation et support. Valider d’abord ce modèle avec quelques structures pilotes et utilisateurs, puis vérifier les règles de paiement des stores et les conditions de distribution des pays visés. La publication dans un store ne remplace pas la validation du service médical.

## 8. Versions téléphone, tablette et ordinateur fournies

Le pack contient **une PWA adaptative commune**, avec trois formats d’écran :

- Téléphone : interface compacte, navigation basse et commandes tactiles.
- Tablette : espace patient élargi et cartes adaptées ; espace médecin ajusté à l’écran.
- Ordinateur : espace médecin vaste et espace patient plus large.

iPhone/iPad : ouvrir l’URL HTTPS dans Safari → Partager → Ajouter à l’écran d’accueil ; activer l’ouverture comme application web si proposée. Android : Chrome → menu → Installer, selon le navigateur. Ordinateur : ouvrir la même URL et utiliser l’installation proposée par le navigateur compatible.

Le ZIP ne contient pas de `.apk`, `.aab`, `.ipa` ni installateur Windows. Ces versions signées nécessitent les projets natifs, les comptes développeur et une chaîne de compilation. Les comptes locaux ne sont pas synchronisés entre ces installations.

## 9. Faible connexion et personnes âgées

**Ce qui fonctionne maintenant :** après une première visite réussie, la PWA peut rouvrir son interface et son annuaire intégré hors connexion. Sur le même appareil et la même origine, les comptes et mesures locaux restent accessibles tant que le navigateur conserve son stockage. La sauvegarde locale ne nécessite pas Internet. Les cartes, liens externes, newsletter et nouvelles connexions Apple/Google nécessitent Internet ; les appels nécessitent le réseau téléphonique.

L’indicateur distingue « Internet disponible, données locales sans synchronisation », « Hors connexion » et « Sauvegarde impossible ». Il ne prétend pas qu’une mesure a été reçue par le médecin. Sans serveur, aucune synchronisation patient–médecin distante n’existe. Le système peut supprimer le stockage d’une application web : l’accès hors connexion ne doit pas être l’unique copie d’un dossier important.

**Prochaine étape pour une région avec coupures :** stockage local chiffré, file d’envoi persistante, statut « enregistré / en attente / reçu par le serveur », reprises après coupure, identifiants uniques pour éviter les doublons et résolution des conflits. Les modifications de traitement doivent suivre une procédure clinique explicite ; ne pas les fusionner automatiquement sans contrôle. Prévoir une copie imprimée utile lorsque le téléphone ou le réseau sont indisponibles.

**Lecture facile ajoutée :** ouvrir Langues & accessibilité → activer Mode lecture facile. Les caractères et boutons sont plus grands, l’accueil patient présente quatre actions et les médicaments du jour peuvent être cochés directement. Le réglage des animations reste disponible. Un agrandissement du texte est également possible sans activer l’accueil simplifié.

Pour un déploiement réel auprès de personnes âgées : tester les parcours avec elles, prévoir une courte formation, un guide illustré, des messages simples et un proche aidant avec autorisation propre. Éviter le partage d’un même mot de passe. L’assistance vocale et la délégation sécurisée sont des améliorations possibles, pas des fonctions déjà activées dans ce pack.
