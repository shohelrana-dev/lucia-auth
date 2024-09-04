import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const client = createClient({
    url: process.env.DATASITE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema: schema })
