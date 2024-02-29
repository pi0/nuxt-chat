export function migrateDatabase() {
  const db = useDatabase();
  db.sql`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT,
    message TEXT
  )`;
}

export function addMessage(user: string, message: string) {
  const db = useDatabase();
  db.sql`INSERT INTO messages (user, message) VALUES (${user}, ${message})`;
}

export async function getMessages(count = 5, orderDesc: boolean = true) {
  const db = useDatabase();

  const rows = await db
    .prepare(
      orderDesc
        ? "SELECT * FROM messages ORDER BY created_at DESC LIMIT ?"
        : "SELECT * FROM messages ORDER BY created_at ASC LIMIT ?"
    )
    .all(count);

  if (!rows) {
    throw createError("SQL Failed");
  }

  if (orderDesc) {
    //@ts-ignore
    rows.reverse();
  }

  return rows as {
    id: number;
    user: string;
    message: string;
    created_at: string;
  }[];
}
