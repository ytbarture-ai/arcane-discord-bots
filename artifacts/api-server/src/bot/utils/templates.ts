import type { ServerStructure } from "./serverStructure.js";

const templates: Record<string, Record<string, ServerStructure>> = {
  gaming: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text", topic: "Règles du serveur" }, { name: "annonces", type: "announcement", topic: "Annonces officielles" }, { name: "bienvenus", type: "text" }] },
        { name: "💬 GÉNÉRAL", channels: [{ name: "général", type: "text", topic: "Discussion générale" }, { name: "memes", type: "text" }, { name: "recherche-équipe", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "clips-highlights", type: "text" }, { name: "stratégies", type: "text" }, { name: "tournois", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Lobby", type: "voice" }, { name: "Équipe 1", type: "voice" }, { name: "Équipe 2", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ MODÉRATION", channels: [{ name: "logs", type: "text" }, { name: "rapports", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⚔️ Modérateur", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🎮 Pro Gamer", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🏅 Vétéran", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Membre", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nouveau", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }, { name: "welcome", type: "text" }] },
        { name: "💬 GENERAL", channels: [{ name: "general", type: "text" }, { name: "memes", type: "text" }, { name: "looking-for-group", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "clips-highlights", type: "text" }, { name: "strategies", type: "text" }, { name: "tournaments", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Lobby", type: "voice" }, { name: "Team 1", type: "voice" }, { name: "Team 2", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ MODERATION", channels: [{ name: "logs", type: "text" }, { name: "reports", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⚔️ Moderator", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🎮 Pro Gamer", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🏅 Veteran", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Member", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Newcomer", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }, { name: "bienvenida", type: "text" }] },
        { name: "💬 GENERAL", channels: [{ name: "general", type: "text" }, { name: "memes", type: "text" }, { name: "buscar-equipo", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "clips-highlights", type: "text" }, { name: "estrategias", type: "text" }, { name: "torneos", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Lobby", type: "voice" }, { name: "Equipo 1", type: "voice" }, { name: "Equipo 2", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ MODERACIÓN", channels: [{ name: "logs", type: "text" }, { name: "reportes", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⚔️ Moderador", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🎮 Pro Gamer", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🏅 Veterano", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Miembro", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nuevo", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },

  community: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "announcement" }, { name: "rôles-choix", type: "text" }] },
        { name: "💬 COMMUNAUTÉ", channels: [{ name: "général", type: "text" }, { name: "présentations", type: "text" }, { name: "sondages", type: "text" }, { name: "suggestions", type: "text" }] },
        { name: "🎉 LOISIRS", channels: [{ name: "humour", type: "text" }, { name: "musique", type: "text" }, { name: "photos", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Salon général", type: "voice" }, { name: "Détente", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-général", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Fondateur", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🔨 Modérateur", color: "#e67e22", hoist: true, mentionable: true },
        { name: "⭐ VIP", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌟 Actif", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Membre", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nouveau", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }, { name: "self-roles", type: "text" }] },
        { name: "💬 COMMUNITY", channels: [{ name: "general", type: "text" }, { name: "introductions", type: "text" }, { name: "polls", type: "text" }, { name: "suggestions", type: "text" }] },
        { name: "🎉 HANGOUT", channels: [{ name: "memes", type: "text" }, { name: "music", type: "text" }, { name: "media", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "General", type: "voice" }, { name: "Chill", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-chat", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Founder", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🔨 Moderator", color: "#e67e22", hoist: true, mentionable: true },
        { name: "⭐ VIP", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌟 Active", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Member", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Newcomer", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }, { name: "roles-opcionales", type: "text" }] },
        { name: "💬 COMUNIDAD", channels: [{ name: "general", type: "text" }, { name: "presentaciones", type: "text" }, { name: "encuestas", type: "text" }, { name: "sugerencias", type: "text" }] },
        { name: "🎉 ENTRETENIMIENTO", channels: [{ name: "memes", type: "text" }, { name: "musica", type: "text" }, { name: "fotos", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "General", type: "voice" }, { name: "Relax", type: "voice" }, { name: "AFK", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-chat", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Fundador", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🔨 Moderador", color: "#e67e22", hoist: true, mentionable: true },
        { name: "⭐ VIP", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌟 Activo", color: "#3498db", hoist: false, mentionable: false },
        { name: "🌱 Miembro", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nuevo", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },

  school: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "announcement" }, { name: "emploi-du-temps", type: "text" }] },
        { name: "📚 COURS", channels: [{ name: "maths", type: "text" }, { name: "français", type: "text" }, { name: "sciences", type: "text" }, { name: "histoire-geo", type: "text" }, { name: "anglais", type: "text" }] },
        { name: "💬 SOCIAL", channels: [{ name: "général", type: "text" }, { name: "aide-devoirs", type: "text" }, { name: "détente", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Révisions", type: "voice" }, { name: "Détente", type: "voice" }] },
        { name: "👨‍🏫 STAFF", channels: [{ name: "professeurs", type: "text" }, { name: "administration", type: "text" }] },
      ],
      roles: [
        { name: "👨‍🏫 Professeur", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🌟 Délégué", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "📘 Terminale", color: "#3498db", hoist: false, mentionable: false },
        { name: "📗 Première", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "📙 Seconde", color: "#f39c12", hoist: false, mentionable: false },
        { name: "🆕 Élève", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }, { name: "schedule", type: "text" }] },
        { name: "📚 CLASSES", channels: [{ name: "math", type: "text" }, { name: "english", type: "text" }, { name: "science", type: "text" }, { name: "history", type: "text" }, { name: "languages", type: "text" }] },
        { name: "💬 SOCIAL", channels: [{ name: "general", type: "text" }, { name: "homework-help", type: "text" }, { name: "off-topic", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Study Room", type: "voice" }, { name: "Chill", type: "voice" }] },
        { name: "👨‍🏫 STAFF", channels: [{ name: "teachers", type: "text" }, { name: "admin", type: "text" }] },
      ],
      roles: [
        { name: "👨‍🏫 Teacher", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🌟 Class Rep", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "📘 Senior", color: "#3498db", hoist: false, mentionable: false },
        { name: "📗 Junior", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Student", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }, { name: "horarios", type: "text" }] },
        { name: "📚 CLASES", channels: [{ name: "matematicas", type: "text" }, { name: "lengua", type: "text" }, { name: "ciencias", type: "text" }, { name: "historia", type: "text" }, { name: "ingles", type: "text" }] },
        { name: "💬 SOCIAL", channels: [{ name: "general", type: "text" }, { name: "ayuda-deberes", type: "text" }, { name: "off-topic", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Estudio", type: "voice" }, { name: "Relax", type: "voice" }] },
        { name: "👨‍🏫 STAFF", channels: [{ name: "profesores", type: "text" }, { name: "administracion", type: "text" }] },
      ],
      roles: [
        { name: "👨‍🏫 Profesor", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e67e22", hoist: true, mentionable: true },
        { name: "🌟 Delegado", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "📘 Mayor", color: "#3498db", hoist: false, mentionable: false },
        { name: "📗 Intermedio", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Alumno", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },

  friends: {
    fr: {
      categories: [
        { name: "📢 INFOS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "text" }] },
        { name: "💬 CHAT", channels: [{ name: "général", type: "text" }, { name: "photos", type: "text" }, { name: "humour", type: "text" }, { name: "on-sort-quand", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "jeux", type: "text" }, { name: "parties-en-cours", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Salon principal", type: "voice" }, { name: "Gaming", type: "voice" }, { name: "Film", type: "voice" }] },
      ],
      roles: [
        { name: "👑 Fondateur", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⭐ BFF", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌱 Ami", color: "#2ecc71", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFO", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "text" }] },
        { name: "💬 CHAT", channels: [{ name: "general", type: "text" }, { name: "pics-and-memes", type: "text" }, { name: "plans", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "games", type: "text" }, { name: "looking-to-play", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Main", type: "voice" }, { name: "Gaming", type: "voice" }, { name: "Movie Night", type: "voice" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⭐ BFF", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌱 Friend", color: "#2ecc71", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFO", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "text" }] },
        { name: "💬 CHAT", channels: [{ name: "general", type: "text" }, { name: "fotos-y-memes", type: "text" }, { name: "planes", type: "text" }] },
        { name: "🎮 GAMING", channels: [{ name: "juegos", type: "text" }, { name: "busco-grupo", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Principal", type: "voice" }, { name: "Gaming", type: "voice" }, { name: "Pelis", type: "voice" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "⭐ Mejor Amigo", color: "#9b59b6", hoist: true, mentionable: false },
        { name: "🌱 Amigo", color: "#2ecc71", hoist: false, mentionable: false },
      ],
    },
  },

  roleplay: {
    fr: {
      categories: [
        { name: "📜 RÈGLES & LORE", channels: [{ name: "règles-rp", type: "text" }, { name: "lore-univers", type: "text" }, { name: "fiches-personnages", type: "text" }] },
        { name: "🌍 ROLEPLAY", channels: [{ name: "zone-de-départ", type: "text" }, { name: "ville-centrale", type: "text" }, { name: "forêt-mystérieuse", type: "text" }, { name: "taverne", type: "text" }] },
        { name: "💬 HORS-JEU", channels: [{ name: "général-hj", type: "text" }, { name: "candidatures", type: "text" }, { name: "suggestions", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Ambiance", type: "voice" }, { name: "Hors-Jeu", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-rp", type: "text" }, { name: "candidatures-validées", type: "text" }] },
      ],
      roles: [
        { name: "👑 Maître du Jeu", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📖 Scénariste", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "⚔️ Héros", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Joueur", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Candidat", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📜 RULES & LORE", channels: [{ name: "rp-rules", type: "text" }, { name: "lore-universe", type: "text" }, { name: "character-sheets", type: "text" }] },
        { name: "🌍 ROLEPLAY", channels: [{ name: "starting-zone", type: "text" }, { name: "main-city", type: "text" }, { name: "dark-forest", type: "text" }, { name: "tavern", type: "text" }] },
        { name: "💬 OUT OF CHARACTER", channels: [{ name: "general-ooc", type: "text" }, { name: "applications", type: "text" }, { name: "suggestions", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Ambiance", type: "voice" }, { name: "OOC", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-rp", type: "text" }, { name: "approved-apps", type: "text" }] },
      ],
      roles: [
        { name: "👑 Game Master", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📖 Lorekeeper", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "⚔️ Hero", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Player", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Applicant", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📜 REGLAS Y LORE", channels: [{ name: "reglas-rp", type: "text" }, { name: "lore-universo", type: "text" }, { name: "fichas-personaje", type: "text" }] },
        { name: "🌍 ROLEPLAY", channels: [{ name: "zona-de-inicio", type: "text" }, { name: "ciudad-principal", type: "text" }, { name: "bosque-oscuro", type: "text" }, { name: "taberna", type: "text" }] },
        { name: "💬 FUERA DE JUEGO", channels: [{ name: "general-fdj", type: "text" }, { name: "solicitudes", type: "text" }, { name: "sugerencias", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Ambiente", type: "voice" }, { name: "FDJ", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff-rp", type: "text" }, { name: "solicitudes-aprobadas", type: "text" }] },
      ],
      roles: [
        { name: "👑 Maestro del Juego", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📖 Cronista", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "⚔️ Héroe", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Jugador", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Candidato", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },

  creative: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "announcement" }] },
        { name: "🎨 CRÉATION", channels: [{ name: "galerie", type: "text" }, { name: "art-digital", type: "text" }, { name: "illustrations", type: "text" }, { name: "wip-en-cours", type: "text" }] },
        { name: "💬 COMMUNAUTÉ", channels: [{ name: "général", type: "text" }, { name: "critiques", type: "text" }, { name: "tutoriels", type: "text" }, { name: "commandes", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Création ensemble", type: "voice" }, { name: "Général", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Fondateur", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🎨 Artiste Confirmé", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "✏️ Artiste", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Créatif", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nouveau", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }] },
        { name: "🎨 CREATION", channels: [{ name: "gallery", type: "text" }, { name: "digital-art", type: "text" }, { name: "illustrations", type: "text" }, { name: "wip", type: "text" }] },
        { name: "💬 COMMUNITY", channels: [{ name: "general", type: "text" }, { name: "critique", type: "text" }, { name: "tutorials", type: "text" }, { name: "commissions", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Create Together", type: "voice" }, { name: "General", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Founder", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🎨 Pro Artist", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "✏️ Artist", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Creative", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Newcomer", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }] },
        { name: "🎨 CREACIÓN", channels: [{ name: "galeria", type: "text" }, { name: "arte-digital", type: "text" }, { name: "ilustraciones", type: "text" }, { name: "en-progreso", type: "text" }] },
        { name: "💬 COMUNIDAD", channels: [{ name: "general", type: "text" }, { name: "criticas", type: "text" }, { name: "tutoriales", type: "text" }, { name: "encargos", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Crear Juntos", type: "voice" }, { name: "General", type: "voice" }] },
        { name: "🛠️ STAFF", channels: [{ name: "staff", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Fundador", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🎨 Artista Pro", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "✏️ Artista", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Creativo", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nuevo", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },

  business: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "announcement" }, { name: "présentation-équipe", type: "text" }] },
        { name: "💼 TRAVAIL", channels: [{ name: "général", type: "text" }, { name: "projets", type: "text" }, { name: "tâches", type: "text" }, { name: "ressources", type: "text" }] },
        { name: "📊 BUSINESS", channels: [{ name: "stratégie", type: "text" }, { name: "marketing", type: "text" }, { name: "finances", type: "text" }] },
        { name: "🔊 RÉUNIONS", channels: [{ name: "Réunion principale", type: "voice" }, { name: "Bureau 1", type: "voice" }, { name: "Bureau 2", type: "voice" }] },
        { name: "🛠️ ADMIN", channels: [{ name: "direction", type: "text" }, { name: "rh", type: "text" }] },
      ],
      roles: [
        { name: "👑 CEO", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Direction", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📊 Manager", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "💼 Employé", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Stagiaire", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🤝 Partenaire", color: "#e67e22", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }, { name: "team-intro", type: "text" }] },
        { name: "💼 WORK", channels: [{ name: "general", type: "text" }, { name: "projects", type: "text" }, { name: "tasks", type: "text" }, { name: "resources", type: "text" }] },
        { name: "📊 BUSINESS", channels: [{ name: "strategy", type: "text" }, { name: "marketing", type: "text" }, { name: "finance", type: "text" }] },
        { name: "🔊 MEETINGS", channels: [{ name: "Main Meeting", type: "voice" }, { name: "Office 1", type: "voice" }, { name: "Office 2", type: "voice" }] },
        { name: "🛠️ ADMIN", channels: [{ name: "management", type: "text" }, { name: "hr", type: "text" }] },
      ],
      roles: [
        { name: "👑 CEO", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Director", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📊 Manager", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "💼 Employee", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Intern", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🤝 Partner", color: "#e67e22", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }, { name: "presentacion-equipo", type: "text" }] },
        { name: "💼 TRABAJO", channels: [{ name: "general", type: "text" }, { name: "proyectos", type: "text" }, { name: "tareas", type: "text" }, { name: "recursos", type: "text" }] },
        { name: "📊 NEGOCIO", channels: [{ name: "estrategia", type: "text" }, { name: "marketing", type: "text" }, { name: "finanzas", type: "text" }] },
        { name: "🔊 REUNIONES", channels: [{ name: "Reunión Principal", type: "voice" }, { name: "Oficina 1", type: "voice" }, { name: "Oficina 2", type: "voice" }] },
        { name: "🛠️ ADMIN", channels: [{ name: "direccion", type: "text" }, { name: "rrhh", type: "text" }] },
      ],
      roles: [
        { name: "👑 CEO", color: "#f1c40f", hoist: true, mentionable: true },
        { name: "🛡️ Director", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "📊 Manager", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "💼 Empleado", color: "#3498db", hoist: true, mentionable: false },
        { name: "🌱 Becario", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🤝 Socio", color: "#e67e22", hoist: false, mentionable: false },
      ],
    },
  },

  support: {
    fr: {
      categories: [
        { name: "📢 INFORMATIONS", channels: [{ name: "règles", type: "text" }, { name: "annonces", type: "announcement" }, { name: "faq", type: "text" }] },
        { name: "🛠️ SUPPORT", channels: [{ name: "créer-un-ticket", type: "text" }, { name: "support-général", type: "text" }, { name: "bugs", type: "text" }] },
        { name: "💬 COMMUNAUTÉ", channels: [{ name: "général", type: "text" }, { name: "off-topic", type: "text" }] },
        { name: "🔊 VOCAL", channels: [{ name: "Support Vocal", type: "voice" }, { name: "Général", type: "voice" }] },
        { name: "🔒 STAFF", channels: [{ name: "staff-interne", type: "text" }, { name: "tickets-archive", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛠️ Support Senior", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🔧 Support", color: "#3498db", hoist: true, mentionable: true },
        { name: "🌱 Client", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nouveau", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    en: {
      categories: [
        { name: "📢 INFORMATION", channels: [{ name: "rules", type: "text" }, { name: "announcements", type: "announcement" }, { name: "faq", type: "text" }] },
        { name: "🛠️ SUPPORT", channels: [{ name: "open-a-ticket", type: "text" }, { name: "general-support", type: "text" }, { name: "bug-reports", type: "text" }] },
        { name: "💬 COMMUNITY", channels: [{ name: "general", type: "text" }, { name: "off-topic", type: "text" }] },
        { name: "🔊 VOICE", channels: [{ name: "Support Voice", type: "voice" }, { name: "General", type: "voice" }] },
        { name: "🔒 STAFF", channels: [{ name: "staff-internal", type: "text" }, { name: "ticket-archive", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛠️ Senior Support", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🔧 Support", color: "#3498db", hoist: true, mentionable: true },
        { name: "🌱 Customer", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 New", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
    es: {
      categories: [
        { name: "📢 INFORMACIÓN", channels: [{ name: "reglas", type: "text" }, { name: "anuncios", type: "announcement" }, { name: "faq", type: "text" }] },
        { name: "🛠️ SOPORTE", channels: [{ name: "abrir-ticket", type: "text" }, { name: "soporte-general", type: "text" }, { name: "reportar-bug", type: "text" }] },
        { name: "💬 COMUNIDAD", channels: [{ name: "general", type: "text" }, { name: "off-topic", type: "text" }] },
        { name: "🔊 VOZ", channels: [{ name: "Soporte Voz", type: "voice" }, { name: "General", type: "voice" }] },
        { name: "🔒 STAFF", channels: [{ name: "staff-interno", type: "text" }, { name: "tickets-archivo", type: "text" }, { name: "logs", type: "text" }] },
      ],
      roles: [
        { name: "👑 Owner", color: "#f1c40f", hoist: true, mentionable: false },
        { name: "🛡️ Admin", color: "#e74c3c", hoist: true, mentionable: true },
        { name: "🛠️ Soporte Senior", color: "#9b59b6", hoist: true, mentionable: true },
        { name: "🔧 Soporte", color: "#3498db", hoist: true, mentionable: true },
        { name: "🌱 Cliente", color: "#2ecc71", hoist: false, mentionable: false },
        { name: "🆕 Nuevo", color: "#95a5a6", hoist: false, mentionable: false },
      ],
    },
  },
};

export function getTemplate(serverType: string, language: string): ServerStructure {
  const lang = ["fr", "en", "es"].includes(language) ? language : "fr";
  const type = templates[serverType] ? serverType : "community";
  return templates[type][lang]!;
}

const keywords: Record<string, string[]> = {
  gaming: ["game","gaming","jeu","jeux","gamer","fortnite","minecraft","valorant","lol","fps","mmo","rpg","tournoi","tournament","esport","twitch","stream","clip","highlight","competitive","compétitif","xbox","playstation","ps5","ps4","cod","apex","overwatch","rocket","league"],
  school: ["école","school","étude","study","cours","class","classe","devoir","homework","examen","exam","lycée","collège","université","university","bac","prof","teacher","élève","student","révision","revision"],
  roleplay: ["rp","roleplay","role play","lore","personnage","character","fiction","histoire","fantasy","médiéval","medieval","scénario","scenario","univers","universe","hors-jeu","ooc","taverne","tavern","quête","quest"],
  creative: ["art","créatif","creative","dessin","drawing","illustration","design","graphisme","graphic","photo","musique","music","écriture","writing","peinture","paint","3d","animation","créateur","creator","artiste","artist"],
  business: ["business","travail","work","entreprise","company","projet","project","équipe","team","pro","professionnel","professional","startup","marketing","finance","rh","hr","réunion","meeting","bureau","office"],
  support: ["support","aide","help","assistance","ticket","service","client","customer","bug","report","signalement","helpdesk","technique","technical"],
  friends: ["ami","friend","amis","friends","pote","potes","squad","groupe","privé","private","famille","family"],
  community: ["communauté","community","général","general","social","discord","serveur","server","membre","member","partage","share"],
};

export function detectServerType(description: string): string {
  const lower = description.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [type, words] of Object.entries(keywords)) {
    scores[type] = words.filter(w => lower.includes(w)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "community";
}
