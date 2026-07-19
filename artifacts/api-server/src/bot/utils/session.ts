// Short-lived in-memory session store for setup flow
// Stores setup descriptions keyed by a short ID to avoid Discord's 100-char customId limit

const sessions = new Map<string, { description: string; createdAt: number }>();

// Clean up sessions older than 30 minutes
function cleanup() {
  const threshold = Date.now() - 30 * 60 * 1000;
  for (const [id, session] of sessions) {
    if (session.createdAt < threshold) sessions.delete(id);
  }
}

let counter = 0;

export function storeDescription(description: string): string {
  cleanup();
  const id = `s${Date.now().toString(36)}${(++counter).toString(36)}`;
  sessions.set(id, { description, createdAt: Date.now() });
  return id;
}

export function getDescription(id: string): string | null {
  return sessions.get(id)?.description ?? null;
}
