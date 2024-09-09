import { sql } from '@vercel/postgres'
import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import path from 'path'
import { db } from '.'

config({ path: '.env.local' })
;(async () => {
    await migrate(db, { migrationsFolder: path.resolve(__dirname, './migrations') })
    sql.end()
})()
