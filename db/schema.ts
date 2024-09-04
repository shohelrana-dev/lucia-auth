import { integer, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'

export const accountTypeEnum = ['email', 'google', 'facebook'] as const
export type AccountTypeEnum = 'email' | 'google' | 'facebook'
export const verificationTypeEnum = ['email_verification', 'password_reset'] as const
export type VerificationTypeEnum = 'email_verification' | 'password_reset'

const sqliteTable = sqliteTableCreator((name) => `app_${name}`)

export const users = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name'),
    picture: text('picture'),
    email: text('email').unique(),
    emailVerified: integer('email_verified', { mode: 'timestamp' }),
})

export const accounts = sqliteTable('accounts', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: integer('user_id', { mode: 'number' })
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    accountType: text('account_type', { enum: accountTypeEnum }).notNull(),
    googleId: text('google_id').unique(),
    facebookId: text('facebook_id').unique(),
    password: text('password'),
    salt: text('salt'),
})

export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    userId: integer('user_id', { mode: 'number' })
        .references(() => users.id, {
            onDelete: 'cascade',
        })
        .notNull(),
    expiresAt: integer('expires_at').notNull(),
})

export const verificationTokens = sqliteTable('verification_tokens', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: integer('user_id', { mode: 'number' })
        .references(() => users.id, { onDelete: 'cascade' })
        .unique()
        .notNull(),
    type: text('type', { enum: verificationTypeEnum }).notNull(),
    token: text('token').notNull(),
    tokenExpiresAt: integer('token_expires_at', { mode: 'timestamp' }).notNull(),
})
