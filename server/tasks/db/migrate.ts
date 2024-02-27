import { migrateDatabase } from "~/server/utils/database"

export default defineTask({
  async run() {
    await migrateDatabase();
    return { result: 'ok' }
  }
})
