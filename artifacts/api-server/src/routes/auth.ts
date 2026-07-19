import { Router } from "express";
import { logger } from "../lib/logger.js";

const router = Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const SESSION_SECRET = process.env.SESSION_SECRET ?? "fallback-secret";

// Simple in-memory session store
const sessions = new Map<string, { userId: string; username: string; avatar: string | null; accessToken: string; expiresAt: number }>();

function makeSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getRedirectUri(req: any): string {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  return `${proto}://${host}/api/auth/discord/callback`;
}

// GET /api/auth/discord → redirect to Discord OAuth
router.get("/auth/discord", (req, res) => {
  const redirectUri = getRedirectUri(req);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds",
  });
  res.redirect(`https://discord.com/oauth2/authorize?${params}`);
});

// GET /api/auth/discord/callback → exchange code, create session
router.get("/auth/discord/callback", async (req, res) => {
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    return res.redirect("/?auth=error");
  }

  const redirectUri = getRedirectUri(req);

  try {
    // Exchange code for token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      logger.error({ status: tokenRes.status }, "Discord token exchange failed");
      return res.redirect("/?auth=error");
    }

    const tokenData = await tokenRes.json() as { access_token: string; expires_in: number };

    // Fetch user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return res.redirect("/?auth=error");
    }

    const user = await userRes.json() as { id: string; username: string; avatar: string | null };

    // Create session
    const sessionId = makeSessionId();
    sessions.set(sessionId, {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    res.cookie("sid", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokenData.expires_in * 1000,
    });

    res.redirect("/generate");
  } catch (err) {
    logger.error({ err }, "Discord OAuth error");
    res.redirect("/?auth=error");
  }
});

// GET /api/auth/me → current user info
router.get("/auth/me", (req, res) => {
  const sid = req.cookies?.sid;
  const session = sessions.get(sid);
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ user: null });
  }
  res.json({
    user: {
      id: session.userId,
      username: session.username,
      avatar: session.avatar
        ? `https://cdn.discordapp.com/avatars/${session.userId}/${session.avatar}.png`
        : null,
    },
  });
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) sessions.delete(sid);
  res.clearCookie("sid");
  res.json({ ok: true });
});

export default router;
