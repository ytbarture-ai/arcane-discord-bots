# Arcane Discord Bots

Ce dépôt contient le code source des bots Discord **Arcane** et **Arcane Chan**, conçus pour la modération, la gestion des niveaux, de l'XP et des récompenses sur votre serveur Discord. Le projet est configuré pour un déploiement facile sur [Railway](https://railway.app/) et utilise des variables d'environnement pour la sécurité des tokens.

## Fonctionnalités

Les deux bots partagent les mêmes fonctionnalités, incluant :

*   **Modération** : `/ban`, `/kick`, `/mute`, `/unmute`, `/clear`, `/lock`, `/unlock`, `/slowmode`, `/case` (gestion des cas).
*   **Niveaux & XP** : `/level`, `/rank`, `/leaderboard`, `/card` (personnalisation de carte), `/rewards` (récompenses de niveau), `/xp` (gestion manuelle de l'XP).
*   **Informations** : `/avatar`, `/userinfo`, `/server-info`, `/role-info`, `/boosters`, `/stats`, `/invite`, `/vote`.
*   **Configuration** : `/dashboard`, `/prefix` (préfixe textuel).
*   **Premium** : `/premium` (informations sur la future version).
*   **Support** : `/support`.

## Déploiement sur Railway

Le déploiement de ce projet sur Railway est simplifié grâce au fichier `railway.json` inclus. Suivez ces étapes pour mettre vos bots en ligne :

### 1. Créer une application Discord

Pour chaque bot (Arcane et Arcane Chan), vous devez créer une application sur le [Portail des Développeurs Discord](https://discord.com/developers/applications) :

1.  Cliquez sur **New Application**.
2.  Donnez un nom à votre bot (par exemple, `Arcane` ou `Arcane Chan`).
3.  Dans l'onglet **Bot**, cliquez sur **Add Bot**.
4.  Sous la section **Token**, cliquez sur **Reset Token** et copiez le token. **Gardez ce token secret et ne le partagez jamais.**
5.  Activez les **Privileged Gateway Intents** nécessaires (au minimum `PRESENCE INTENT`, `SERVER MEMBERS INTENT`, `MESSAGE CONTENT INTENT`).
6.  Dans l'onglet **OAuth2** > **URL Generator**, sélectionnez `bot` et `applications.commands` dans la section `SCOPES`.
7.  Dans la section `BOT PERMISSIONS`, sélectionnez les permissions suivantes :
    *   `Read Messages/View Channels`
    *   `Send Messages`
    *   `Embed Links`
    *   `Attach Files`
    *   `Read Message History`
    *   `Manage Messages`
    *   `Kick Members`
    *   `Ban Members`
    *   `Moderate Members`
    *   `Manage Channels`
    *   `Manage Roles`
    *   `View Audit Log`
8.  Copiez l'URL générée et utilisez-la pour inviter votre bot sur votre serveur Discord.

Répétez ces étapes pour le deuxième bot.

### 2. Déployer sur Railway

1.  Connectez-vous à votre compte [Railway](https://railway.app/).
2.  Créez un nouveau projet et connectez-le à votre dépôt GitHub `ytbarture-ai/arcane-discord-bots`.
3.  Railway détectera automatiquement le fichier `railway.json` et configurera le build et le démarrage du service.

### 3. Configurer les variables d'environnement

Dans les paramètres de votre service Railway, ajoutez les variables d'environnement suivantes :

*   `ARCANE_TOKEN` : Le token du bot Arcane (copié à l'étape 1).
*   `ARCANE_CHAN_TOKEN` : Le token du bot Arcane Chan (copié à l'étape 1).
*   `PREFIX` (optionnel) : Le préfixe pour les commandes textuelles (par défaut `!`).

### 4. Configurer le volume persistant

Pour que les données des bots (cas de modération, XP, niveaux, etc.) soient persistantes entre les déploiements, vous devez attacher un volume à votre service Railway :

1.  Dans le tableau de bord Railway de votre projet, cliquez sur **New** > **Database** > **Volume**.
2.  Connectez ce volume à votre service de bot.
3.  Définissez le chemin de montage (Mount Path) du volume à `/data`.

Le bot détectera automatiquement ce volume et y stockera ses données.

### 5. Démarrer le service

Une fois les variables d'environnement et le volume configurés, redéployez votre service sur Railway. Les bots devraient se connecter à Discord et être opérationnels.

## Développement local

Pour développer localement :

1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/ytbarture-ai/arcane-discord-bots.git
    cd arcane-discord-bots
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Créez un fichier `.env` à la racine du projet et ajoutez vos tokens Discord :
    ```
    ARCANE_TOKEN=VOTRE_TOKEN_ARCANE
    ARCANE_CHAN_TOKEN=VOTRE_TOKEN_ARCANE_CHAN
    ```
4.  Lancez le projet :
    ```bash
    npm start
    ```
    Ou en mode développement avec rechargement automatique :
    ```bash
    npm run dev
    ```

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub ou contacter le support de Railway pour les problèmes liés à la plateforme.
