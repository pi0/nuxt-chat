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

export async function getMessages(count = 10) {
  const db = useDatabase();
  const {rows } = await db.sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT ${count}`
  return rows;
}

